<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TechnologyControllerTest extends TestCase
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
        $response = $this->get(route('technologies.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_index_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('technologies.index'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Index')
                ->has('technologies')
                ->has('types')
                ->has('filters')
        );
    }

    public function test_index_page_can_filter_by_type(): void
    {
        Technology::factory()->create(['type' => 'Frontend']);
        Technology::factory()->create(['type' => 'Backend']);

        $response = $this->actingAs($this->user)
            ->get(route('technologies.index', ['type' => 'Frontend']));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Index')
                ->has('technologies.data', 1)
        );
    }

    public function test_index_page_can_search_technologies(): void
    {
        Technology::factory()->create(['name' => 'Laravel']);
        Technology::factory()->create(['name' => 'React']);

        $response = $this->actingAs($this->user)
            ->get(route('technologies.index', ['search' => 'Laravel']));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Index')
                ->has('technologies.data', 1)
        );
    }

    public function test_show_page_requires_authentication(): void
    {
        $technology = Technology::factory()->create();

        $response = $this->get(route('technologies.show', $technology));

        $response->assertRedirect(route('login'));
    }

    public function test_show_page_renders_successfully(): void
    {
        $technology = Technology::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('technologies.show', $technology));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Show')
                ->has('technology')
                ->has('projects')
        );
    }

    public function test_create_page_requires_authentication(): void
    {
        $response = $this->get(route('technologies.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_create_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('technologies.create'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Create')
        );
    }

    public function test_technology_can_be_created(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('technologies.store'), [
                'name' => 'Vue.js',
                'slug' => 'vuejs',
                'type' => 'Frontend',
                'color' => '#42b883',
                'order' => 1,
                'is_featured' => false,
            ]);

        $response->assertRedirect(route('technologies.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('technologies', [
            'name' => 'Vue.js',
            'slug' => 'vuejs',
            'type' => 'Frontend',
            'color' => '#42b883',
        ]);
    }

    public function test_technology_creation_requires_name(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('technologies.store'), [
                'slug' => 'test',
                'type' => 'Frontend',
            ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_technology_creation_requires_unique_slug(): void
    {
        Technology::factory()->create(['slug' => 'existing-slug']);

        $response = $this->actingAs($this->user)
            ->post(route('technologies.store'), [
                'name' => 'Test',
                'slug' => 'existing-slug',
                'type' => 'Frontend',
            ]);

        $response->assertSessionHasErrors('slug');
    }

    public function test_technology_creation_generates_slug_if_empty(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('technologies.store'), [
                'name' => 'Test Technology',
                'slug' => '',
                'type' => 'Backend',
                'is_featured' => false,
            ]);

        $response->assertRedirect(route('technologies.index'));

        $this->assertDatabaseHas('technologies', [
            'name' => 'Test Technology',
            'slug' => 'test-technology',
        ]);
    }

    public function test_edit_page_requires_authentication(): void
    {
        $technology = Technology::factory()->create();

        $response = $this->get(route('technologies.edit', $technology));

        $response->assertRedirect(route('login'));
    }

    public function test_edit_page_renders_successfully(): void
    {
        $technology = Technology::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('technologies.edit', $technology));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Edit')
                ->has('technology')
        );
    }

    public function test_technology_can_be_updated(): void
    {
        $technology = Technology::factory()->create([
            'name' => 'Old Name',
            'type' => 'Frontend',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('technologies.update', $technology), [
                'name' => 'Updated Name',
                'slug' => $technology->slug,
                'type' => 'Backend',
                'color' => '#ff0000',
                'order' => 5,
                'is_featured' => true,
            ]);

        $response->assertRedirect(route('technologies.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('technologies', [
            'id' => $technology->id,
            'name' => 'Updated Name',
            'type' => 'Backend',
            'is_featured' => true,
        ]);
    }

    public function test_technology_can_be_deleted_if_no_projects(): void
    {
        $technology = Technology::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('technologies.destroy', $technology));

        $response->assertRedirect(route('technologies.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('technologies', [
            'id' => $technology->id,
        ]);
    }

    public function test_technology_cannot_be_deleted_if_has_projects(): void
    {
        $technology = Technology::factory()->create();
        $project = Project::factory()->for($this->user)->create();
        $project->technologies()->attach($technology);

        $response = $this->actingAs($this->user)
            ->delete(route('technologies.destroy', $technology));

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('technologies', [
            'id' => $technology->id,
        ]);
    }

    public function test_technology_featured_status_can_be_toggled(): void
    {
        $technology = Technology::factory()->create(['is_featured' => false]);

        $response = $this->actingAs($this->user)
            ->post(route('technologies.toggle-featured', $technology));

        $response->assertRedirect();

        $this->assertDatabaseHas('technologies', [
            'id' => $technology->id,
            'is_featured' => true,
        ]);

        // Toggle back
        $this->actingAs($this->user)
            ->post(route('technologies.toggle-featured', $technology));

        $this->assertDatabaseHas('technologies', [
            'id' => $technology->id,
            'is_featured' => false,
        ]);
    }

    public function test_technologies_can_be_reordered(): void
    {
        $tech1 = Technology::factory()->create(['order' => 1]);
        $tech2 = Technology::factory()->create(['order' => 2]);
        $tech3 = Technology::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)
            ->post(route('technologies.reorder'), [
                'technologies' => [
                    ['id' => $tech3->id, 'order' => 1],
                    ['id' => $tech1->id, 'order' => 2],
                    ['id' => $tech2->id, 'order' => 3],
                ],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('technologies', ['id' => $tech3->id, 'order' => 1]);
        $this->assertDatabaseHas('technologies', ['id' => $tech1->id, 'order' => 2]);
        $this->assertDatabaseHas('technologies', ['id' => $tech2->id, 'order' => 3]);
    }

    public function test_index_page_includes_projects_count(): void
    {
        $technology = Technology::factory()->create();
        $project = Project::factory()->for($this->user)->create();
        $project->technologies()->attach($technology);

        $response = $this->actingAs($this->user)
            ->get(route('technologies.index'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Index')
                ->has('technologies.data.0.projects_count')
        );
    }

    public function test_show_page_displays_published_projects_only(): void
    {
        $technology = Technology::factory()->create();

        $publishedProject = Project::factory()
            ->for($this->user)
            ->create([
                'is_published' => true,
                'published_at' => now(),
            ]);
        $publishedProject->technologies()->attach($technology);

        $draftProject = Project::factory()
            ->for($this->user)
            ->create([
                'is_published' => false,
                'published_at' => null,
            ]);
        $draftProject->technologies()->attach($technology);

        $response = $this->actingAs($this->user)
            ->get(route('technologies.show', $technology));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Technologies/Show')
                ->has('projects.data', 1)
        );
    }

    public function test_technology_color_defaults_to_emerald_green(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('technologies.store'), [
                'name' => 'Test Tech',
                'slug' => 'test-tech',
                'type' => 'Testing',
                'is_featured' => false,
            ]);

        $response->assertRedirect(route('technologies.index'));

        $this->assertDatabaseHas('technologies', [
            'name' => 'Test Tech',
            'color' => '#10B981',
        ]);
    }
}
