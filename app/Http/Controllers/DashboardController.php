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

    public function analytics(): Response
    {
        $projectStats = [
            'by_status' => Project::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),

            'top_viewed' => Project::orderBy('views_count', 'desc')
                ->take(10)
                ->get(['id', 'title', 'views_count', 'created_at']),

            'top_liked' => Project::orderBy('likes_count', 'desc')
                ->take(10)
                ->get(['id', 'title', 'likes_count', 'created_at']),
        ];

        $messageStats = [
            'by_status' => ContactMessage::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),

            'by_month' => ContactMessage::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->take(12)
                ->get(),

            'response_time' => ContactMessage::replied()
                ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, replied_at)) as avg_hours')
                ->value('avg_hours'),
        ];

        return Inertia::render('Dashboard/Analytics', [
            'projectStats' => $projectStats,
            'messageStats' => $messageStats,
        ]);
    }
}
