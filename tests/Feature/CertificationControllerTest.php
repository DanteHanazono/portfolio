<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_certifications_index(): void
    {
        $response = $this->get(route('certifications.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_certifications_index(): void
    {
        $certifications = Certification::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('certifications.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Certifications/Index')
                ->has('certifications', 3)
        );
    }

    public function test_certifications_index_returns_ordered_items(): void
    {
        Certification::factory()->create(['name' => 'First', 'issue_date' => now()->subDays(1)]);
        Certification::factory()->create(['name' => 'Second', 'issue_date' => now()]);
        Certification::factory()->create(['name' => 'Third', 'issue_date' => now()->subDays(2)]);

        $response = $this->actingAs($this->user)->get(route('certifications.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->where('certifications.0.name', 'Second')
                ->where('certifications.1.name', 'First')
                ->where('certifications.2.name', 'Third')
        );
    }

    public function test_certifications_can_be_filtered_by_active_status(): void
    {
        Certification::factory()->create(['name' => 'Active', 'does_not_expire' => true]);
        Certification::factory()->create([
            'name' => 'Expired',
            'does_not_expire' => false,
            'expiry_date' => now()->subDay(),
        ]);

        $response = $this->actingAs($this->user)->get(route('certifications.index', ['status' => 'active']));

        $response->assertInertia(
            fn ($page) => $page
                ->has('certifications', 1)
                ->where('certifications.0.name', 'Active')
        );
    }

    public function test_certifications_can_be_filtered_by_expired_status(): void
    {
        Certification::factory()->create(['name' => 'Active', 'does_not_expire' => true]);
        Certification::factory()->create([
            'name' => 'Expired',
            'does_not_expire' => false,
            'expiry_date' => now()->subDay(),
        ]);

        $response = $this->actingAs($this->user)->get(route('certifications.index', ['status' => 'expired']));

        $response->assertInertia(
            fn ($page) => $page
                ->has('certifications', 1)
                ->where('certifications.0.name', 'Expired')
        );
    }

    public function test_certifications_can_be_searched(): void
    {
        Certification::factory()->create(['name' => 'AWS Certified']);
        Certification::factory()->create(['name' => 'Azure Certified']);
        Certification::factory()->create(['name' => 'Google Cloud']);

        $response = $this->actingAs($this->user)->get(route('certifications.index', ['search' => 'AWS']));

        $response->assertInertia(
            fn ($page) => $page
                ->has('certifications', 1)
                ->where('certifications.0.name', 'AWS Certified')
        );
    }

    public function test_guests_cannot_access_create_form(): void
    {
        $response = $this->get(route('certifications.create'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_create_form(): void
    {
        $response = $this->actingAs($this->user)->get(route('certifications.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Certifications/Create'));
    }

    public function test_guests_cannot_create_certification(): void
    {
        $response = $this->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
            'issue_date' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('certifications', 0);
    }

    public function test_authenticated_users_can_create_certification_with_required_fields(): void
    {
        $data = [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
            'issue_date' => now()->toDateString(),
        ];

        $response = $this->actingAs($this->user)->post(route('certifications.store'), $data);

        $response->assertRedirect(route('certifications.index'));
        $this->assertDatabaseHas('certifications', [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
        ]);
    }

    public function test_name_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'issuing_organization' => 'Amazon Web Services',
            'issue_date' => now()->toDateString(),
        ]);

        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('certifications', 0);
    }

    public function test_issuing_organization_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issue_date' => now()->toDateString(),
        ]);

        $response->assertSessionHasErrors('issuing_organization');
        $this->assertDatabaseCount('certifications', 0);
    }

    public function test_issue_date_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
        ]);

        $response->assertSessionHasErrors('issue_date');
        $this->assertDatabaseCount('certifications', 0);
    }

    public function test_badge_image_can_be_uploaded(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
            'badge_image' => UploadedFile::fake()->image('badge.jpg'),
            'issue_date' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('certifications.index'));
        $certification = Certification::first();
        $this->assertNotNull($certification->badge_image);
        Storage::disk('public')->assertExists($certification->badge_image);
    }

    public function test_badge_image_must_be_an_image(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
            'badge_image' => UploadedFile::fake()->create('document.pdf', 100),
            'issue_date' => now()->toDateString(),
        ]);

        $response->assertSessionHasErrors('badge_image');
    }

    public function test_does_not_expire_automatically_nullifies_expiry_date(): void
    {
        $response = $this->actingAs($this->user)->post(route('certifications.store'), [
            'name' => 'AWS Certified',
            'issuing_organization' => 'Amazon Web Services',
            'issue_date' => now()->toDateString(),
            'expiry_date' => now()->addYear()->toDateString(),
            'does_not_expire' => true,
        ]);

        $response->assertRedirect(route('certifications.index'));
        $this->assertDatabaseHas('certifications', [
            'name' => 'AWS Certified',
            'expiry_date' => null,
        ]);
    }

    public function test_guests_cannot_view_certification_details(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->get(route('certifications.show', $certification));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_certification_details(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->actingAs($this->user)->get(route('certifications.show', $certification));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Certifications/Show')
                ->has('certification')
                ->where('certification.id', $certification->id)
        );
    }

    public function test_guests_cannot_access_edit_form(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->get(route('certifications.edit', $certification));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_edit_form(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->actingAs($this->user)->get(route('certifications.edit', $certification));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Certifications/Edit')
                ->where('certification.id', $certification->id)
        );
    }

    public function test_guests_cannot_update_certification(): void
    {
        $certification = Certification::factory()->create(['name' => 'Old Name']);

        $response = $this->put(route('certifications.update', $certification), [
            'name' => 'New Name',
            'issuing_organization' => $certification->issuing_organization,
            'issue_date' => $certification->issue_date->toDateString(),
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('certifications', ['name' => 'Old Name']);
    }

    public function test_authenticated_users_can_update_certification(): void
    {
        $certification = Certification::factory()->create([
            'name' => 'Old Name',
            'issuing_organization' => 'Old Org',
        ]);

        $response = $this->actingAs($this->user)->put(route('certifications.update', $certification), [
            'name' => 'New Name',
            'issuing_organization' => 'New Org',
            'issue_date' => $certification->issue_date->toDateString(),
        ]);

        $response->assertRedirect(route('certifications.index'));
        $this->assertDatabaseHas('certifications', [
            'id' => $certification->id,
            'name' => 'New Name',
            'issuing_organization' => 'New Org',
        ]);
    }

    public function test_updating_certification_preserves_badge_when_not_provided(): void
    {
        Storage::fake('public');
        $certification = Certification::factory()->create([
            'badge_image' => 'certifications/badges/test.jpg',
        ]);

        $response = $this->actingAs($this->user)->put(route('certifications.update', $certification), [
            'name' => $certification->name,
            'issuing_organization' => $certification->issuing_organization,
            'issue_date' => $certification->issue_date->toDateString(),
        ]);

        $response->assertRedirect(route('certifications.index'));
        $this->assertDatabaseHas('certifications', [
            'id' => $certification->id,
            'badge_image' => 'certifications/badges/test.jpg',
        ]);
    }

    public function test_updating_certification_can_replace_badge(): void
    {
        Storage::fake('public');
        $oldBadge = UploadedFile::fake()->image('old-badge.jpg');
        $oldPath = $oldBadge->store('certifications/badges', 'public');

        $certification = Certification::factory()->create([
            'badge_image' => $oldPath,
        ]);

        Storage::disk('public')->assertExists($oldPath);

        $response = $this->actingAs($this->user)->put(route('certifications.update', $certification), [
            'name' => $certification->name,
            'issuing_organization' => $certification->issuing_organization,
            'badge_image' => UploadedFile::fake()->image('new-badge.jpg'),
            'issue_date' => $certification->issue_date->toDateString(),
        ]);

        $response->assertRedirect(route('certifications.index'));
        $certification->refresh();
        $this->assertNotEquals($oldPath, $certification->badge_image);
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($certification->badge_image);
    }

    public function test_updating_certification_can_remove_badge(): void
    {
        Storage::fake('public');
        $badge = UploadedFile::fake()->image('badge.jpg');
        $path = $badge->store('certifications/badges', 'public');

        $certification = Certification::factory()->create([
            'badge_image' => $path,
        ]);

        $response = $this->actingAs($this->user)->put(route('certifications.update', $certification), [
            'name' => $certification->name,
            'issuing_organization' => $certification->issuing_organization,
            'remove_badge' => true,
            'issue_date' => $certification->issue_date->toDateString(),
        ]);

        $response->assertRedirect(route('certifications.index'));
        $certification->refresh();
        $this->assertNull($certification->badge_image);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_guests_cannot_delete_certification(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->delete(route('certifications.destroy', $certification));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('certifications', ['id' => $certification->id]);
    }

    public function test_authenticated_users_can_delete_certification(): void
    {
        $certification = Certification::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('certifications.destroy', $certification));

        $response->assertRedirect(route('certifications.index'));
        $this->assertDatabaseMissing('certifications', ['id' => $certification->id]);
    }

    public function test_deleting_certification_removes_badge_file(): void
    {
        Storage::fake('public');
        $badge = UploadedFile::fake()->image('badge.jpg');
        $path = $badge->store('certifications/badges', 'public');

        $certification = Certification::factory()->create([
            'badge_image' => $path,
        ]);

        Storage::disk('public')->assertExists($path);

        $this->actingAs($this->user)->delete(route('certifications.destroy', $certification));

        Storage::disk('public')->assertMissing($path);
    }

    public function test_guests_cannot_reorder_certifications(): void
    {
        $cert1 = Certification::factory()->create(['order' => 1]);
        $cert2 = Certification::factory()->create(['order' => 2]);

        $response = $this->post(route('certifications.reorder'), [
            'certifications' => [
                ['id' => $cert2->id, 'order' => 1],
                ['id' => $cert1->id, 'order' => 2],
            ],
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_reorder_certifications(): void
    {
        $cert1 = Certification::factory()->create(['order' => 1]);
        $cert2 = Certification::factory()->create(['order' => 2]);
        $cert3 = Certification::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)->post(route('certifications.reorder'), [
            'certifications' => [
                ['id' => $cert3->id, 'order' => 1],
                ['id' => $cert1->id, 'order' => 2],
                ['id' => $cert2->id, 'order' => 3],
            ],
        ]);

        $response->assertRedirect();

        $this->assertEquals(1, $cert3->fresh()->order);
        $this->assertEquals(2, $cert1->fresh()->order);
        $this->assertEquals(3, $cert2->fresh()->order);
    }

    public function test_active_scope_filters_only_active_certifications(): void
    {
        Certification::factory()->create(['does_not_expire' => true]);
        Certification::factory()->create([
            'does_not_expire' => false,
            'expiry_date' => now()->subDay(),
        ]);

        $active = Certification::active()->get();

        $this->assertCount(1, $active);
    }

    public function test_expired_scope_filters_only_expired_certifications(): void
    {
        Certification::factory()->create(['does_not_expire' => true]);
        Certification::factory()->create([
            'does_not_expire' => false,
            'expiry_date' => now()->subDay(),
        ]);

        $expired = Certification::expired()->get();

        $this->assertCount(1, $expired);
    }
}
