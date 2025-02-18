<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Recurrence;
use App\Models\Transaction;
use App\Models\TransactionParticipant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            ->get();

        return response()->json($transactions);


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
                foreach ($data['participants'] as $participant) {
                    $transaction->participants()->attach($participant['participant_id'], [
                        'amount_owed' => $participant['amount_owed'],
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

            return response()->json(['message' => 'Transaction created successfully', 'transaction' => $transaction], 201);
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
}
