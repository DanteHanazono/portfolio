<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\Skill;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Skill::query();

        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $skills = $query->ordered()->get();

        $categories = Skill::distinct()->pluck('category')->filter();

        $groupedSkills = $skills->groupBy('category');

        return Inertia::render('Skills/Index', [
            'skills' => $skills,
            'groupedSkills' => $groupedSkills,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function create(): Response
    {
        $categories = Skill::distinct()->pluck('category')->filter();

        return Inertia::render('Skills/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'years_experience' => 'nullable|integer|min:0',
            'is_highlighted' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        Skill::create($validated);

        return redirect()->route('skills.index')
            ->with('success', 'Habilidad agregada exitosamente');
    }

    public function show(Skill $skill): Response
    {
        return Inertia::render('Skills/Show', [
            'skill' => $skill,
        ]);
    }

    public function edit(Skill $skill): Response
    {
        $categories = Skill::distinct()->pluck('category')->filter();

        return Inertia::render('Skills/Edit', [
            'skill' => $skill,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Skill $skill): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'years_experience' => 'nullable|integer|min:0',
            'is_highlighted' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $skill->update($validated);

        return redirect()->route('skills.index')
            ->with('success', 'Habilidad actualizada exitosamente');
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->delete();

        return redirect()->route('skills.index')
            ->with('success', 'Habilidad eliminada exitosamente');
    }

    public function toggleHighlighted(Skill $skill): RedirectResponse
    {
        $skill->update([
            'is_highlighted' => !$skill->is_highlighted,
        ]);

        return back()->with('success', 'Estado destacado actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.order' => 'required|integer',
        ]);

        foreach ($validated['skills'] as $item) {
            Skill::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }

    public function bulkUpdateLevels(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.level' => 'required|integer|min:0|max:100',
        ]);

        foreach ($validated['skills'] as $item) {
            Skill::where('id', $item['id'])->update(['level' => $item['level']]);
        }

        return back()->with('success', 'Niveles actualizados exitosamente');
    }
}
