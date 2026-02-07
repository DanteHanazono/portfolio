<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'featured_image',
        'thumbnail',
        'gallery',
        'video_url',
        'demo_url',
        'github_url',
        'client_url',
        'client_name',
        'client_logo',
        'client_testimonial',
        'client_position',
        'start_date',
        'end_date',
        'duration',
        'team_size',
        'role',
        'status',
        'is_featured',
        'is_published',
        'show_in_portfolio',
        'order',
        'views_count',
        'likes_count',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_in_portfolio' => 'boolean',
            'order' => 'integer',
            'views_count' => 'integer',
            'likes_count' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technology')
            ->withPivot('order')
            ->withTimestamps()
            ->orderByPivot('order');
    }

    public function features(): HasMany
    {
        return $this->hasMany(Feature::class)->orderBy('order');
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function publishedTestimonials(): HasMany
    {
        return $this->testimonials()->where('is_published', true);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInPortfolio($query)
    {
        return $query->where('show_in_portfolio', true);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('created_at', 'desc');
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementLikes(): void
    {
        $this->increment('likes_count');
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function getDurationAttribute($value): ?string
    {
        if ($value) {
            return $value;
        }

        if ($this->start_date && $this->end_date) {
            $diff = $this->start_date->diffInMonths($this->end_date);

            return $diff > 0 ? "{$diff} ".($diff === 1 ? 'mes' : 'meses') : null;
        }

        return null;
    }
}
