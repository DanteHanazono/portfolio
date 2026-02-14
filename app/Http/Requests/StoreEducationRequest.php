<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEducationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'degree' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'institution_logo' => 'nullable|image|max:2048',
            'location' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gpa' => 'nullable|numeric|min:0|max:5',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ];
    }
}
