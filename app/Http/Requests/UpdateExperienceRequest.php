<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienceRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_logo' => 'nullable|image|max:2048',
            'remove_logo' => 'boolean',
            'company_url' => 'nullable|url',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'string',
            'achievements' => 'nullable|array',
            'achievements.*' => 'string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ];
    }
}
