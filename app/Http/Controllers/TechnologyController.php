<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Controllers\Concerns\HasToggleable;
use App\Http\Requests\StoreTechnologyRequest;
use App\Http\Requests\UpdateTechnologyRequest;
use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    use HasReordering, HasToggleable;

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

    public function store(StoreTechnologyRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

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

    public function update(UpdateTechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $validated = $request->validated();

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

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
        return $this->toggleAttribute($technology, 'is_featured', 'Estado destacado actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'technologies', Technology::class);
    }
}
