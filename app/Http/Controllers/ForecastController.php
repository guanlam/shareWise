<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\ChatGPTService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ForecastController extends Controller
{
    protected $chatGPT;
    public function __construct(ChatGPTService $chatGPT)
    {
        $this->chatGPT = $chatGPT;
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

    
    public function getBudgetSuggestion(Request $request)
    {
        // For example, use some parameters from the request (historicalAverage, forecasted value, etc.)
        $historicalAverage = $request->query('historicalAverage');
        $forecastValue = $request->query('forecastValue');

        // Build a prompt (this is just an example prompt)
        $prompt = "A user has a historical average monthly expense of RM {$historicalAverage} and a forecasted expense of RM {$forecastValue}. Provide budget adjustment suggestions to help the user manage their finances more effectively.";

        // Call your ChatGPT service (as explained before)
        $suggestion = app(ChatGPTService::class)->getSuggestion($prompt);

        return response()->json(['suggestion' => $suggestion]);
    }

}
