<?php

namespace Tests\Feature;

use App\Models\Experience;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExperienceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_index_page_requires_authentication(): void
    {
        $response = $this->get(route('experiences.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_index_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('experiences.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Experiences/Index')
                ->has('experiences')
        );
    }

    public function test_index_page_displays_experiences_ordered(): void
    {
        $exp1 = Experience::factory()->create(['order' => 2, 'title' => 'Second']);
        $exp2 = Experience::factory()->create(['order' => 1, 'title' => 'First']);
        $exp3 = Experience::factory()->create(['order' => 3, 'title' => 'Third']);

        $response = $this->actingAs($this->user)
            ->get(route('experiences.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Experiences/Index')
                ->has('experiences', 3)
                ->where('experiences.0.title', 'First')
                ->where('experiences.1.title', 'Second')
                ->where('experiences.2.title', 'Third')
        );
    }

    public function test_show_page_requires_authentication(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->get(route('experiences.show', $experience));

        $response->assertRedirect(route('login'));
    }

    public function test_show_page_renders_successfully(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('experiences.show', $experience));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Experiences/Show')
                ->has('experience')
                ->where('experience.id', $experience->id)
        );
    }

    public function test_create_page_requires_authentication(): void
    {
        $response = $this->get(route('experiences.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_create_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('experiences.create'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Experiences/Create')
        );
    }

    public function test_experience_can_be_created(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('company-logo.png');

        $response = $this->actingAs($this->user)
            ->post(route('experiences.store'), [
                'title' => 'Senior Developer',
                'company' => 'Tech Corp',
                'company_logo' => $logo,
                'company_url' => 'https://techcorp.com',
                'location' => 'Remote',
                'employment_type' => 'Full-time',
                'description' => 'Great company',
                'responsibilities' => ['Code review', 'Architecture'],
                'achievements' => ['Built amazing app'],
                'start_date' => '2020-01-01',
                'end_date' => '2023-12-31',
                'is_current' => false,
                'order' => 1,
            ]);

        $response->assertRedirect(route('experiences.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('experiences', [
            'title' => 'Senior Developer',
            'company' => 'Tech Corp',
            'location' => 'Remote',
        ]);

        Storage::disk('public')->assertExists('experiences/logos/'.$logo->hashName());
    }

    public function test_experience_creation_requires_title(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('experiences.store'), [
                'company' => 'Tech Corp',
                'start_date' => '2020-01-01',
                'is_current' => false,
            ]);

        $response->assertSessionHasErrors('title');
    }

    public function test_experience_creation_requires_company(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('experiences.store'), [
                'title' => 'Developer',
                'start_date' => '2020-01-01',
                'is_current' => false,
            ]);

        $response->assertSessionHasErrors('company');
    }

    public function test_experience_creation_requires_start_date(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('experiences.store'), [
                'title' => 'Developer',
                'company' => 'Tech Corp',
                'is_current' => false,
            ]);

        $response->assertSessionHasErrors('start_date');
    }

    public function test_current_experience_nullifies_end_date(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('experiences.store'), [
                'title' => 'Developer',
                'company' => 'Tech Corp',
                'start_date' => '2020-01-01',
                'end_date' => '2023-12-31',
                'is_current' => true,
                'order' => 0,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('experiences', [
            'title' => 'Developer',
            'is_current' => true,
            'end_date' => null,
        ]);
    }

    public function test_edit_page_requires_authentication(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->get(route('experiences.edit', $experience));

        $response->assertRedirect(route('login'));
    }

    public function test_edit_page_renders_successfully(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('experiences.edit', $experience));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Experiences/Edit')
                ->has('experience')
                ->where('experience.id', $experience->id)
        );
    }

    public function test_experience_can_be_updated(): void
    {
        $experience = Experience::factory()->create([
            'title' => 'Old Title',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('experiences.update', $experience), [
                'title' => 'Updated Title',
                'company' => $experience->company,
                'start_date' => $experience->start_date->format('Y-m-d'),
                'is_current' => false,
                'order' => 0,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('experiences', [
            'id' => $experience->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_experience_can_be_deleted(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('experiences.destroy', $experience));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('experiences', [
            'id' => $experience->id,
        ]);
    }

    public function test_experience_logo_is_deleted_when_experience_deleted(): void
    {
        Storage::fake('public');

        $experience = Experience::factory()->create([
            'company_logo' => 'experiences/logos/test-logo.png',
        ]);

        Storage::disk('public')->put('experiences/logos/test-logo.png', 'fake-content');

        $this->actingAs($this->user)
            ->delete(route('experiences.destroy', $experience));

        Storage::disk('public')->assertMissing('experiences/logos/test-logo.png');
    }

    public function test_experience_logo_can_be_removed_during_update(): void
    {
        Storage::fake('public');

        $experience = Experience::factory()->create([
            'company_logo' => 'experiences/logos/test-logo.png',
        ]);

        Storage::disk('public')->put('experiences/logos/test-logo.png', 'fake-content');

        $response = $this->actingAs($this->user)
            ->put(route('experiences.update', $experience), [
                'title' => $experience->title,
                'company' => $experience->company,
                'start_date' => $experience->start_date->format('Y-m-d'),
                'remove_logo' => true,
                'is_current' => false,
                'order' => 0,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('experiences', [
            'id' => $experience->id,
            'company_logo' => null,
        ]);

        Storage::disk('public')->assertMissing('experiences/logos/test-logo.png');
    }

    public function test_experience_logo_is_preserved_when_not_updated(): void
    {
        Storage::fake('public');

        $experience = Experience::factory()->create([
            'company_logo' => 'experiences/logos/test-logo.png',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('experiences.update', $experience), [
                'title' => 'Updated Title',
                'company' => $experience->company,
                'start_date' => $experience->start_date->format('Y-m-d'),
                'is_current' => false,
                'order' => 0,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('experiences', [
            'id' => $experience->id,
            'company_logo' => 'experiences/logos/test-logo.png',
        ]);
    }

    public function test_experiences_can_be_reordered(): void
    {
        $exp1 = Experience::factory()->create(['order' => 1]);
        $exp2 = Experience::factory()->create(['order' => 2]);
        $exp3 = Experience::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)
            ->post(route('experiences.reorder'), [
                'experiences' => [
                    ['id' => $exp3->id, 'order' => 1],
                    ['id' => $exp1->id, 'order' => 2],
                    ['id' => $exp2->id, 'order' => 3],
                ],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('experiences', ['id' => $exp3->id, 'order' => 1]);
        $this->assertDatabaseHas('experiences', ['id' => $exp1->id, 'order' => 2]);
        $this->assertDatabaseHas('experiences', ['id' => $exp2->id, 'order' => 3]);
    }

    public function test_experience_includes_duration_accessor(): void
    {
        $experience = Experience::factory()->create([
            'start_date' => '2020-01-01',
            'end_date' => '2023-06-15',
            'is_current' => false,
        ]);

        $this->assertNotNull($experience->duration);
        $this->assertIsString($experience->duration);
    }

    public function test_experience_includes_period_accessor(): void
    {
        $experience = Experience::factory()->create([
            'start_date' => '2020-01-01',
            'end_date' => '2023-06-15',
            'is_current' => false,
        ]);

        $this->assertNotNull($experience->period);
        $this->assertIsString($experience->period);
        $this->assertStringContainsString('-', $experience->period);
    }

    public function test_experience_includes_company_logo_url_accessor(): void
    {
        $experience = Experience::factory()->create([
            'company_logo' => 'experiences/logos/test.png',
        ]);

        $this->assertArrayHasKey('company_logo_url', $experience->toArray());
    }
}
