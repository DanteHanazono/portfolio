<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'client_name' => 'required|string|max:255',
            'client_position' => 'nullable|string|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_avatar' => 'nullable|image|max:2048',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('client_avatar')) {
            $validated['client_avatar'] = $request->file('client_avatar')
                ->store('testimonials/avatars', 'public');
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

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'client_name' => 'required|string|max:255',
            'client_position' => 'nullable|string|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_avatar' => 'nullable|image|max:2048',
            'remove_avatar' => 'boolean',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->boolean('remove_avatar') && $testimonial->client_avatar) {
            Storage::disk('public')->delete($testimonial->client_avatar);
            $validated['client_avatar'] = null;
        } elseif ($request->hasFile('client_avatar')) {
            if ($testimonial->client_avatar) {
                Storage::disk('public')->delete($testimonial->client_avatar);
            }
            $validated['client_avatar'] = $request->file('client_avatar')
                ->store('testimonials/avatars', 'public');
        } else {
            unset($validated['client_avatar']);
        }

        $testimonial->update($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonio actualizado exitosamente');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        if ($testimonial->client_avatar) {
            Storage::disk('public')->delete($testimonial->client_avatar);
        }

        $testimonial->delete();

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonio eliminado exitosamente');
    }

    public function toggleFeatured(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'is_featured' => ! $testimonial->is_featured,
        ]);

        return back()->with('success', 'Estado destacado actualizado');
    }

    public function togglePublished(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'is_published' => ! $testimonial->is_published,
        ]);

        return back()->with('success', 'Estado de publicación actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'testimonials' => 'required|array',
            'testimonials.*.id' => 'required|exists:testimonials,id',
            'testimonials.*.order' => 'required|integer',
        ]);

        foreach ($validated['testimonials'] as $item) {
            Testimonial::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
