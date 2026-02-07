<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_name' => fake()->name(),
            'client_position' => fake()->jobTitle(),
            'client_company' => fake()->company(),
            'content' => fake()->paragraph(),
            'rating' => fake()->numberBetween(3, 5),
            'is_featured' => false,
            'is_published' => true,
            'order' => fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Mark the testimonial as featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Mark the testimonial as published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }
}
