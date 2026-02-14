<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificationRequest extends FormRequest
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
            'issuing_organization' => 'required|string|max:255',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url',
            'badge_image' => 'nullable|image|max:2048',
            'remove_badge' => 'boolean',
            'issue_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'does_not_expire' => 'boolean',
            'order' => 'nullable|integer',
        ];
    }
}
