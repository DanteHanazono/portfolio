<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'subject',
        'message',
        'status',
        'admin_notes',
        'read_at',
        'replied_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'replied_at' => 'datetime',
        ];
    }

    public function scopeNew($query): mixed
    {
        return $query->where('status', 'new');
    }

    public function scopeRead($query): mixed
    {
        return $query->where('status', 'read');
    }

    public function scopeReplied($query): mixed
    {
        return $query->where('status', 'replied');
    }

    public function scopeArchived($query): mixed
    {
        return $query->where('status', 'archived');
    }

    public function scopeLatest($query): mixed
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function markAsRead(): void
    {
        $this->update([
            'status' => 'read',
            'read_at' => now(),
        ]);
    }

    public function markAsReplied(): void
    {
        $this->update([
            'status' => 'replied',
            'replied_at' => now(),
        ]);
    }

    public function archive(): void
    {
        $this->update([
            'status' => 'archived',
        ]);
    }

    public function isNew(): bool
    {
        return $this->status === 'new';
    }

    public function isRead(): bool
    {
        return $this->status === 'read';
    }

    public function isReplied(): bool
    {
        return $this->status === 'replied';
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'new' => 'blue',
            'read' => 'yellow',
            'replied' => 'green',
            'archived' => 'gray',
            default => 'gray',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'new' => 'Nuevo',
            'read' => 'Leído',
            'replied' => 'Respondido',
            'archived' => 'Archivado',
            default => 'Desconocido',
        };
    }
}
