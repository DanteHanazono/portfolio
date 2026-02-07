<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certification>
 */
class CertificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'issuing_organization' => fake()->company(),
            'credential_id' => fake()->uuid(),
            'issue_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'does_not_expire' => true,
            'order' => fake()->numberBetween(1, 100),
        ];
    }
}
