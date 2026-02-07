<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Education extends Model
{
    use HasFactory;

    protected $table = 'education';

    protected $fillable = [
        'degree',
        'institution',
        'institution_logo',
        'location',
        'field_of_study',
        'description',
        'start_date',
        'end_date',
        'is_current',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeCompleted($query)
    {
        return $query->where('is_current', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')
            ->orderBy('start_date', 'desc');
    }

    public function getPeriodAttribute(): string
    {
        $start = $this->start_date?->format('Y') ?? 'N/A';
        $end = $this->is_current ? 'Presente' : ($this->end_date?->format('Y') ?? 'N/A');

        return "{$start} - {$end}";
    }

    public function getFullDegreeAttribute(): string
    {
        $parts = array_filter([
            $this->degree,
            $this->field_of_study ? "en {$this->field_of_study}" : null,
        ]);

        return implode(' ', $parts);
    }
}
