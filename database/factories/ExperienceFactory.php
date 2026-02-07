<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'company' => fake()->company(),
            'location' => fake()->city(),
            'employment_type' => fake()->randomElement(['Full-time', 'Part-time', 'Freelance']),
            'description' => fake()->paragraph(),
            'start_date' => fake()->dateTimeBetween('-5 years', '-1 year'),
            'end_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'is_current' => false,
            'order' => fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Mark the experience as current.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_current' => true,
            'end_date' => null,
        ]);
    }
}
