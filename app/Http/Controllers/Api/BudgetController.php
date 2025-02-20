<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $budgets = Budget::where('user_id', Auth::id())->with('category')->get();
        return response()->json($budgets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data.
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'amount'      => 'required|numeric',
            'type'        => 'required|in:Income,Expense',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'category_id' => 'required|exists:categories,id',
        ]);

        // Associate the budget with the authenticated user.
        $data['user_id'] = Auth::id();

        // Create the budget record.
        $budget = Budget::create($data);

        // Return a JSON response with a success message and the created budget.
        return response()->json([
            'message' => 'Budget created successfully!',
            'budget'  => $budget
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Budget $budget)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $budget)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget)
    {
        //
    }



    public function getBudgetTransactions(Request $request)
    {
        // Validate incoming parameters
        $data = $request->validate([
            'start_date'  => 'required|date',
            'end_date'    => 'required|date',
            'type'        => 'required|in:Income,Expense',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $query = Transaction::where('user_id', Auth::id())
            ->whereBetween('date', [$data['start_date'], $data['end_date']])
            ->where('type', $data['type']);

        // If a category is provided, filter by it.
        if (!empty($data['category_id'])) {
            $query->where('category_id', $data['category_id']);
        }

        // Sum up the amounts; if type is Expense, you might consider taking absolute values.
        // For example, if expenses are stored as positive numbers, then:
        $total = $query->sum('amount');

        return response()->json(['total' => $total]);
    }
}
