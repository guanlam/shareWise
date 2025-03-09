<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\DeepseekService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ForecastController extends Controller
{
    protected $deepseek;

    public function __construct(DeepseekService $deepseek)
    {
        $this->deepseek = $deepseek;
    }

    /**
     * Return a budget suggestion based on previous month income, expense, and next month's forecast.
     */
    public function getBudgetSuggestion(Request $request)
    {
        // For example, these values could be calculated from your data,
        // or passed as query parameters for testing.
        $previousIncome = (float)$request->query('previousIncome', 8000);
        $previousExpense = (float)$request->query('previousExpense', 3000);
        $forecastValue = (float)$request->query('forecastValue', 3500);
        $categoryExpense = json_decode($request->query('categoryExpense', '[]'), true);

        $suggestion = $this->deepseek->getBudgetSuggestion($previousIncome, $previousExpense, $forecastValue,$categoryExpense);

        return response()->json([
            'suggestion' => $suggestion,
        ]);
    }


    public function getHistoricalIncome(Request $request)
    {
        // Get the current user's ID (assuming the user is authenticated)
        $userId = auth()->user()->id; // Adjust if using a different authentication method

        // Get the previous month date (using Carbon)
        $previousMonth = Carbon::now()->subMonth();

        // Get all 'Income' transactions for the current user from the previous month
        $transactions = Transaction::where('user_id', $userId)
            ->where('type', 'Income')  // Filter by 'Income' type
            ->whereMonth('date', $previousMonth->month) // Filter by the previous month
            ->whereYear('date', $previousMonth->year)  // Filter by the previous year
            ->get();

        

        // Group the transactions by 'YYYY-MM' (year and month)
        $groupedIncome = $transactions->groupBy(function ($item) {
            return Carbon::parse($item->date)->format('Y-m'); // Group by 'YYYY-MM' format
        });

        // Calculate the total income for each grouped month
        $historicalIncome = $groupedIncome->map(function ($items) {
            return $items->sum('amount'); // Sum the 'amount' field for each month
        });

        $expenseTransactions = Transaction::where('user_id', $userId)
            ->where('type', 'Expense')  // Filter by 'Expense' type
            ->with('category')
            ->whereMonth('date', $previousMonth->month) // Filter by the previous month
            ->whereYear('date', $previousMonth->year)  // Filter by the previous year
            ->get();

        // Group the transactions by 'category.id' and calculate the total amount for each category
        $groupedExpenses = $expenseTransactions->groupBy(function ($item) {
            // Group by category ID instead of name
            return $item->category->id;  // Group by category ID
        });

        // Calculate the total amount for each category
        $totalExpensesByCategory = $groupedExpenses->map(function ($items, $categoryId) {
            return [
                'categoryName' => $items->first()->category->name,  // Get the category name from the first item
                'totalAmount' => $items->sum('amount'),  // Sum the 'amount' field for each category
            ];
        });

        // Return the historical income data as a JSON response
        return response()->json([
            'historicalIncome' => $historicalIncome,
            'categories' => $totalExpensesByCategory
        ]);
    }
    

    



    public function getHistoricalMonthlyExpenses(Request $request)
    {
        $userId = auth()->id(); // authenticated user

        // Let's assume the forecast should use the previous 11 months.
        // For example, if current month is Feb 2025, historical data will be from March 2024 to January 2025.
        $current = Carbon::now()->startOfMonth(); // e.g., 2025-02-01
        $historicalMonths = 11; 
        $start = $current->copy()->subMonths($historicalMonths); // e.g., 2024-03-01

        // Query transactions for the user, only expenses, within the historical period.
        $monthlyExpenses = Transaction::select(
                DB::raw('YEAR(date) as year'),
                DB::raw('MONTH(date) as month'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->where('user_id', $userId)
            ->where('type', 'Expense')
            ->whereBetween('date', [$start, $current->copy()->subDay()]) // up to the end of the previous month
            ->groupBy(DB::raw('YEAR(date)'), DB::raw('MONTH(date)'))
            ->orderBy(DB::raw('YEAR(date)'))
            ->orderBy(DB::raw('MONTH(date)'))
            ->get();

        // Build a continuous time series from $start to the month before $current.
        $data = [];
        $period = new \DatePeriod($start, new \DateInterval('P1M'), $current); // excludes $current
        foreach ($period as $dt) {
            $key = $dt->format('Y-m');
            $data[$key] = 0;
        }

        // Fill in the aggregated values from the query.
        foreach ($monthlyExpenses as $record) {
            $key = sprintf('%04d-%02d', $record->year, $record->month);
            if (isset($data[$key])) {
                $data[$key] = (float)$record->total_amount;
            }
        }

        return response()->json([
            'historicalExpenses' => $data // keys are like "2024-03", "2024-04", ..., "2025-01"
        ]);
    }

    
    

}
