<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Controllers\Concerns\HasToggleable;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    use HasReordering, HasToggleable;

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

    public function store(StoreSkillRequest $request): RedirectResponse
    {
        Skill::create($request->validated());

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

    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        $skill->update($request->validated());

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
        return $this->toggleAttribute($skill, 'is_highlighted', 'Estado destacado actualizado');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'skills', Skill::class);
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
