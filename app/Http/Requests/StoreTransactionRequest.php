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
            'amount' => 'required|numeric|min:0.01',
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

    /**
     * Get custom error messages for the validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'date.required' => 'The date field is required.',
            'date.date' => 'Please provide a valid date.',
            'amount.required' => 'The amount field is required.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be a positive number.',

            'type.required' => 'The type field is required.',
            'type.in' => 'The type must be either "Income" or "Expense".',
            'description.string' => 'The description must be a valid string.',
            'group_expense.boolean' => 'The group expense field must be true or false.',
            'recurrence.boolean' => 'The recurrence field must be true or false.',
            'recurrence_frequency.required_if' => 'The recurrence frequency field is required when recurrence is true.',
            'recurrence_frequency.in' => 'The recurrence frequency must be one of the following: Daily, Weekly, Monthly, Yearly.',
            'category_id.required' => 'The category field is required.',
            'category_id.exists' => 'The selected category does not exist.',
            'payment_method_id.required' => 'The payment method field is required.',
            'payment_method_id.exists' => 'The selected payment method does not exist.',
            // Participants validation error messages
            'participants.array' => 'The participants field must be an array.',
            'participants.*.participant_id.required_with' => 'Please choose the person.',
            'participants.*.participant_id.exists' => 'The selected participant does not exist.',
            'participants.*.amount_owed.required_with' => 'Each participant must have an amount owed.',
            'participants.*.amount_owed.numeric' => 'The amount owed must be a numeric value.',
            'participants.*.amount_owed.min' => 'The amount owed must be at least 0.',
        ];
    }
}
