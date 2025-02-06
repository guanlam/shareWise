<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get the type query parameter, e.g. ?type=Expense or ?type=Income
        $type = $request->input('type');

        // Build a query to include predefined categories (user_id is null)
        // or those created by the authenticated user.
        $query = Category::where(function ($q) {
            $q->whereNull('user_id')
            ->orWhere('user_id', Auth::id());
        });

        // If a type is provided, filter by that type.
        if ($type) {
            $query->where('type', $type);
        }

        $categories = $query->get();

        return response()->json($categories);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
