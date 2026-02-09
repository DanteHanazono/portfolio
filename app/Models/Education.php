<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = ['institution_logo_url'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'order' => 'integer',
        ];
    }

    protected function institutionLogoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->institution_logo ? Storage::url($this->institution_logo) : null
        );
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
            $this->field_of_study ? "in {$this->field_of_study}" : null,
        ]);

        return implode(' ', $parts);
    }
}
