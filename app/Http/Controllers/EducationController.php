<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    public function index(): Response
    {
        $education = Education::ordered()->get();

        return Inertia::render('Education/Index', [
            'education' => $education,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Education/Create');
    }

    public function show(Education $education): Response
    {
        return Inertia::render('Education/Show', [
            'education' => $education,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'degree' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'institution_logo' => 'nullable|image|max:2048',
            'location' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gpa' => 'nullable|numeric|min:0|max:5',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('institution_logo')) {
            $validated['institution_logo'] = $request->file('institution_logo')
                ->store('education/logos', 'public');
        }

        if ($validated['is_current'] ?? false) {
            $validated['end_date'] = null;
        }

        Education::create($validated);

        return redirect()->route('education.index')
            ->with('success', 'Formación agregada exitosamente');
    }

    public function edit(Education $education): Response
    {
        return Inertia::render('Education/Edit', [
            'education' => $education,
        ]);
    }

    public function update(Request $request, Education $education): RedirectResponse
    {
        $validated = $request->validate([
            'degree' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'institution_logo' => 'nullable|image|max:2048',
            'remove_logo' => 'boolean',
            'location' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gpa' => 'nullable|numeric|min:0|max:5',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->boolean('remove_logo') && $education->institution_logo) {
            Storage::disk('public')->delete($education->institution_logo);
            $validated['institution_logo'] = null;
        } elseif ($request->hasFile('institution_logo')) {
            if ($education->institution_logo) {
                Storage::disk('public')->delete($education->institution_logo);
            }
            $validated['institution_logo'] = $request->file('institution_logo')
                ->store('education/logos', 'public');
        } else {
            unset($validated['institution_logo']);
        }

        if ($validated['is_current'] ?? false) {
            $validated['end_date'] = null;
        }

        $education->update($validated);

        return redirect()->route('education.index')
            ->with('success', 'Formación actualizada exitosamente');
    }

    public function destroy(Education $education): RedirectResponse
    {
        if ($education->institution_logo) {
            Storage::disk('public')->delete($education->institution_logo);
        }

        $education->delete();

        return redirect()->route('education.index')
            ->with('success', 'Formación eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'education' => 'required|array',
            'education.*.id' => 'required|exists:education,id',
            'education.*.order' => 'required|integer',
        ]);

        foreach ($validated['education'] as $item) {
            Education::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
