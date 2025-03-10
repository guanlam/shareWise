<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Mail\GroupExpenseEmail;
use App\Models\Participant;
use App\Models\Recurrence;
use App\Models\Transaction;
use App\Models\TransactionParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['category', 'paymentMethod', 'recurrence', 'participants' => function ($query) {
                $query->withPivot('amount_owed', 'payment_status'); // Include pivot table data
            }])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($transactions);


    }

    /**
     * Store a newly created resource in storage.
     */


     public function store(StoreTransactionRequest $request)
     {
         DB::beginTransaction(); // Start transaction to prevent partial inserts
     
         try {
             $data = $request->validated();
     
             // Create transaction (exclude recurrence_frequency)
             $transaction = Transaction::create([
                 'date' => $data['date'],
                 'amount' => $data['amount'],
                 'type' => $data['type'],
                 'description' => $data['description'] ?? null,
                 'group_expense' => $data['group_expense'] ?? false,
                 'recurrence' => $data['recurrence'] ?? false,
                 'category_id' => $data['category_id'],
                 'payment_method_id' => $data['payment_method_id'],
                 'user_id' => auth()->id(),
             ]);
     
             // ✅ Save Participants If Group Expense is True
             if ($data['group_expense']) {
                 foreach ($data['participants'] as $participantData) {
                     $transaction->participants()->attach($participantData['participant_id'], [
                         'amount_owed' => $participantData['amount_owed'],
                         'payment_status' => 'Pending'
                     ]);
                 }
             }
     
             // ✅ If recurrence is true, create a recurrence record
             if ($data['recurrence']) {
                 Recurrence::create([
                     'transaction_id' => $transaction->id,
                     'frequency' => $data['recurrence_frequency'], // Store in recurrences table
                     'next_generated_date' => $this->calculateNextDate($data['recurrence_frequency'], $data['date']),
                 ]);
             }
     
             DB::commit(); // Commit the transaction
     
             // ----- STEP 3: Send Email Notifications for Group Expense -----
             if ($data['group_expense']) {
                 // Optionally load the transaction's user (creator) if needed in the email
                 $transaction->load('user');
     
                 // Prepare a base64 version of your logo for the email (if needed)
                 $imagePath = public_path('images/logo-only.png');
                //  $base64Image = file_exists($imagePath) ? base64_encode(file_get_contents($imagePath)) : null;
     
                 // Loop through each participant to send them a personalized email
                 foreach ($data['participants'] as $participantData) {
                     // Retrieve the Participant model to get name & email
                     $participant = Participant::find($participantData['participant_id']);
     
                     if ($participant) {
                         // Generate a signed URL for "Mark as Paid" action (valid for 2 days)
                         $markAsPaidUrl = URL::temporarySignedRoute(
                             'markAsPaid',  // Make sure you have this route defined
                             now()->addDays(2),
                             [
                                 'transaction' => $transaction->id,
                                 'participant' => $participant->id,
                             ]
                         );
     
                         // Get the amount owed for this participant
                         $amountOwed = $participantData['amount_owed'];
     
                         // Send the email using your mailable
                         Mail::to($participant->email)
                             ->send(new GroupExpenseEmail(
                                 $participant,
                                 $transaction,
                                 $amountOwed,
                                 $markAsPaidUrl,
                                 $imagePath
                             ));
                     }
                 }
             }
             // --------------------------------------------------------------
     
             return response()->json([
                 'message' => 'Transaction created successfully',
                 'transaction' => $transaction
             ], 201);
         } catch (\Exception $e) {
             DB::rollBack(); // Rollback if anything fails
             return response()->json(['error' => $e->getMessage()], 500);
         }
     }
     



    private function calculateNextDate($frequency, $currentDate)
    {
        switch ($frequency) {
            case 'Daily':
                return Carbon::parse($currentDate)->addDay();
            case 'Weekly':
                return Carbon::parse($currentDate)->addWeek();
            case 'Monthly':
                return Carbon::parse($currentDate)->addMonth();
            case 'Yearly':
                return Carbon::parse($currentDate)->addYear();
            default:
                return null; // Should never happen if validation is correct
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        // Ensure the user only accesses their transactions
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($transaction->load(['category', 'paymentMethod']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction->update($request->validated());

        return response()->json(['message' => 'Transaction updated successfully', 'transaction' => $transaction]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted successfully']);
    }



    public function updateParticipantStatus(Request $request, Transaction $transaction, Participant $participant)
    {
        $request->validate([
            'payment_status' => 'required|string'
        ]);

        try {
            DB::transaction(function () use ($request, $transaction, $participant) {
                // Retrieve the pivot record for this participant.
                $pivotRecord = TransactionParticipant::where('transaction_id', $transaction->id)
                    ->where('participant_id', $participant->id)
                    ->first();

                if (!$pivotRecord) {
                    throw new \Exception('Pivot record not found.');
                }

                // Check if the payment is already marked as "Paid"
                if ($pivotRecord->payment_status === 'Paid') {
                    // Payment already processed; do nothing.
                    return;
                }

                // Update the pivot record to mark the participant as paid.
                $transaction->participants()->updateExistingPivot($participant->id, [
                    'payment_status' => $request->payment_status,
                ]);

                // Deduct the paid amount from the transaction's amount.
                if (isset($pivotRecord->amount_owed)) {
                    $paidAmount = floatval($pivotRecord->amount_owed);
                    $transaction->amount = floatval($transaction->amount) - $paidAmount;
                    $transaction->save();
                }
            });
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update payment status: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Payment status updated successfully',
            'transaction' => $transaction
        ]);
    }



    public function downloadMonthlyReport(Request $request, $userId)
    {
        // Optionally, verify that the user exists
        $user = User::findOrFail($userId);

        // Parse the requested month (default to current month)
        $monthString = $request->query('month', now()->format('Y-m'));
        $startOfMonth = Carbon::parse($monthString)->startOfMonth();
        $endOfMonth = Carbon::parse($monthString)->endOfMonth();

        // Fetch transactions for this month with the necessary relationships
        $transactions = Transaction::with(['category', 'paymentMethod', 'recurrenceData'])
            ->where('user_id', $userId)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->orderBy('date', 'asc')
            ->get();

        // Calculate totals
        $totalExpense = $transactions->where('type', 'Expense')->sum('amount');
        $totalIncome = $transactions->where('type', 'Income')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        // Define additional variables
        $monthYear = $startOfMonth->format('F Y');  // e.g., "December 2024"

        // Load the PDF view with the gathered data
        $pdf = app('dompdf.wrapper');
        $pdf->setPaper('a4', 'landscape'); // Change orientation to landscape
        $pdf->loadView('view.monthly-transaction-report', [
            'monthYear'    => $monthYear,
            'userName'     => $user->name,
            'transactions' => $transactions,
            'totalExpense' => $totalExpense,
            'totalIncome'  => $totalIncome,
            'netBalance'   => $netBalance,
            'generatedAt'  => now()->toDateTimeString(),
        ]);

        // Download the PDF file with a dynamic name
        $fileName = 'TransactionReport-' . $startOfMonth->format('Y-m') . '.pdf';
        return $pdf->download($fileName);
    }




    



}
