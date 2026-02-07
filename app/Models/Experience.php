<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'company',
        'company_logo',
        'company_url',
        'location',
        'employment_type',
        'description',
        'responsibilities',
        'achievements',
        'start_date',
        'end_date',
        'is_current',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'achievements' => 'array',
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')
            ->orderBy('start_date', 'desc');
    }

    public function getDurationAttribute(): string
    {
        $endDate = $this->is_current ? now() : $this->end_date;

        if (!$this->start_date || !$endDate) {
            return 'N/A';
        }

        $years = $this->start_date->diffInYears($endDate);
        $months = $this->start_date->copy()->addYears($years)->diffInMonths($endDate);

        $duration = [];

        if ($years > 0) {
            $duration[] = $years . ' ' . ($years === 1 ? 'año' : 'años');
        }

        if ($months > 0) {
            $duration[] = $months . ' ' . ($months === 1 ? 'mes' : 'meses');
        }

        return !empty($duration) ? implode(' y ', $duration) : 'Menos de 1 mes';
    }

    public function getPeriodAttribute(): string
    {
        $start = $this->start_date?->format('M Y') ?? 'N/A';
        $end = $this->is_current ? 'Presente' : ($this->end_date?->format('M Y') ?? 'N/A');

        return "{$start} - {$end}";
    }
}
