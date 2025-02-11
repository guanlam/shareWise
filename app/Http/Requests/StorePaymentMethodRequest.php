<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePaymentMethodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Change this to check user authentication if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50|unique:payment_methods,name,NULL,id,user_id,' . Auth::id(),
            'icon' => 'required|string|max:50', // Adjust based on your icon system
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'], // Hex color validation
        ];
    }

    /**
     * Custom error messages for validation failures.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The payment method name is required.',
            'name.unique' => 'You already have a payment method with this name.',
            'icon.required' => 'Please select an icon.',
            'color.required' => 'A color is required.',
            'color.regex' => 'The color must be a valid hex code (e.g., #1abc9c).',
        ];
    }
}
