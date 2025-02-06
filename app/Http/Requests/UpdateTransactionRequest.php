<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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
            'date' => 'sometimes|date',
            'amount' => 'sometimes|numeric',
            'type' => 'sometimes|in:Income,Expense',
            'description' => 'nullable|string',
            'group_expense' => 'boolean',
            'category_id' => 'sometimes|exists:categories,id',
            'payment_method_id' => 'sometimes|exists:payment_methods,id',
        ];
    }
}
