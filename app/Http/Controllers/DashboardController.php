<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_projects' => Project::count(),
            'published_projects' => Project::published()->count(),
            'featured_projects' => Project::featured()->count(),
            'total_views' => Project::sum('views_count'),

            'total_messages' => ContactMessage::count(),
            'new_messages' => ContactMessage::new()->count(),
            'unread_messages' => ContactMessage::where('status', 'new')->count(),

            'total_testimonials' => Testimonial::count(),
            'published_testimonials' => Testimonial::published()->count(),
        ];

        $recentProjects = Project::with(['technologies'])
            ->latest()
            ->take(5)
            ->get();

        $recentMessages = ContactMessage::latest()
            ->take(5)
            ->get();

        $popularProjects = Project::published()
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get(['id', 'title', 'views_count', 'likes_count']);

        $monthlyActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyActivity[] = [
                'month' => $date->format('M Y'),
                'projects' => Project::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
            'recentMessages' => $recentMessages,
            'popularProjects' => $popularProjects,
            'monthlyActivity' => $monthlyActivity,
        ]);
    }
}
