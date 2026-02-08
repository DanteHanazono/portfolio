<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Technology::query()->withCount('projects');

        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $technologies = $query->ordered()->paginate(20)->withQueryString();

        $types = Technology::distinct()->pluck('type')->filter();

        return Inertia::render('Technologies/Index', [
            'technologies' => $technologies,
            'types' => $types,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Technologies/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:technologies,slug',
            'type' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'order' => 'nullable|integer',
            'is_featured' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Technology::create($validated);

        return redirect()->route('technologies.index')
            ->with('success', 'Tecnología creada exitosamente');
    }

    public function show(Technology $technology): Response
    {
        $projects = $technology->publishedProjects()
            ->with(['technologies', 'user'])
            ->ordered()
            ->paginate(12);

        return Inertia::render('Technologies/Show', [
            'technology' => $technology,
            'projects' => $projects,
        ]);
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Technologies/Edit', [
            'technology' => $technology,
        ]);
    }

    public function update(Request $request, Technology $technology): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:technologies,slug,'.$technology->id,
            'type' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'order' => 'nullable|integer',
            'is_featured' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $technology->update($validated);

        return redirect()->route('technologies.index')
            ->with('success', 'Tecnología actualizada exitosamente');
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        if ($technology->projects()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una tecnología asociada a proyectos');
        }

        $technology->delete();

        return redirect()->route('technologies.index')
            ->with('success', 'Tecnología eliminada exitosamente');
    }

    public function toggleFeatured(Technology $technology): RedirectResponse
    {
        $technology->update([
            'is_featured' => ! $technology->is_featured,
        ]);

        return back()->with('success', 'Estado destacado actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'technologies' => 'required|array',
            'technologies.*.id' => 'required|exists:technologies,id',
            'technologies.*.order' => 'required|integer',
        ]);

        foreach ($validated['technologies'] as $item) {
            Technology::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
