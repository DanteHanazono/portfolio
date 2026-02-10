<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

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

    // Admin Tests
    public function test_admin_index_requires_authentication(): void
    {
        $response = $this->get(route('admin.contact-messages.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_index_renders_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Admin/ContactMessages/Index')
                ->has('messages')
                ->has('statusCounts')
                ->has('filters')
        );
    }

    public function test_admin_index_displays_correct_status_counts(): void
    {
        ContactMessage::factory()->count(3)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);
        ContactMessage::factory()->count(1)->create(['status' => 'replied']);
        ContactMessage::factory()->count(1)->create(['status' => 'archived']);

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Admin/ContactMessages/Index')
                ->where('statusCounts.new', 3)
                ->where('statusCounts.read', 2)
                ->where('statusCounts.replied', 1)
                ->where('statusCounts.archived', 1)
        );
    }

    public function test_admin_index_can_filter_by_status(): void
    {
        ContactMessage::factory()->count(3)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index', ['status' => 'new']));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Admin/ContactMessages/Index')
                ->has('messages.data', 3)
        );
    }

    public function test_admin_index_can_search_messages(): void
    {
        ContactMessage::factory()->create(['name' => 'Juan Pérez']);
        ContactMessage::factory()->create(['name' => 'María García']);

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index', ['search' => 'Juan']));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Admin/ContactMessages/Index')
                ->has('messages.data', 1)
        );
    }

    public function test_admin_show_requires_authentication(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->get(route('admin.contact-messages.show', $message));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_show_renders_successfully(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.show', $message));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Admin/ContactMessages/Show')
                ->has('message')
        );
    }

    public function test_admin_show_marks_message_as_read_automatically(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'new']);

        $this->actingAs($this->user)
            ->get(route('admin.contact-messages.show', $message));

        $message->refresh();
        $this->assertEquals('read', $message->status);
        $this->assertNotNull($message->read_at);
    }

    public function test_mark_as_read_updates_status(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'new']);

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.mark-as-read', $message));

        $response->assertRedirect();
        $message->refresh();
        $this->assertEquals('read', $message->status);
        $this->assertNotNull($message->read_at);
    }

    public function test_mark_as_replied_updates_status(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'read']);

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.mark-as-replied', $message));

        $response->assertRedirect();
        $message->refresh();
        $this->assertEquals('replied', $message->status);
        $this->assertNotNull($message->replied_at);
    }

    public function test_archive_updates_status(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'read']);

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.archive', $message));

        $response->assertRedirect();
        $message->refresh();
        $this->assertEquals('archived', $message->status);
    }

    public function test_update_notes_saves_admin_notes(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.update-notes', $message), [
                'admin_notes' => 'Importante: seguimiento el próximo mes',
            ]);

        $response->assertRedirect();
        $message->refresh();
        $this->assertEquals('Importante: seguimiento el próximo mes', $message->admin_notes);
    }

    public function test_reply_marks_message_as_replied(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'read']);

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.reply', $message), [
                'reply_message' => 'Gracias por tu mensaje. Te responderé pronto.',
            ]);

        $response->assertRedirect();
        $message->refresh();
        $this->assertEquals('replied', $message->status);
        $this->assertNotNull($message->replied_at);
    }

    public function test_destroy_deletes_message(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('admin.contact-messages.destroy', $message));

        $response->assertRedirect(route('admin.contact-messages.index'));
        $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
    }

    public function test_bulk_action_mark_as_read(): void
    {
        $messages = ContactMessage::factory()->count(3)->create(['status' => 'new']);

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.bulk-action'), [
                'action' => 'mark_read',
                'message_ids' => $messages->pluck('id')->toArray(),
            ]);

        $response->assertRedirect();
        foreach ($messages as $message) {
            $message->refresh();
            $this->assertEquals('read', $message->status);
        }
    }

    public function test_bulk_action_delete(): void
    {
        $messages = ContactMessage::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.bulk-action'), [
                'action' => 'delete',
                'message_ids' => $messages->pluck('id')->toArray(),
            ]);

        $response->assertRedirect();
        foreach ($messages as $message) {
            $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
        }
    }
}
