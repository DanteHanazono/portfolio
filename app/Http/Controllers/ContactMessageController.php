<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Contact/Create');
    }

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::create($request->validated());

        return back()->with('success', '¡Mensaje enviado exitosamente! Te responderé pronto.');
    }

    /**
     * Display a listing of contact messages (Admin).
     */
    public function index(Request $request): Response
    {
        $query = ContactMessage::query();

        // Filtros
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('subject', 'like', "%{$request->search}%")
                    ->orWhere('message', 'like', "%{$request->search}%");
            });
        }

        $messages = $query->latest()->paginate(20)->withQueryString();

        // Contadores de estado
        $statusCounts = [
            'new' => ContactMessage::new()->count(),
            'read' => ContactMessage::read()->count(),
            'replied' => ContactMessage::replied()->count(),
            'archived' => ContactMessage::archived()->count(),
        ];

        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => $messages,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified contact message (Admin).
     */
    public function show(ContactMessage $contactMessage): Response
    {
        // Marcar como leído automáticamente
        if ($contactMessage->isNew()) {
            $contactMessage->markAsRead();
        }

        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => $contactMessage,
        ]);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsRead();

        return back()->with('success', 'Mensaje marcado como leído');
    }

    /**
     * Mark message as replied.
     */
    public function markAsReplied(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsReplied();

        return back()->with('success', 'Mensaje marcado como respondido');
    }

    /**
     * Archive the message.
     */
    public function archive(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->archive();

        return back()->with('success', 'Mensaje archivado');
    }

    /**
     * Update admin notes.
     */
    public function updateNotes(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $contactMessage->update($validated);

        return back()->with('success', 'Notas actualizadas');
    }

    /**
     * Send reply to contact message.
     */
    public function reply(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $validated = $request->validate([
            'reply_message' => 'required|string|max:5000',
        ]);

        // Enviar email de respuesta
        // Mail::to($contactMessage->email)->send(
        //     new ContactReply($contactMessage, $validated['reply_message'])
        // );

        $contactMessage->markAsReplied();

        return back()->with('success', 'Respuesta enviada exitosamente');
    }

    /**
     * Delete the specified contact message.
     */
    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')
            ->with('success', 'Mensaje eliminado exitosamente');
    }

    /**
     * Bulk actions on messages.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:mark_read,mark_replied,archive,delete',
            'message_ids' => 'required|array',
            'message_ids.*' => 'exists:contact_messages,id',
        ]);

        $messages = ContactMessage::whereIn('id', $validated['message_ids']);

        switch ($validated['action']) {
            case 'mark_read':
                $messages->update(['status' => 'read', 'read_at' => now()]);
                $message = 'Mensajes marcados como leídos';
                break;
            case 'mark_replied':
                $messages->update(['status' => 'replied', 'replied_at' => now()]);
                $message = 'Mensajes marcados como respondidos';
                break;
            case 'archive':
                $messages->update(['status' => 'archived']);
                $message = 'Mensajes archivados';
                break;
            case 'delete':
                $messages->delete();
                $message = 'Mensajes eliminados';
                break;
        }

        return back()->with('success', $message);
    }
}
