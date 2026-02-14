<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Requests\StoreEducationRequest;
use App\Http\Requests\UpdateEducationRequest;
use App\Models\Education;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    use HasReordering;

    public function __construct(
        private FileUploadService $fileService
    ) {}

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

    public function store(StoreEducationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('institution_logo')) {
            $validated['institution_logo'] = $this->fileService->upload(
                $request->file('institution_logo'),
                'education/logos'
            );
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

    public function update(UpdateEducationRequest $request, Education $education): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('institution_logo') || $request->boolean('remove_logo')) {
            $validated['institution_logo'] = $this->fileService->handleFileUpdate(
                $education->institution_logo,
                $request->file('institution_logo'),
                $request->boolean('remove_logo'),
                'education/logos'
            );
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
        $this->fileService->delete($education->institution_logo);

        $education->delete();

        return redirect()->route('education.index')
            ->with('success', 'Formación eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'education', Education::class);
    }
}
