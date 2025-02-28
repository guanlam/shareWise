<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        
        // for debug purpose
        // \Log::info('Updating user:', ['user_id' => $user->id, 'data' => $data]);
        $user->update($data);

        
        return response()->json(['message' => 'User updated successfully.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        $user->delete();
        return response('', 204);
    }


    public function updatePassword(UpdateUserPasswordRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Manually check current password, since we want to validate against the stored password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => [
                    'currentPassword' => ['Current password is incorrect.']
                ]
            ], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.'], 200);
    }




    // // testing
    // public function previewReport($userId)
    // {
    //     $user = User::findOrFail($userId);

    //     // Generate the report data for this user
    //     $reportData = $this->generateReportData($user);

    //     // Return the report view and pass the data to it
    //     return view('view.monthly-financial-report', compact('reportData'));
    // }

    // protected function generateReportData(User $user)
    // {
    //     $now = Carbon::now();
    //     $startOfMonth = $now->copy()->startOfMonth();
    //     $endOfMonth = $now->copy()->endOfMonth();

       
    //     // Get income and expense transactions for the user this month
    //     $incomeTransactions = Transaction::where('user_id', $user->id)
    //         ->where('type', 'Income')
    //         ->whereBetween('date', [$startOfMonth, $endOfMonth])
    //         ->get();

    //     $expenseTransactions = Transaction::where('user_id', $user->id)
    //         ->where('type', 'Expense')
    //         ->whereBetween('date', [$startOfMonth, $endOfMonth])
    //         ->get();

    //     // Calculate totals
    //     $totalIncome = $incomeTransactions->sum('amount');
    //     $totalSpending = $expenseTransactions->sum('amount');
    //     $savings = $totalIncome - $totalSpending;

    //     // Categorize expenses
    //     $categorizedExpenses = $expenseTransactions->groupBy('category_id')->map(function($group) {
    //         return $group->sum('amount');
    //     });

        
    //     // Build chart data for the categories
    //     $expenseLabels = [];
    //     $expenseData = [];
    //     $expenseColor = [];
    //     foreach ($categorizedExpenses as $categoryId => $amount) {
    //         $category = Category::find($categoryId);
    //         if ($category) {
    //             $expenseLabels[] = $category->name . ' (RM ' . number_format($amount, 2) . ')';
    //             $expenseData[] = round($amount, 2);

    //             $expenseColor[] = $category->color;
    //         }
    //     }

    //     // Here, you can generate the URL for the chart or just skip it for now
    //     $chartConfig = [
    //         'type' => 'doughnut',
    //         'data' => [
    //             'labels' => $expenseLabels,
    //             'datasets' => [
    //                 [
    //                     'data' => $expenseData,
    //                     'backgroundColor' => $expenseColor,
    //                 ]
    //             ]
    //         ],
    //         'options' => [
    //             'legend' => ['position' => 'bottom']
    //         ]
    //     ];
    //     $chartConfigJson = urlencode(json_encode($chartConfig));
    //     $chartUrl = "https://quickchart.io/chart?c={$chartConfigJson}";

    //     return [
    //         'monthYear' => $now->format('F Y'),
    //         'totalIncome' => $totalIncome,
    //         'totalSpending' => $totalSpending,
    //         'savings' => $savings,
    //         'expenseChartUrl' => $chartUrl,
    //         'reportUrl' => url('/reports/monthly'),
    //         'generatedAt' => now()->toDateTimeString(),
    //         'expenseLabels' => $expenseLabels,
    //         'expenseData' => $expenseData,
    //         'user' => $user->id,
    //     ];
    // }

}
