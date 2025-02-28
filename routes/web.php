<?php

use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Route;

Route::get('/mark-as-paid/{transaction}/{participant}', [EmailController::class, 'markAsPaid'])
    ->name('markAsPaid')
    ->middleware('signed');



Route::get('/payment-status', function () {
    return view('view.transaction-message');
})->name('transaction-message');


// Route::get('/report/preview/{userId}', [UserController::class, 'previewReport']);

Route::get('/report/download/{userId}', [TransactionController::class, 'downloadMonthlyReport'])
    ->name('report.download');
    





    