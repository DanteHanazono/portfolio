<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    /**
     * Display the contact form.
     */
    public function create(): Response
    {
        return Inertia::render('Contact/Create');
    }

    /**
     * Store a newly created contact message.
     */
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::create($request->validated());

        return back()->with('success', '¡Mensaje enviado exitosamente! Te responderé pronto.');
    }
}
