<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\GroupExpenseEmail;
use App\Models\Participant;
use App\Models\Transaction;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function markAsPaid(Transaction $transaction, Participant $participant)
    {
        // Retrieve the pivot record for this participant.
        $participantRecord = $transaction->participants()
            ->where('participant_id', $participant->id)
            ->first();

        if (!$participantRecord) {
            return redirect()->route('transaction-message')->with('error', 'Participant not found for this transaction.');
        }

        $pivotRecord = $participantRecord->pivot;

        // Check if payment is already marked as paid.
        if ($pivotRecord->payment_status === 'Paid') {
            return redirect()->route('transaction-message')->with('message', 'Payment has already been marked as paid.');
        }

        // Update the pivot record to mark the participant as paid.
        $transaction->participants()->updateExistingPivot($participant->id, [
            'payment_status' => 'Paid',
        ]);

        // Re-fetch the pivot record to ensure it's updated.
        $updatedPivot = $transaction->participants()
            ->where('participant_id', $participant->id)
            ->first()
            ->pivot;

        // Deduct the paid amount from the transaction's amount only if it wasn't already marked as paid.
        if (isset($updatedPivot->amount_owed)) {
            $paidAmount = floatval($updatedPivot->amount_owed);
            $transaction->amount = floatval($transaction->amount) - $paidAmount;
            $transaction->save();
        }

        return redirect()->route('transaction-message')->with('message', 'Payment marked as paid.');
    }



}

