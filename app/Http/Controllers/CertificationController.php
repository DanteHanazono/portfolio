<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificationController extends Controller
{
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url',
            'badge_image' => 'nullable|image|max:2048',
            'issue_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'does_not_expire' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('badge_image')) {
            $validated['badge_image'] = $request->file('badge_image')
                ->store('certifications/badges', 'public');
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

    public function update(Request $request, Certification $certification): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url',
            'badge_image' => 'nullable|image|max:2048',
            'remove_badge' => 'boolean',
            'issue_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'does_not_expire' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if ($request->boolean('remove_badge') && $certification->badge_image) {
            Storage::disk('public')->delete($certification->badge_image);
            $validated['badge_image'] = null;
        } elseif ($request->hasFile('badge_image')) {
            if ($certification->badge_image) {
                Storage::disk('public')->delete($certification->badge_image);
            }
            $validated['badge_image'] = $request->file('badge_image')
                ->store('certifications/badges', 'public');
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
        if ($certification->badge_image) {
            Storage::disk('public')->delete($certification->badge_image);
        }

        $certification->delete();

        return redirect()->route('certifications.index')
            ->with('success', 'Certificación eliminada exitosamente');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'certifications' => 'required|array',
            'certifications.*.id' => 'required|exists:certifications,id',
            'certifications.*.order' => 'required|integer',
        ]);

        foreach ($validated['certifications'] as $item) {
            Certification::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }
}
