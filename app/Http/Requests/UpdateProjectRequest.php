<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'slug' => 'nullable|string|unique:projects,slug,'.$this->route('project')->id,
            'subtitle' => 'nullable|string|max:500',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|max:5120',
            'thumbnail' => 'nullable|image|max:2048',
            'remove_featured_image' => 'boolean',
            'remove_thumbnail' => 'boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:5120',
            'existing_gallery' => 'nullable|array',
            'video_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'client_name' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:draft,in_progress,completed,archived',
            'technologies' => 'nullable|array',
            'technologies.*' => 'exists:technologies,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }
}
