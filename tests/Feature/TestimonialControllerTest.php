<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TestimonialControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_testimonials_index(): void
    {
        $response = $this->get(route('testimonials.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_testimonials_index(): void
    {
        $testimonials = Testimonial::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('testimonials.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials/Index')
                ->has('testimonials.data', 3)
        );
    }

    public function test_testimonials_index_returns_ordered_items(): void
    {
        Testimonial::factory()->create(['client_name' => 'First', 'order' => 1]);
        Testimonial::factory()->create(['client_name' => 'Second', 'order' => 0]);
        Testimonial::factory()->create(['client_name' => 'Third', 'order' => 2]);

        $response = $this->actingAs($this->user)->get(route('testimonials.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->where('testimonials.data.0.client_name', 'Second')
                ->where('testimonials.data.1.client_name', 'First')
                ->where('testimonials.data.2.client_name', 'Third')
        );
    }

    public function test_testimonials_can_be_filtered_by_project(): void
    {
        $project = Project::factory()->create();
        Testimonial::factory()->create(['client_name' => 'With Project', 'project_id' => $project->id]);
        Testimonial::factory()->create(['client_name' => 'Without Project', 'project_id' => null]);

        $response = $this->actingAs($this->user)->get(route('testimonials.index', ['project' => $project->id]));

        $response->assertInertia(
            fn ($page) => $page
                ->has('testimonials.data', 1)
                ->where('testimonials.data.0.client_name', 'With Project')
        );
    }

    public function test_testimonials_can_be_filtered_by_rating(): void
    {
        Testimonial::factory()->create(['client_name' => 'Five Stars', 'rating' => 5]);
        Testimonial::factory()->create(['client_name' => 'Four Stars', 'rating' => 4]);
        Testimonial::factory()->create(['client_name' => 'Three Stars', 'rating' => 3]);

        $response = $this->actingAs($this->user)->get(route('testimonials.index', ['rating' => 5]));

        $response->assertInertia(
            fn ($page) => $page
                ->has('testimonials.data', 1)
                ->where('testimonials.data.0.client_name', 'Five Stars')
        );
    }

    public function test_testimonials_can_be_searched(): void
    {
        Testimonial::factory()->create(['client_name' => 'John Doe', 'client_company' => 'Tech Corp']);
        Testimonial::factory()->create(['client_name' => 'Jane Smith', 'client_company' => 'Design Inc']);
        Testimonial::factory()->create(['client_name' => 'Bob Wilson', 'content' => 'Amazing work with tech']);

        $response = $this->actingAs($this->user)->get(route('testimonials.index', ['search' => 'tech']));

        $response->assertInertia(
            fn ($page) => $page->has('testimonials.data', 2)
        );
    }

    public function test_guests_cannot_access_create_form(): void
    {
        $response = $this->get(route('testimonials.create'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_create_form(): void
    {
        $response = $this->actingAs($this->user)->get(route('testimonials.create'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials/Create')
                ->has('projects')
        );
    }

    public function test_guests_cannot_create_testimonial(): void
    {
        $response = $this->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
            'rating' => 5,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_authenticated_users_can_create_testimonial_with_required_fields(): void
    {
        $data = [
            'client_name' => 'John Doe',
            'content' => 'Excellent work! Highly recommended.',
            'rating' => 5,
        ];

        $response = $this->actingAs($this->user)->post(route('testimonials.store'), $data);

        $response->assertRedirect(route('testimonials.index'));
        $this->assertDatabaseHas('testimonials', [
            'client_name' => 'John Doe',
            'content' => 'Excellent work! Highly recommended.',
            'rating' => 5,
        ]);
    }

    public function test_client_name_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'content' => 'Great service!',
            'rating' => 5,
        ]);

        $response->assertSessionHasErrors('client_name');
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_content_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'rating' => 5,
        ]);

        $response->assertSessionHasErrors('content');
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_rating_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_rating_must_be_between_1_and_5(): void
    {
        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
            'rating' => 6,
        ]);

        $response->assertSessionHasErrors('rating');

        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
            'rating' => 0,
        ]);

        $response->assertSessionHasErrors('rating');
    }

    public function test_client_avatar_can_be_uploaded(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
            'rating' => 5,
            'client_avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $testimonial = Testimonial::first();
        $this->assertNotNull($testimonial->client_avatar);
        Storage::disk('public')->assertExists($testimonial->client_avatar);
    }

    public function test_client_avatar_must_be_an_image(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great service!',
            'rating' => 5,
            'client_avatar' => UploadedFile::fake()->create('document.pdf', 100),
        ]);

        $response->assertSessionHasErrors('client_avatar');
    }

    public function test_testimonial_can_be_associated_with_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($this->user)->post(route('testimonials.store'), [
            'client_name' => 'John Doe',
            'content' => 'Great project!',
            'rating' => 5,
            'project_id' => $project->id,
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $this->assertDatabaseHas('testimonials', [
            'client_name' => 'John Doe',
            'project_id' => $project->id,
        ]);
    }

    public function test_guests_cannot_view_testimonial_details(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->get(route('testimonials.show', $testimonial));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_testimonial_details(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->actingAs($this->user)->get(route('testimonials.show', $testimonial));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials/Show')
                ->has('testimonial')
                ->where('testimonial.id', $testimonial->id)
        );
    }

    public function test_guests_cannot_access_edit_form(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->get(route('testimonials.edit', $testimonial));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_edit_form(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->actingAs($this->user)->get(route('testimonials.edit', $testimonial));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Testimonials/Edit')
                ->where('testimonial.id', $testimonial->id)
                ->has('projects')
        );
    }

    public function test_guests_cannot_update_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create(['client_name' => 'Old Name']);

        $response = $this->put(route('testimonials.update', $testimonial), [
            'client_name' => 'New Name',
            'content' => $testimonial->content,
            'rating' => $testimonial->rating,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('testimonials', ['client_name' => 'Old Name']);
    }

    public function test_authenticated_users_can_update_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create([
            'client_name' => 'Old Name',
            'content' => 'Old content',
        ]);

        $response = $this->actingAs($this->user)->put(route('testimonials.update', $testimonial), [
            'client_name' => 'New Name',
            'content' => 'New content',
            'rating' => 5,
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'client_name' => 'New Name',
            'content' => 'New content',
        ]);
    }

    public function test_avatar_can_be_updated(): void
    {
        Storage::fake('public');

        $testimonial = Testimonial::factory()->create([
            'client_avatar' => 'testimonials/avatars/old.jpg',
        ]);

        Storage::disk('public')->put('testimonials/avatars/old.jpg', 'old content');

        $response = $this->actingAs($this->user)->put(route('testimonials.update', $testimonial), [
            'client_name' => $testimonial->client_name,
            'content' => $testimonial->content,
            'rating' => $testimonial->rating,
            'client_avatar' => UploadedFile::fake()->image('new.jpg'),
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $testimonial->refresh();
        $this->assertNotNull($testimonial->client_avatar);
        $this->assertNotEquals('testimonials/avatars/old.jpg', $testimonial->client_avatar);
        Storage::disk('public')->assertMissing('testimonials/avatars/old.jpg');
    }

    public function test_avatar_can_be_removed(): void
    {
        Storage::fake('public');

        $testimonial = Testimonial::factory()->create([
            'client_avatar' => 'testimonials/avatars/avatar.jpg',
        ]);

        Storage::disk('public')->put('testimonials/avatars/avatar.jpg', 'content');

        $response = $this->actingAs($this->user)->put(route('testimonials.update', $testimonial), [
            'client_name' => $testimonial->client_name,
            'content' => $testimonial->content,
            'rating' => $testimonial->rating,
            'remove_avatar' => true,
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $testimonial->refresh();
        $this->assertNull($testimonial->client_avatar);
        Storage::disk('public')->assertMissing('testimonials/avatars/avatar.jpg');
    }

    public function test_existing_avatar_is_preserved_when_updating_other_fields(): void
    {
        Storage::fake('public');

        $testimonial = Testimonial::factory()->create([
            'client_name' => 'Original Name',
            'content' => 'Original content',
            'rating' => 4,
            'client_avatar' => 'testimonials/avatars/avatar.jpg',
        ]);

        Storage::disk('public')->put('testimonials/avatars/avatar.jpg', 'avatar content');

        $response = $this->actingAs($this->user)->put(route('testimonials.update', $testimonial), [
            'client_name' => 'Updated Name',
            'content' => 'Updated content',
            'rating' => 5,
        ]);

        $response->assertRedirect(route('testimonials.index'));
        $testimonial->refresh();
        $this->assertEquals('testimonials/avatars/avatar.jpg', $testimonial->client_avatar);
        Storage::disk('public')->assertExists('testimonials/avatars/avatar.jpg');
    }

    public function test_guests_cannot_delete_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->delete(route('testimonials.destroy', $testimonial));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id]);
    }

    public function test_authenticated_users_can_delete_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('testimonials.destroy', $testimonial));

        $response->assertRedirect(route('testimonials.index'));
        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }

    public function test_deleting_testimonial_removes_avatar_from_storage(): void
    {
        Storage::fake('public');

        $testimonial = Testimonial::factory()->create([
            'client_avatar' => 'testimonials/avatars/avatar.jpg',
        ]);

        Storage::disk('public')->put('testimonials/avatars/avatar.jpg', 'content');

        $response = $this->actingAs($this->user)->delete(route('testimonials.destroy', $testimonial));

        $response->assertRedirect(route('testimonials.index'));
        Storage::disk('public')->assertMissing('testimonials/avatars/avatar.jpg');
    }

    public function test_guests_cannot_toggle_featured(): void
    {
        $testimonial = Testimonial::factory()->create(['is_featured' => false]);

        $response = $this->post(route('testimonials.toggle-featured', $testimonial));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'is_featured' => false,
        ]);
    }

    public function test_authenticated_users_can_toggle_featured(): void
    {
        $testimonial = Testimonial::factory()->create(['is_featured' => false]);

        $response = $this->actingAs($this->user)->post(route('testimonials.toggle-featured', $testimonial));

        $response->assertRedirect();
        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'is_featured' => true,
        ]);

        $response = $this->actingAs($this->user)->post(route('testimonials.toggle-featured', $testimonial));

        $response->assertRedirect();
        $testimonial->refresh();
        $this->assertFalse($testimonial->is_featured);
    }

    public function test_guests_cannot_toggle_published(): void
    {
        $testimonial = Testimonial::factory()->create(['is_published' => false]);

        $response = $this->post(route('testimonials.toggle-published', $testimonial));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'is_published' => false,
        ]);
    }

    public function test_authenticated_users_can_toggle_published(): void
    {
        $testimonial = Testimonial::factory()->create(['is_published' => false]);

        $response = $this->actingAs($this->user)->post(route('testimonials.toggle-published', $testimonial));

        $response->assertRedirect();
        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'is_published' => true,
        ]);

        $response = $this->actingAs($this->user)->post(route('testimonials.toggle-published', $testimonial));

        $response->assertRedirect();
        $testimonial->refresh();
        $this->assertFalse($testimonial->is_published);
    }

    public function test_guests_cannot_reorder_testimonials(): void
    {
        $testimonials = Testimonial::factory()->count(3)->create();

        $response = $this->post(route('testimonials.reorder'), [
            'items' => $testimonials->pluck('id')->toArray(),
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_reorder_testimonials(): void
    {
        $first = Testimonial::factory()->create(['order' => 1]);
        $second = Testimonial::factory()->create(['order' => 2]);
        $third = Testimonial::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)->post(route('testimonials.reorder'), [
            'testimonials' => [
                ['id' => $third->id, 'order' => 1],
                ['id' => $first->id, 'order' => 2],
                ['id' => $second->id, 'order' => 3],
            ],
        ]);

        $response->assertRedirect();

        $this->assertEquals(1, $third->fresh()->order);
        $this->assertEquals(2, $first->fresh()->order);
        $this->assertEquals(3, $second->fresh()->order);
    }

    public function test_published_scope_returns_only_published_testimonials(): void
    {
        Testimonial::factory()->create(['is_published' => true]);
        Testimonial::factory()->create(['is_published' => false]);

        $published = Testimonial::published()->count();

        $this->assertEquals(1, $published);
    }

    public function test_featured_scope_returns_only_featured_testimonials(): void
    {
        Testimonial::factory()->create(['is_featured' => true]);
        Testimonial::factory()->create(['is_featured' => false]);

        $featured = Testimonial::featured()->count();

        $this->assertEquals(1, $featured);
    }

    public function test_testimonials_are_ordered_correctly_by_default(): void
    {
        $first = Testimonial::factory()->create(['order' => 10]);
        $second = Testimonial::factory()->create(['order' => 5]);
        $third = Testimonial::factory()->create(['order' => 7]);

        $ordered = Testimonial::ordered()->pluck('id')->toArray();

        $this->assertEquals([$second->id, $third->id, $first->id], $ordered);
    }
}
