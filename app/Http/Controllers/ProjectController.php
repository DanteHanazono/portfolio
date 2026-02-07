<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::query()
            ->with(['technologies', 'user'])
            ->withCount('testimonials');

        if ($request->filled('technology')) {
            $query->whereHas('technologies', function ($q) use ($request) {
                $q->where('technologies.id', $request->technology);
            });
        }

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');

        if ($sortBy === 'order') {
            $query->ordered();
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $projects = $query->paginate(12)->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'technologies' => Technology::ordered()->get(),
            'filters' => $request->only(['technology', 'status', 'search', 'sort', 'order']),
        ]);
    }

    public function show(string $slug): Response
    {
        $project = Project::with([
            'technologies',
            'features' => fn ($q) => $q->ordered(),
            'publishedTestimonials' => fn ($q) => $q->ordered(),
            'user',
        ])->where('slug', $slug)->firstOrFail();

        $project->incrementViews();

        $relatedProjects = Project::published()
            ->where('id', '!=', $project->id)
            ->with(['technologies'])
            ->inRandomOrder()
            ->take(3)
            ->get();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
            'technologies' => Technology::ordered()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:projects,slug',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|max:5120',
            'thumbnail' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:5120',
            'video_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'client_name' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:draft,in_progress,completed,archived',
            'technologies' => 'nullable|array',
            'technologies.*' => 'exists:technologies,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')
                ->store('projects/featured', 'public');
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('projects/thumbnails', 'public');
        }

        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('projects/gallery', 'public');
            }
            $validated['gallery'] = $gallery;
        }

        $validated['user_id'] = auth()->id();

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        $project = Project::create($validated);

        if (! empty($validated['technologies'])) {
            $project->technologies()->attach($validated['technologies']);
        }

        return redirect()->route('projects.show', $project->slug)
            ->with('success', 'Proyecto creado exitosamente');
    }

    public function edit(Project $project): Response
    {
        $project->load(['technologies', 'features']);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'technologies' => Technology::ordered()->get(),
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:projects,slug,'.$project->id,
            'subtitle' => 'nullable|string|max:500',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|max:5120',
            'thumbnail' => 'nullable|image|max:2048',
            'remove_featured_image' => 'boolean',
            'remove_thumbnail' => 'boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:5120',
            'existing_gallery' => 'nullable|array',
            'video_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'client_name' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:draft,in_progress,completed,archived',
            'technologies' => 'nullable|array',
            'technologies.*' => 'exists:technologies,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        if ($request->boolean('remove_featured_image') && $project->featured_image) {
            Storage::disk('public')->delete($project->featured_image);
            $validated['featured_image'] = null;
        } elseif ($request->hasFile('featured_image')) {
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')
                ->store('projects/featured', 'public');
        }

        if ($request->boolean('remove_thumbnail') && $project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
            $validated['thumbnail'] = null;
        } elseif ($request->hasFile('thumbnail')) {
            if ($project->thumbnail) {
                Storage::disk('public')->delete($project->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('projects/thumbnails', 'public');
        }

        $gallery = $request->input('existing_gallery', []);
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('projects/gallery', 'public');
            }
        }
        $validated['gallery'] = $gallery;

        if (($validated['is_published'] ?? false) && ! $project->is_published) {
            $validated['published_at'] = now();
        }

        $project->update($validated);

        if (isset($validated['technologies'])) {
            $project->technologies()->sync($validated['technologies']);
        }

        return redirect()->route('projects.show', $project->slug)
            ->with('success', 'Proyecto actualizado exitosamente');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->featured_image) {
            Storage::disk('public')->delete($project->featured_image);
        }

        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        if ($project->gallery) {
            foreach ($project->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Proyecto eliminado exitosamente');
    }

    public function like(Project $project): RedirectResponse
    {
        $project->incrementLikes();

        return back()->with('success', 'Like agregado');
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        $project->update([
            'is_featured' => ! $project->is_featured,
        ]);

        return back()->with('success', 'Estado destacado actualizado');
    }

    public function togglePublished(Project $project): RedirectResponse
    {
        $isPublished = ! $project->is_published;

        $project->update([
            'is_published' => $isPublished,
            'published_at' => $isPublished ? ($project->published_at ?? now()) : null,
        ]);

        return back()->with('success', 'Estado de publicación actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:projects,id',
            'projects.*.order' => 'required|integer',
        ]);

        foreach ($validated['projects'] as $item) {
            Project::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
