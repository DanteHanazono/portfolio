<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Technology;
use App\Models\Testimonial;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $seo = SeoService::forHome();

        return Inertia::render('Home', [
            'seo' => $seo->toArray(),
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

    public function about(): Response
    {
        $seo = (new SeoService)
            ->setTitle('Acerca de')
            ->setDescription('Conoce mi experiencia, educación y habilidades en desarrollo web full-stack.')
            ->setCanonical(route('about'))
            ->setKeywords(['experiencia', 'educación', 'habilidades', 'certificaciones']);

        return Inertia::render('About', [
            'seo' => $seo->toArray(),
            'experiences' => Experience::ordered()->get(),
            'education' => Education::ordered()->get(),
            'certifications' => Certification::active()->ordered()->get(),
            'skills' => Skill::ordered()->get()->groupBy('category'),
            'technologies' => Technology::featured()->ordered()->get(),
        ]);
    }

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

        $seo = SeoService::forPortfolio();

        return Inertia::render('Portfolio', [
            'seo' => $seo->toArray(),
            'projects' => $projects,
            'technologies' => Technology::ordered()->get(),
            'filters' => $request->only(['category', 'technology']),
        ]);
    }

    public function skills(): Response
    {
        $skills = Skill::ordered()->get();
        $groupedSkills = $skills->groupBy('category');

        $seo = (new SeoService)
            ->setTitle('Habilidades')
            ->setDescription('Explora mis habilidades técnicas en desarrollo web, frameworks y herramientas.')
            ->setCanonical(route('habilidades'))
            ->setKeywords(['habilidades', 'skills', 'tecnologías', 'desarrollo web']);

        return Inertia::render('Skills', [
            'seo' => $seo->toArray(),
            'skills' => $skills,
            'groupedSkills' => $groupedSkills,
            'technologies' => Technology::ordered()->get(),
        ]);
    }

    public function testimonials(): Response
    {
        $seo = (new SeoService)
            ->setTitle('Testimonios')
            ->setDescription('Lee opiniones y testimonios de clientes satisfechos con mis servicios de desarrollo web.')
            ->setCanonical(route('testimonials'))
            ->setKeywords(['testimonios', 'opiniones', 'reseñas', 'clientes']);

        return Inertia::render('Testimonials', [
            'seo' => $seo->toArray(),
            'testimonials' => Testimonial::published()
                ->with('project')
                ->ordered()
                ->get(),
        ]);
    }

    private function calculateYearsExperience(): int
    {
        $experiences = Experience::all();

        if ($experiences->isEmpty()) {
            return 0;
        }

        $firstExperience = $experiences->min('start_date');

        if (! $firstExperience) {
            return 0;
        }

        return now()->diffInYears($firstExperience);
    }
}
