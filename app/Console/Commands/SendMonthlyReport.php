<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\MonthlyFinancialReportEmail;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;

class SendMonthlyReport extends Command
{
    protected $signature = 'report:monthly';
    protected $description = 'Send monthly financial report to users';

    public function handle()
    {
        // Get all users (or the target users)
        $users = User::all();

        foreach ($users as $user) {
            // Gather your report data for the current user
            $reportData = $this->generateReportData($user);

            // Optionally, customize report data for each user.
            $reportData['userName'] = $user->name;
            
            // Send email with the report data for the user
            Mail::to($user->email)->send(new MonthlyFinancialReportEmail($reportData));
        }

        $this->info('Monthly financial reports sent successfully.');
    }

    protected function generateReportData(User $user)
    {
        $now = Carbon::now()->subMonth();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

       
        // Get income and expense transactions for the user this month
        $incomeTransactions = Transaction::where('user_id', $user->id)
            ->where('type', 'Income')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $expenseTransactions = Transaction::where('user_id', $user->id)
            ->where('type', 'Expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        // Calculate totals
        $totalIncome = $incomeTransactions->sum('amount');
        $totalSpending = $expenseTransactions->sum('amount');
        $savings = $totalIncome - $totalSpending;

        // Categorize expenses
        $categorizedExpenses = $expenseTransactions->groupBy('category_id')->map(function($group) {
            return $group->sum('amount');
        });

        
        // Build chart data for the categories
        $expenseLabels = [];
        $expenseData = [];
        $expenseColor = [];
        foreach ($categorizedExpenses as $categoryId => $amount) {
            $category = Category::find($categoryId);
            if ($category) {
                $expenseLabels[] = $category->name . ' (RM ' . number_format($amount, 2) . ')';
                $expenseData[] = round($amount, 2);

                $expenseColor[] = $category->color;
            }
        }

        // Here, you can generate the URL for the chart or just skip it for now
        $chartConfig = [
            'type' => 'doughnut',
            'data' => [
                'labels' => $expenseLabels,
                'datasets' => [
                    [
                        'data' => $expenseData,
                        'backgroundColor' => $expenseColor,
                    ]
                ]
            ],
            'options' => [
                'legend' => ['position' => 'bottom']
            ]
        ];
        $chartConfigJson = urlencode(json_encode($chartConfig));
        $chartUrl = "https://quickchart.io/chart?c={$chartConfigJson}";

        return [
            'monthYear' => $now->format('F Y'),
            'totalIncome' => $totalIncome,
            'totalSpending' => $totalSpending,
            'savings' => $savings,
            'expenseChartUrl' => $chartUrl,
            'generatedAt' => now()->toDateTimeString(),
            'expenseLabels' => $expenseLabels,
            'expenseData' => $expenseData,
            'user' => $user->id,
        ];
    }
}
