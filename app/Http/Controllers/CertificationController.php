<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasReordering;
use App\Http\Requests\StoreCertificationRequest;
use App\Http\Requests\UpdateCertificationRequest;
use App\Models\Certification;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificationController extends Controller
{
    use HasReordering;

    public function __construct(
        private FileUploadService $fileService
    ) {}

    public function index(Request $request): Response
    {
        $query = Certification::query();

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'expired') {
                $query->expired();
            }
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('issuing_organization', 'like', "%{$request->search}%");
            });
        }

        $certifications = $query->ordered()->get();

        return Inertia::render('Certifications/Index', [
            'certifications' => $certifications,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Certifications/Create');
    }

    public function store(StoreCertificationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('badge_image')) {
            $validated['badge_image'] = $this->fileService->upload(
                $request->file('badge_image'),
                'certifications/badges'
            );
        }

        if ($validated['does_not_expire'] ?? false) {
            $validated['expiry_date'] = null;
        }

        Certification::create($validated);

        return redirect()->route('certifications.index')
            ->with('success', 'Certificación agregada exitosamente');
    }

    public function show(Certification $certification): Response
    {
        return Inertia::render('Certifications/Show', [
            'certification' => $certification,
        ]);
    }

    public function edit(Certification $certification): Response
    {
        return Inertia::render('Certifications/Edit', [
            'certification' => $certification,
        ]);
    }

    public function update(UpdateCertificationRequest $request, Certification $certification): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('badge_image') || $request->boolean('remove_badge')) {
            $validated['badge_image'] = $this->fileService->handleFileUpdate(
                $certification->badge_image,
                $request->file('badge_image'),
                $request->boolean('remove_badge'),
                'certifications/badges'
            );
        } else {
            unset($validated['badge_image']);
        }

        if ($validated['does_not_expire'] ?? false) {
            $validated['expiry_date'] = null;
        }

        $certification->update($validated);

        return redirect()->route('certifications.index')
            ->with('success', 'Certificación actualizada exitosamente');
    }

    public function destroy(Certification $certification): RedirectResponse
    {
        $this->fileService->delete($certification->badge_image);

        $certification->delete();

        return redirect()->route('certifications.index')
            ->with('success', 'Certificación eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        return $this->reorderItems($request, 'certifications', Certification::class);
    }
}
