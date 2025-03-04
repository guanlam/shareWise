<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
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
        // Get the type and id query parameters
        $type = $request->input('type');
        $id = $request->input('id');

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

        // If an id is provided, filter by that id.
        if ($id) {
            $query->where('id', $id);
        }

        // Execute the query and get the categories
        $categories = $query->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $category = Category::create([
            ...$data,
            'user_id' => Auth::id(),

        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category
        ], 201);
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
        // Validate the request inputs
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'icon'  => 'required|string',
            'color' => 'required|string',
            'type'  => 'required|string', // ensure this is provided if needed
        ]);

        // Update the category record with the validated data
        $category->update($data);

        // Return a success JSON response (or redirect as needed)
        return response()->json([
            'message'  => 'Category updated successfully',
            'category' => $category
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
        // Optionally, ensure the budget belongs to the authenticated user.
        if ($category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Category failed.', 'error' => $e->getMessage()], 500);
        }

    }


    public function showCustom($type)
    {
        // Query the categories based on the passed 'type' and the authenticated user's 'user_id'
        $categories = Category::where('type', $type)
                            ->where('user_id', auth()->id())
                            ->get();

        

        return response()->json($categories);
    }



}
