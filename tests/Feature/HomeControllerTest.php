<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Technology;
use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_successfully(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Home')
                ->has('featuredProjects')
                ->has('highlightedSkills')
                ->has('featuredTestimonials')
                ->has('stats')
        );
    }

    public function test_home_page_shows_featured_projects(): void
    {
        $featured = Project::factory()->published()->featured()->create();
        $nonFeatured = Project::factory()->published()->create(['is_featured' => false]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Home')
                ->where('featuredProjects.0.id', $featured->id)
        );
    }

    public function test_home_page_shows_highlighted_skills(): void
    {
        $highlighted = Skill::factory()->highlighted()->create();
        Skill::factory()->create(['is_highlighted' => false]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Home')
                ->has('highlightedSkills', 1)
        );
    }

    public function test_home_page_returns_correct_stats(): void
    {
        Project::factory()->create(['status' => 'completed']);
        Technology::factory()->count(3)->create();

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Home')
                ->has(
                    'stats',
                    fn ($stats) => $stats
                        ->where('projects_completed', 1)
                        ->where('technologies_used', 3)
                        ->has('years_experience')
                        ->has('happy_clients')
                )
        );
    }

    public function test_about_page_renders_successfully(): void
    {
        $response = $this->get(route('about'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('About')
                ->has('experiences')
                ->has('education')
                ->has('certifications')
                ->has('skills')
                ->has('technologies')
        );
    }

    public function test_about_page_shows_experiences(): void
    {
        Experience::factory()->count(2)->create();

        $response = $this->get(route('about'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('About')
                ->has('experiences', 2)
        );
    }

    public function test_about_page_shows_education(): void
    {
        Education::factory()->count(2)->create();

        $response = $this->get(route('about'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('About')
                ->has('education', 2)
        );
    }

    public function test_about_page_shows_active_certifications(): void
    {
        Certification::factory()->create(['does_not_expire' => true]);

        $response = $this->get(route('about'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('About')
                ->has('certifications', 1)
        );
    }

    public function test_portfolio_page_renders_successfully(): void
    {
        $response = $this->get(route('portfolio'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Portfolio')
                ->has('projects')
                ->has('technologies')
                ->has('filters')
        );
    }

    public function test_portfolio_page_shows_published_in_portfolio_projects(): void
    {
        Project::factory()->published()->inPortfolio()->count(3)->create();
        Project::factory()->create(['is_published' => false, 'show_in_portfolio' => false]);

        $response = $this->get(route('portfolio'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Portfolio')
                ->has('projects.data', 3)
        );
    }

    public function test_portfolio_page_filters_by_technology(): void
    {
        $technology = Technology::factory()->create();
        $projectWithTech = Project::factory()->published()->inPortfolio()->create();
        $projectWithTech->technologies()->attach($technology);
        Project::factory()->published()->inPortfolio()->create();

        $response = $this->get(route('portfolio', ['technology' => $technology->id]));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Portfolio')
                ->has('projects.data', 1)
        );
    }

    public function test_skills_page_renders_successfully(): void
    {
        $response = $this->get(route('skills'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Skills')
                ->has('skills')
                ->has('groupedSkills')
                ->has('technologies')
        );
    }

    public function test_skills_page_groups_skills_by_category(): void
    {
        Skill::factory()->create(['category' => 'Frontend']);
        Skill::factory()->create(['category' => 'Backend']);

        $response = $this->get(route('skills'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Skills')
                ->has('groupedSkills.Frontend', 1)
                ->has('groupedSkills.Backend', 1)
        );
    }

    public function test_testimonials_page_renders_successfully(): void
    {
        $response = $this->get(route('testimonials'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials')
                ->has('testimonials')
        );
    }

    public function test_testimonials_page_shows_only_published(): void
    {
        Testimonial::factory()->published()->count(2)->create();
        Testimonial::factory()->create(['is_published' => false]);

        $response = $this->get(route('testimonials'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials')
                ->has('testimonials', 2)
        );
    }
}
