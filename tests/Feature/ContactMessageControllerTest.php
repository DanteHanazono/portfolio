<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_renders_successfully(): void
    {
        $response = $this->get(route('contact.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Contact/Create'));
    }

    public function test_contact_message_can_be_submitted(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'phone' => '+1 234 567 890',
            'company' => 'Mi Empresa',
            'subject' => 'Consulta sobre proyecto',
            'message' => 'Me gustaría discutir un proyecto web.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'subject' => 'Consulta sobre proyecto',
        ]);
    }

    public function test_contact_message_requires_name(): void
    {
        $response = $this->post(route('contact.store'), [
            'email' => 'juan@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_contact_message_requires_email(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_contact_message_requires_valid_email(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'not-an-email',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_contact_message_requires_subject(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'message' => 'Test message',
        ]);

        $response->assertSessionHasErrors('subject');
    }

    public function test_contact_message_requires_message(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'subject' => 'Test',
        ]);

        $response->assertSessionHasErrors('message');
    }

    public function test_contact_message_phone_is_optional(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_contact_message_company_is_optional(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('contact_messages', [
            'company' => null,
        ]);
    }

    public function test_contact_message_rejects_too_long_message(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'subject' => 'Test',
            'message' => str_repeat('a', 5001),
        ]);

        $response->assertSessionHasErrors('message');
    }
}
