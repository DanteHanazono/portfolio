<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'category' => fake()->randomElement(['Frontend', 'Backend', 'DevOps', 'Database']),
            'years_experience' => fake()->numberBetween(1, 10),
            'is_highlighted' => false,
            'order' => fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Mark the skill as highlighted.
     */
    public function highlighted(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_highlighted' => true,
        ]);
    }
}
