<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
use App\Models\Experience;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    use HasReordering;

    public function __construct(
        private FileUploadService $fileService
    ) {}

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

    public function store(StoreExperienceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('company_logo')) {
            $validated['company_logo'] = $this->fileService->upload(
                $request->file('company_logo'),
                'experiences/logos'
            );
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

    public function update(UpdateExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('company_logo') || $request->boolean('remove_logo')) {
            $validated['company_logo'] = $this->fileService->handleFileUpdate(
                $experience->company_logo,
                $request->file('company_logo'),
                $request->boolean('remove_logo'),
                'experiences/logos'
            );
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
        $this->fileService->delete($experience->company_logo);

        $experience->delete();

        return redirect()->route('experiences.index')
            ->with('success', 'Experiencia eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'experiences', Experience::class);
    }
}
