<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Testimonial;
use App\Models\Technology;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Certification;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): Response
    {
        return Inertia::render('Home', [
            'featuredProjects' => Project::published()
                ->featured()
                ->with(['technologies'])
                ->ordered()
                ->take(6)
                ->get(),

            'highlightedSkills' => Skill::highlighted()
                ->ordered()
                ->get(),

            'featuredTestimonials' => Testimonial::published()
                ->featured()
                ->with('project')
                ->ordered()
                ->take(3)
                ->get(),

            'stats' => [
                'projects_completed' => Project::byStatus('completed')->count(),
                'years_experience' => $this->calculateYearsExperience(),
                'happy_clients' => Testimonial::distinct('client_company')->count(),
                'technologies_used' => Technology::count(),
            ],
        ]);
    }

    /**
     * Display the about page.
     */
    public function about(): Response
    {
        return Inertia::render('About', [
            'experiences' => Experience::ordered()->get(),
            'education' => Education::ordered()->get(),
            'certifications' => Certification::active()->ordered()->get(),
            'skills' => Skill::ordered()->get()->groupBy('category'),
            'technologies' => Technology::featured()->ordered()->get(),
        ]);
    }

    /**
     * Display the portfolio page.
     */
    public function portfolio(Request $request): Response
    {
        $query = Project::query()
            ->published()
            ->inPortfolio()
            ->with(['technologies', 'user'])
            ->withCount('testimonials');

        if ($request->filled('technology')) {
            $query->whereHas('technologies', function ($q) use ($request) {
                $q->where('technologies.id', $request->technology);
            });
        }

        $projects = $query->ordered()->paginate(12)->withQueryString();

        return Inertia::render('Portfolio', [
            'projects' => $projects,
            'technologies' => Technology::ordered()->get(),
            'filters' => $request->only(['category', 'technology']),
        ]);
    }

    /**
     * Display the skills page.
     */
    public function skills(): Response
    {
        $skills = Skill::ordered()->get();
        $groupedSkills = $skills->groupBy('category');

        return Inertia::render('Skills', [
            'skills' => $skills,
            'groupedSkills' => $groupedSkills,
            'technologies' => Technology::ordered()->get(),
        ]);
    }

    /**
     * Display testimonials page.
     */
    public function testimonials(): Response
    {
        return Inertia::render('Testimonials', [
            'testimonials' => Testimonial::published()
                ->with('project')
                ->ordered()
                ->get(),
        ]);
    }

    /**
     * Calculate total years of experience.
     */
    private function calculateYearsExperience(): int
    {
        $experiences = Experience::all();

        if ($experiences->isEmpty()) {
            return 0;
        }

        $firstExperience = $experiences->min('start_date');

        if (!$firstExperience) {
            return 0;
        }

        return now()->diffInYears($firstExperience);
    }
}
