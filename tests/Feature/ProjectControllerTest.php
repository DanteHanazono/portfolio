<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
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
        $response = $this->get(route('projects.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_index_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('projects.index'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Index')
                ->has('projects')
                ->has('technologies')
                ->has('filters')
        );
    }

    public function test_index_page_can_filter_by_technology(): void
    {
        $tech = Technology::factory()->create();
        $project = Project::factory()
            ->for($this->user)
            ->create();
        $project->technologies()->attach($tech);

        $otherProject = Project::factory()
            ->for($this->user)
            ->create();

        $response = $this->actingAs($this->user)
            ->get(route('projects.index', ['technology' => $tech->id]));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Index')
                ->has('projects.data', 1)
        );
    }

    public function test_index_page_can_filter_by_status(): void
    {
        Project::factory()->for($this->user)->create(['status' => 'completed']);
        Project::factory()->for($this->user)->create(['status' => 'draft']);

        $response = $this->actingAs($this->user)
            ->get(route('projects.index', ['status' => 'completed']));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Index')
                ->has('projects.data', 1)
        );
    }

    public function test_index_page_can_search_projects(): void
    {
        Project::factory()->for($this->user)->create(['title' => 'Laravel Portfolio']);
        Project::factory()->for($this->user)->create(['title' => 'React Dashboard']);

        $response = $this->actingAs($this->user)
            ->get(route('projects.index', ['search' => 'Laravel']));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Index')
                ->has('projects.data', 1)
        );
    }

    public function test_show_page_requires_authentication(): void
    {
        $project = Project::factory()->for($this->user)->create();

        $response = $this->get(route('projects.show', $project->slug));

        $response->assertRedirect(route('login'));
    }

    public function test_show_page_renders_successfully(): void
    {
        $project = Project::factory()
            ->for($this->user)
            ->has(Technology::factory()->count(3), 'technologies')
            ->create();

        $response = $this->actingAs($this->user)
            ->get(route('projects.show', $project->slug));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Show')
                ->has('project')
        );
    }

    public function test_show_page_does_not_increment_views_in_dashboard(): void
    {
        $project = Project::factory()->for($this->user)->create(['views_count' => 5]);

        $this->actingAs($this->user)
            ->get(route('projects.show', $project->slug));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'views_count' => 5,
        ]);
    }

    public function test_public_show_page_increments_views(): void
    {
        $project = Project::factory()
            ->for($this->user)
            ->create([
                'views_count' => 5,
                'is_published' => true,
                'published_at' => now(),
            ]);

        $this->get(route('project.show', $project->slug));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'views_count' => 6,
        ]);
    }

    public function test_create_page_requires_authentication(): void
    {
        $response = $this->get(route('projects.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_create_page_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('projects.create'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Create')
                ->has('technologies')
        );
    }

    public function test_project_can_be_created(): void
    {
        Storage::fake('public');

        $tech = Technology::factory()->create();

        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), [
                'title' => 'New Project',
                'slug' => 'new-project',
                'description' => 'Project description',
                'content' => 'Full project content',
                'status' => 'draft',
                'technologies' => [$tech->id],
                'is_featured' => false,
                'is_published' => false,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('projects', [
            'title' => 'New Project',
            'slug' => 'new-project',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_project_creation_requires_title(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), [
                'slug' => 'test',
                'status' => 'draft',
            ]);

        $response->assertSessionHasErrors('title');
    }

    public function test_project_creation_requires_description(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), [
                'title' => 'Test',
                'slug' => 'test',
                'status' => 'draft',
            ]);

        $response->assertSessionHasErrors('description');
    }

    public function test_project_creation_requires_unique_slug(): void
    {
        Project::factory()->for($this->user)->create(['slug' => 'existing-slug']);

        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), [
                'title' => 'Test',
                'slug' => 'existing-slug',
                'status' => 'draft',
            ]);

        $response->assertSessionHasErrors('slug');
    }

    public function test_edit_page_requires_authentication(): void
    {
        $project = Project::factory()->for($this->user)->create();

        $response = $this->get(route('projects.edit', $project));

        $response->assertRedirect(route('login'));
    }

    public function test_edit_page_renders_successfully(): void
    {
        $project = Project::factory()
            ->for($this->user)
            ->has(Technology::factory()->count(2), 'technologies')
            ->create();

        $response = $this->actingAs($this->user)
            ->get(route('projects.edit', $project));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Projects/Edit')
                ->has('project')
                ->has('technologies')
        );
    }

    public function test_project_can_be_updated(): void
    {
        $project = Project::factory()->for($this->user)->create([
            'title' => 'Old Title',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('projects.update', $project), [
                'title' => 'Updated Title',
                'slug' => $project->slug,
                'description' => 'Updated description',
                'status' => 'completed',
                'technologies' => [],
                'is_featured' => true,
                'is_published' => true,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Title',
            'status' => 'completed',
            'is_featured' => true,
            'is_published' => true,
        ]);
    }

    public function test_project_can_be_deleted(): void
    {
        Storage::fake('public');

        $project = Project::factory()->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->delete(route('projects.destroy', $project));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertSoftDeleted('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_project_featured_status_can_be_toggled(): void
    {
        $project = Project::factory()->for($this->user)->create(['is_featured' => false]);

        $response = $this->actingAs($this->user)
            ->post(route('projects.toggle-featured', $project));

        $response->assertRedirect();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_featured' => true,
        ]);

        // Toggle back
        $this->actingAs($this->user)
            ->post(route('projects.toggle-featured', $project));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_featured' => false,
        ]);
    }

    public function test_project_published_status_can_be_toggled(): void
    {
        $project = Project::factory()->for($this->user)->create(['is_published' => false]);

        $response = $this->actingAs($this->user)
            ->post(route('projects.toggle-published', $project));

        $response->assertRedirect();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_published' => true,
        ]);

        // Toggle back
        $this->actingAs($this->user)
            ->post(route('projects.toggle-published', $project));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_published' => false,
        ]);
    }

    public function test_project_can_be_liked(): void
    {
        $project = Project::factory()
            ->for($this->user)
            ->create([
                'likes_count' => 10,
                'is_published' => true,
                'published_at' => now(),
            ]);

        $response = $this->post(route('project.like', $project->slug));

        $response->assertRedirect();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'likes_count' => 11,
        ]);
    }

    public function test_projects_can_be_reordered(): void
    {
        $project1 = Project::factory()->for($this->user)->create(['order' => 1]);
        $project2 = Project::factory()->for($this->user)->create(['order' => 2]);
        $project3 = Project::factory()->for($this->user)->create(['order' => 3]);

        $response = $this->actingAs($this->user)
            ->post(route('projects.reorder'), [
                'projects' => [
                    ['id' => $project3->id, 'order' => 1],
                    ['id' => $project1->id, 'order' => 2],
                    ['id' => $project2->id, 'order' => 3],
                ],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('projects', ['id' => $project3->id, 'order' => 1]);
        $this->assertDatabaseHas('projects', ['id' => $project1->id, 'order' => 2]);
        $this->assertDatabaseHas('projects', ['id' => $project2->id, 'order' => 3]);
    }

    public function test_project_images_are_preserved_when_not_updated(): void
    {
        Storage::fake('public');

        $project = Project::factory()->for($this->user)->create([
            'featured_image' => 'projects/featured/test-image.jpg',
            'thumbnail' => 'projects/thumbnails/test-thumb.jpg',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('projects.update', $project), [
                'title' => 'Updated Title',
                'slug' => $project->slug,
                'description' => 'Updated description',
                'status' => 'completed',
                'technologies' => [],
                'is_featured' => false,
                'is_published' => false,
            ]);

        $response->assertRedirect();

        // Las imágenes deben conservarse
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'featured_image' => 'projects/featured/test-image.jpg',
            'thumbnail' => 'projects/thumbnails/test-thumb.jpg',
        ]);
    }
}
