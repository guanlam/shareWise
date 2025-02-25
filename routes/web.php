<?php


use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Route;

Route::get('/mark-as-paid/{transaction}/{participant}', [EmailController::class, 'markAsPaid'])
    ->name('markAsPaid')
    ->middleware('signed');

    Route::get('/hi', function () {
        $imagePath = public_path('images/logo-only.png');
        
        // Check if the image exists, and if so, convert it to a Base64 string
        $base64Image = file_exists($imagePath) ? base64_encode(file_get_contents($imagePath)) : null;
    
        // Return a view with the Base64 image
        return view('hi', compact('base64Image'));
    });
    


Route::get('/payment-status', function () {
    return view('view.transaction-message');
})->name('transaction-message');

    