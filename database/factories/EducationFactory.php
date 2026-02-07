<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Education>
 */
class EducationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'degree' => fake()->randomElement(['Ingeniería en Sistemas', 'Licenciatura en Informática', 'Maestría en Software']),
            'institution' => fake()->company().' University',
            'location' => fake()->city(),
            'field_of_study' => fake()->randomElement(['Ciencias de la Computación', 'Ingeniería de Software', 'Sistemas de Información']),
            'start_date' => fake()->dateTimeBetween('-6 years', '-3 years'),
            'end_date' => fake()->dateTimeBetween('-3 years', 'now'),
            'is_current' => false,
            'order' => fake()->numberBetween(1, 100),
        ];
    }
}
