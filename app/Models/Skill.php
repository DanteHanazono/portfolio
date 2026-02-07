<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'icon',
        'years_experience',
        'is_highlighted',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'years_experience' => 'integer',
            'is_highlighted' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeHighlighted($query)
    {
        return $query->where('is_highlighted', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');
    }
}
