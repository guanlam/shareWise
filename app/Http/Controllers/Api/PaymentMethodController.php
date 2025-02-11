<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Build a query to include predefined payment method (user_id is null)
        // or those created by the authenticated user.
        $paymentMethods = PaymentMethod::whereNull('user_id')
                                        ->orWhere('user_id', Auth::id())
                                        ->get();  // Ensure the query is executed and data is retrieved

        return response()->json($paymentMethods);  // Return as JSON response
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentMethodRequest $request)
    {
        $data = $request->validated();
        $paymentMethod = PaymentMethod::create([
            ...$data,
            'user_id' => Auth::id(),

        ]);

        return response()->json([
            'message' => 'Payment Method created successfully.',
            'payment_method' => $paymentMethod
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        //
    }
}
