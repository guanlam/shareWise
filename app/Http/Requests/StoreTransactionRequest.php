<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'type' => 'required|in:Income,Expense',
            'description' => 'nullable|string',
            'group_expense' => 'boolean',
            'recurrence' => 'boolean',
            'recurrence_frequency' => 'required_if:recurrence,true|in:Daily,Weekly,Monthly,Yearly',
            'category_id' => 'required|exists:categories,id',
            'payment_method_id' => 'required|exists:payment_methods,id',


            // Add validation for participants
            'participants' => 'nullable|array',
            'participants.*.participant_id' => 'required_with:participants|exists:participants,id',
            'participants.*.amount_owed' => 'required_with:participants|numeric|min:0',
            
            
        ];
    }
}
