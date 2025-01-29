<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

class UpdateUserPasswordRequest extends FormRequest
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
            
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
            
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'The current password is required.',
            'new_password.required' => 'The new password is required.',
            'new_password.min' => 'The new password must be at least 8 characters.',
            'new_password.confirmed' => 'The new password confirmation does not match.',
        ];
    }


    /**
     * Map the camelCase input names to snake_case for validation.
     *
     * @return array<string, string>
     */
    public function failedValidation(Validator $validator)
    {
        $errors = (new ValidationException($validator))->errors();

        // Transform keys to camelCase
        $camelCaseErrors = [];
        foreach ($errors as $field => $messages) {
            $camelCaseField = lcfirst(str_replace('_', '', ucwords($field, '_')));
            $camelCaseErrors[$camelCaseField] = $messages;
        }

        throw new HttpResponseException(response()->json([
            'errors' => $camelCaseErrors,
        ], 422));
    }

    
}
