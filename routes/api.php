<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use App\Models\User;
// use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Default model binding works for routes like /user/{user}, where Laravel knows {user} refers to the User model.
// When you use a custom route like /user-profile/{user}, Laravel doesn't know how to resolve {user} unless you manually tell it    what to do. This is what Route::bind() does.
// By adding Route::bind(), you explicitly tell Laravel to treat {user} as a User model, resolving it based on the ID in the URL.

Route::bind('user', function ($value) {
    return User::findOrFail($value); // Or use another method to fetch the user based on your requirement
});

//end


Route::middleware('auth:sanctum')->group(function (){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout',[AuthController::class, 'logout']);
    
    Route::put('/user-profile/{user}', [UserController::class, 'update']);
    Route::put('/user-password', [UserController::class, 'updatePassword']);
    Route::delete('/user-delete/{user}', [UserController::class, 'destroy']);

    //Transaction module
    Route::apiResource('transactions', TransactionController::class); 
    //GET /api/transactions 
    //POST /api/transactions 
    //PUT /api/transactions/{id} 
    //DELETE /api/transactions/{id}

    Route::apiResource('categories',CategoryController::class);
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::apiResource('participants', ParticipantController::class);
    Route::apiResource('budgets', BudgetController::class);
    
    Route::get('/budget-transactions', [TransactionController::class, 'getBudgetTransactions']);

    Route::patch('/budgets/{id}/archive', [BudgetController::class, 'archive']);
    Route::patch('/budgets/{id}/unarchive', [BudgetController::class, 'unarchive']);
});

//User module
Route::post('/signup',[AuthController::class,'signup']);
Route::post('/login',[AuthController::class,'login']);

