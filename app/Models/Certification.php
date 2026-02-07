<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'issuing_organization',
        'credential_id',
        'credential_url',
        'badge_image',
        'issue_date',
        'expiry_date',
        'does_not_expire',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
            'does_not_expire' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->where('does_not_expire', true)
                ->orWhere('expiry_date', '>=', now())
                ->orWhereNull('expiry_date');
        });
    }

    public function scopeExpired($query)
    {
        return $query->where('does_not_expire', false)
            ->where('expiry_date', '<', now());
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('issue_date', 'desc');
    }

    public function isExpired(): bool
    {
        if ($this->does_not_expire || !$this->expiry_date) {
            return false;
        }

        return $this->expiry_date->isPast();
    }

    public function isActive(): bool
    {
        return !$this->isExpired();
    }

    public function getStatusAttribute(): string
    {
        if ($this->does_not_expire) {
            return 'Sin vencimiento';
        }

        if (!$this->expiry_date) {
            return 'Activa';
        }

        return $this->isExpired() ? 'Expirada' : 'Activa';
    }

    public function getDaysUntilExpirationAttribute(): ?int
    {
        if ($this->does_not_expire || !$this->expiry_date) {
            return null;
        }

        return now()->diffInDays($this->expiry_date, false);
    }
}
