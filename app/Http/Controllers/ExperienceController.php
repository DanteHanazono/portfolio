<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(): Response
    {
        $experiences = Experience::ordered()->get();

        return Inertia::render('Experiences/Index', [
            'experiences' => $experiences,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Experiences/Create');
    }

    public function show(Experience $experience): Response
    {
        return Inertia::render('Experiences/Show', [
            'experience' => $experience,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_logo' => 'nullable|image|max:2048',
            'company_url' => 'nullable|url',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'string',
            'achievements' => 'nullable|array',
            'achievements.*' => 'string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('company_logo')) {
            $validated['company_logo'] = $request->file('company_logo')
                ->store('experiences/logos', 'public');
        }

        if ($validated['is_current'] ?? false) {
            $validated['end_date'] = null;
        }

        Experience::create($validated);

        return redirect()->route('experiences.index')
            ->with('success', 'Experiencia agregada exitosamente');
    }

    public function edit(Experience $experience): Response
    {
        return Inertia::render('Experiences/Edit', [
            'experience' => $experience,
        ]);
    }

    public function update(Request $request, Experience $experience): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_logo' => 'nullable|image|max:2048',
            'remove_logo' => 'boolean',
            'company_url' => 'nullable|url',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'string',
            'achievements' => 'nullable|array',
            'achievements.*' => 'string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->boolean('remove_logo') && $experience->company_logo) {
            Storage::disk('public')->delete($experience->company_logo);
            $validated['company_logo'] = null;
        } elseif ($request->hasFile('company_logo')) {
            if ($experience->company_logo) {
                Storage::disk('public')->delete($experience->company_logo);
            }
            $validated['company_logo'] = $request->file('company_logo')
                ->store('experiences/logos', 'public');
        } else {
            unset($validated['company_logo']);
        }

        if ($validated['is_current'] ?? false) {
            $validated['end_date'] = null;
        }

        $experience->update($validated);

        return redirect()->route('experiences.index')
            ->with('success', 'Experiencia actualizada exitosamente');
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        if ($experience->company_logo) {
            Storage::disk('public')->delete($experience->company_logo);
        }

        $experience->delete();

        return redirect()->route('experiences.index')
            ->with('success', 'Experiencia eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'experiences' => 'required|array',
            'experiences.*.id' => 'required|exists:experiences,id',
            'experiences.*.order' => 'required|integer',
        ]);

        foreach ($validated['experiences'] as $item) {
            Experience::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
