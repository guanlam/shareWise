<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transaction;
use App\Models\Recurrence;
use Carbon\Carbon;

class GenerateRecurringTransactions extends Command
{
    protected $signature = 'transactions:generate-recurring';
    protected $description = 'Generate new transactions for recurring records';

    public function handle()
    {
        // Get all recurrences that need a new transaction
        $recurrences = Recurrence::where('next_generated_date', '<=', Carbon::today())->get();

        foreach ($recurrences as $recurrence) {
            // Find the original transaction
            $originalTransaction = Transaction::find($recurrence->transaction_id);
            if (!$originalTransaction) continue;

            // Create a new transaction (same details except recurrence)
            $newTransaction = Transaction::create([
                'date' => Carbon::today()->toDateString(),
                'amount' => $originalTransaction->amount,
                'type' => $originalTransaction->type,
                'description' => $originalTransaction->description,
                'group_expense' => $originalTransaction->group_expense,
                'category_id' => $originalTransaction->category_id,
                'payment_method_id' => $originalTransaction->payment_method_id,
                'user_id' => $originalTransaction->user_id,
                'recurrence' => false, // New transaction should not be recurring
            ]);

            // Update recurrence with new `next_generated_date`
            $recurrence->update([
                'next_generated_date' => $this->calculateNextDate($recurrence->frequency, $recurrence->next_generated_date),
            ]);
        }

        $this->info('Recurring transactions generated successfully.');
    }

    private function calculateNextDate($frequency, $currentDate)
    {
        switch ($frequency) {
            case 'Daily':
                return Carbon::parse($currentDate)->addDay()->toDateString();
            case 'Weekly':
                return Carbon::parse($currentDate)->addWeek()->toDateString();
            case 'Monthly':
                return Carbon::parse($currentDate)->addMonth()->toDateString();
            case 'Yearly':
                return Carbon::parse($currentDate)->addYear()->toDateString();
            default:
                return null;
        }
    }
}

