<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Controllers\Concerns\HasToggleable;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Technology;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use HasReordering, HasToggleable;

    public function __construct(
        private FileUploadService $fileService
    ) {}

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

    public function publicShow(string $slug): Response
    {
        $project = Project::published()
            ->with([
                'technologies',
                'features' => fn ($q) => $q->ordered(),
                'publishedTestimonials' => fn ($q) => $q->ordered(),
                'user',
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        $project->incrementViews();

        $relatedProjects = Project::published()
            ->where('id', '!=', $project->id)
            ->with(['technologies'])
            ->inRandomOrder()
            ->take(3)
            ->get();

        return Inertia::render('ProjectDetail', [
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

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['user_id'] = Auth::id();

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        $validated = $this->handleProjectFiles($request, $validated);

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

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $validated = $request->validated();

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        $validated = $this->handleProjectFilesUpdate($request, $project, $validated);

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
        $this->fileService->delete($project->featured_image);
        $this->fileService->delete($project->thumbnail);

        if ($project->gallery) {
            $this->fileService->deleteMultiple($project->gallery);
        }

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Proyecto eliminado exitosamente');
    }

    public function like(string $slug): RedirectResponse
    {
        $project = Project::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $project->incrementLikes();

        return back()->with('success', 'Like agregado');
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        return $this->toggleAttribute($project, 'is_featured', 'Estado destacado actualizado');
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
        return $this->reorderItems($request, 'projects', Project::class);
    }

    private function handleProjectFiles(Request $request, array $validated): array
    {
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $this->fileService->upload(
                $request->file('featured_image'),
                'projects/featured'
            );
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $this->fileService->upload(
                $request->file('thumbnail'),
                'projects/thumbnails'
            );
        }

        if ($request->hasFile('gallery')) {
            $validated['gallery'] = $this->fileService->uploadMultiple(
                $request->file('gallery'),
                'projects/gallery'
            );
        }

        return $validated;
    }

    private function handleProjectFilesUpdate(Request $request, Project $project, array $validated): array
    {
        $validated['featured_image'] = $this->fileService->handleFileUpdate(
            $project->featured_image,
            $request->file('featured_image'),
            $request->boolean('remove_featured_image'),
            'projects/featured'
        );

        $validated['thumbnail'] = $this->fileService->handleFileUpdate(
            $project->thumbnail,
            $request->file('thumbnail'),
            $request->boolean('remove_thumbnail'),
            'projects/thumbnails'
        );

        if (! isset($validated['featured_image'])) {
            unset($validated['featured_image']);
        }

        if (! isset($validated['thumbnail'])) {
            unset($validated['thumbnail']);
        }

        $gallery = $request->input('existing_gallery', []);
        if ($request->hasFile('gallery')) {
            $newImages = $this->fileService->uploadMultiple(
                $request->file('gallery'),
                'projects/gallery'
            );
            $gallery = array_merge($gallery, $newImages);
        }
        $validated['gallery'] = $gallery;

        return $validated;
    }
}
