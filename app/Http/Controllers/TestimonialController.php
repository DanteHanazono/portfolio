<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Controllers\Concerns\HasToggleable;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Project;
use App\Models\Testimonial;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    use HasReordering, HasToggleable;

    public function __construct(
        private FileUploadService $fileService
    ) {}

    public function index(Request $request): Response
    {
        $query = Testimonial::query()->with('project');

        if ($request->filled('project')) {
            $query->where('project_id', $request->project);
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('client_name', 'like', "%{$request->search}%")
                    ->orWhere('client_company', 'like', "%{$request->search}%")
                    ->orWhere('content', 'like', "%{$request->search}%");
            });
        }

        $testimonials = $query->ordered()->paginate(20)->withQueryString();

        return Inertia::render('Testimonials/Index', [
            'testimonials' => $testimonials,
            'projects' => Project::published()->ordered()->get(['id', 'title']),
            'filters' => $request->only(['project', 'rating', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Testimonials/Create', [
            'projects' => Project::published()->ordered()->get(['id', 'title']),
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('client_avatar')) {
            $validated['client_avatar'] = $this->fileService->upload(
                $request->file('client_avatar'),
                'testimonials/avatars'
            );
        }

        Testimonial::create($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonio agregado exitosamente');
    }

    public function show(Testimonial $testimonial): Response
    {
        $testimonial->load('project');

        return Inertia::render('Testimonials/Show', [
            'testimonial' => $testimonial,
        ]);
    }

    public function edit(Testimonial $testimonial): Response
    {
        $testimonial->load('project');

        return Inertia::render('Testimonials/Edit', [
            'testimonial' => $testimonial,
            'projects' => Project::published()->ordered()->get(['id', 'title']),
        ]);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('client_avatar') || $request->boolean('remove_avatar')) {
            $validated['client_avatar'] = $this->fileService->handleFileUpdate(
                $testimonial->client_avatar,
                $request->file('client_avatar'),
                $request->boolean('remove_avatar'),
                'testimonials/avatars'
            );
        } else {
            unset($validated['client_avatar']);
        }

        $testimonial->update($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonio actualizado exitosamente');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->fileService->delete($testimonial->client_avatar);

        $testimonial->delete();

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonio eliminado exitosamente');
    }

    public function toggleFeatured(Testimonial $testimonial): RedirectResponse
    {
        return $this->toggleAttribute($testimonial, 'is_featured', 'Estado destacado actualizado');
    }

    public function togglePublished(Testimonial $testimonial): RedirectResponse
    {
        return $this->toggleAttribute($testimonial, 'is_published', 'Estado de publicación actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'testimonials', Testimonial::class);
    }
}
