<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'status' => 'completed',
            'is_featured' => false,
            'is_published' => true,
            'show_in_portfolio' => true,
            'order' => fake()->numberBetween(1, 100),
            'views_count' => 0,
            'likes_count' => 0,
        ];
    }

    /**
     * Mark the project as featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Mark the project as published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    /**
     * Mark the project as in portfolio.
     */
    public function inPortfolio(): static
    {
        return $this->state(fn (array $attributes) => [
            'show_in_portfolio' => true,
        ]);
    }
}
