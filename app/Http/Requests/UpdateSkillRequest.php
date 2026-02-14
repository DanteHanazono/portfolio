<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'years_experience' => 'nullable|integer|min:0',
            'is_highlighted' => 'boolean',
            'order' => 'nullable|integer',
        ];
    }
}
