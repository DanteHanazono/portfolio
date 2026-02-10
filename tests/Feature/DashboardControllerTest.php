<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Technology;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login'));
    }

    public function test_dashboard_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('stats')
                ->has('recentProjects')
                ->has('recentMessages')
                ->has('popularProjects')
                ->has('monthlyActivity')
        );
    }

    public function test_dashboard_displays_correct_project_stats(): void
    {
        Project::factory()->count(10)->create();
        Project::factory()->published()->count(5)->create();
        Project::factory()->featured()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->where('stats.total_projects', 18)
                ->where('stats.published_projects', 5)
                ->where('stats.featured_projects', 3)
        );
    }

    public function test_dashboard_displays_correct_message_stats(): void
    {
        ContactMessage::factory()->count(10)->create(['status' => 'replied']);
        ContactMessage::factory()->count(3)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->where('stats.total_messages', 15)
                ->where('stats.new_messages', 3)
        );
    }

    public function test_dashboard_displays_correct_testimonial_stats(): void
    {
        Testimonial::factory()->count(8)->create(['is_published' => false]);
        Testimonial::factory()->published()->count(5)->create();

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->where('stats.total_testimonials', 13)
                ->where('stats.published_testimonials', 5)
        );
    }

    public function test_dashboard_shows_recent_projects(): void
    {
        Project::factory()->count(10)->create(['created_at' => now()->subDays(10)]);
        $latestProject = Project::factory()->create(['created_at' => now()]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('recentProjects', 5)
                ->where('recentProjects.0.id', $latestProject->id)
        );
    }

    public function test_dashboard_shows_recent_messages(): void
    {
        ContactMessage::factory()->count(10)->create(['created_at' => now()->subDays(10)]);
        $latestMessage = ContactMessage::factory()->create(['created_at' => now()]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('recentMessages', 5)
                ->where('recentMessages.0.id', $latestMessage->id)
        );
    }

    public function test_dashboard_shows_popular_projects_by_views(): void
    {
        Project::factory()->published()->create(['views_count' => 100]);
        $mostViewed = Project::factory()->published()->create(['views_count' => 500]);
        Project::factory()->published()->create(['views_count' => 200]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('popularProjects', 3)
                ->where('popularProjects.0.id', $mostViewed->id)
                ->where('popularProjects.0.views_count', 500)
        );
    }

    public function test_dashboard_shows_monthly_activity(): void
    {
        // Crear proyectos en diferentes meses
        Project::factory()->create(['created_at' => now()->subMonths(2)]);
        Project::factory()->count(3)->create(['created_at' => now()->subMonth()]);
        Project::factory()->count(2)->create(['created_at' => now()]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('monthlyActivity', 6)
                ->where('monthlyActivity.5.projects', 2) // Este mes
        );
    }

    public function test_dashboard_calculates_total_views(): void
    {
        Project::factory()->create(['views_count' => 100]);
        Project::factory()->create(['views_count' => 250]);
        Project::factory()->create(['views_count' => 150]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->where('stats.total_views', 500)
        );
    }

    public function test_dashboard_works_with_empty_data(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->where('stats.total_projects', 0)
                ->where('stats.total_messages', 0)
                ->where('stats.total_testimonials', 0)
                ->has('recentProjects', 0)
                ->has('recentMessages', 0)
                ->has('popularProjects', 0)
                ->has('monthlyActivity', 6)
        );
    }

    public function test_dashboard_eager_loads_project_relationships(): void
    {
        $tech = Technology::factory()->create();
        $project = Project::factory()->create();
        $project->technologies()->attach($tech);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Dashboard/Index')
                ->has('recentProjects.0.technologies')
        );
    }
}
