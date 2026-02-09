<?php

namespace Tests\Feature;

use App\Models\Education;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EducationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function guests_cannot_access_education_index(): void
    {
        $response = $this->get(route('education.index'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_users_can_view_education_index(): void
    {
        $educations = Education::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('education.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Education/Index')
                ->has('education', 3)
        );
    }

    /** @test */
    public function education_index_returns_ordered_items(): void
    {
        Education::factory()->create(['degree' => 'First', 'order' => 2]);
        Education::factory()->create(['degree' => 'Second', 'order' => 1]);
        Education::factory()->create(['degree' => 'Third', 'order' => 3]);

        $response = $this->actingAs($this->user)->get(route('education.index'));

        $response->assertInertia(
            fn ($page) => $page
                ->where('education.0.degree', 'Second')
                ->where('education.1.degree', 'First')
                ->where('education.2.degree', 'Third')
        );
    }

    /** @test */
    public function guests_cannot_access_create_form(): void
    {
        $response = $this->get(route('education.create'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_users_can_view_create_form(): void
    {
        $response = $this->actingAs($this->user)->get(route('education.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Education/Create'));
    }

    /** @test */
    public function guests_cannot_create_education(): void
    {
        $response = $this->post(route('education.store'), [
            'degree' => 'Computer Science',
            'institution' => 'MIT',
            'start_date' => '2020-01-01',
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('education', 0);
    }

    /** @test */
    public function authenticated_users_can_create_education_with_required_fields(): void
    {
        Storage::fake('public');

        $data = [
            'degree' => 'Computer Science Degree',
            'institution' => 'Massachusetts Institute of Technology',
            'start_date' => '2020-01-01',
            'is_current' => false,
        ];

        $response = $this->actingAs($this->user)->post(route('education.store'), $data);

        $response->assertRedirect(route('education.index'));

        $education = Education::first();
        $this->assertEquals('Computer Science Degree', $education->degree);
        $this->assertEquals('Massachusetts Institute of Technology', $education->institution);
        $this->assertEquals('2020-01-01', $education->start_date->format('Y-m-d'));
    }

    /** @test */
    public function degree_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'institution' => 'MIT',
            'start_date' => '2020-01-01',
        ]);

        $response->assertSessionHasErrors('degree');
        $this->assertDatabaseCount('education', 0);
    }

    /** @test */
    public function institution_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'degree' => 'Computer Science',
            'start_date' => '2020-01-01',
        ]);

        $response->assertSessionHasErrors('institution');
        $this->assertDatabaseCount('education', 0);
    }

    /** @test */
    public function start_date_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'degree' => 'Computer Science',
            'institution' => 'MIT',
        ]);

        $response->assertSessionHasErrors('start_date');
        $this->assertDatabaseCount('education', 0);
    }

    /** @test */
    public function institution_logo_can_be_uploaded(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('mit-logo.png');

        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'degree' => 'Computer Science',
            'institution' => 'MIT',
            'institution_logo' => $logo,
            'start_date' => '2020-01-01',
        ]);

        $response->assertRedirect(route('education.index'));

        $education = Education::first();
        $this->assertNotNull($education->institution_logo);
        Storage::disk('public')->assertExists($education->institution_logo);
    }

    /** @test */
    public function institution_logo_must_be_an_image(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('document.pdf');

        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'degree' => 'Computer Science',
            'institution' => 'MIT',
            'institution_logo' => $file,
            'start_date' => '2020-01-01',
        ]);

        $response->assertSessionHasErrors('institution_logo');
        $this->assertDatabaseCount('education', 0);
    }

    /** @test */
    public function is_current_automatically_nullifies_end_date(): void
    {
        $response = $this->actingAs($this->user)->post(route('education.store'), [
            'degree' => 'Computer Science',
            'institution' => 'MIT',
            'start_date' => '2020-01-01',
            'end_date' => '2024-01-01',
            'is_current' => true,
        ]);

        $response->assertRedirect(route('education.index'));

        $education = Education::first();
        $this->assertTrue($education->is_current);
        $this->assertNull($education->end_date);
    }

    /** @test */
    public function guests_cannot_view_education_details(): void
    {
        $education = Education::factory()->create();

        $response = $this->get(route('education.show', $education));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_users_can_view_education_details(): void
    {
        $education = Education::factory()->create();

        $response = $this->actingAs($this->user)->get(route('education.show', $education));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Education/Show')
                ->has('education')
                ->where('education.id', $education->id)
        );
    }

    /** @test */
    public function guests_cannot_access_edit_form(): void
    {
        $education = Education::factory()->create();

        $response = $this->get(route('education.edit', $education));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_users_can_view_edit_form(): void
    {
        $education = Education::factory()->create();

        $response = $this->actingAs($this->user)->get(route('education.edit', $education));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('Education/Edit')
                ->where('education.id', $education->id)
        );
    }

    /** @test */
    public function guests_cannot_update_education(): void
    {
        $education = Education::factory()->create(['degree' => 'Old Degree']);

        $response = $this->put(route('education.update', $education), [
            'degree' => 'New Degree',
            'institution' => $education->institution,
            'start_date' => $education->start_date,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('education', ['degree' => 'Old Degree']);
    }

    /** @test */
    public function authenticated_users_can_update_education(): void
    {
        $education = Education::factory()->create([
            'degree' => 'Old Degree',
            'institution' => 'Old Institution',
        ]);

        $response = $this->actingAs($this->user)->put(route('education.update', $education), [
            'degree' => 'New Degree',
            'institution' => 'New Institution',
            'start_date' => $education->start_date,
        ]);

        $response->assertRedirect(route('education.index'));
        $this->assertDatabaseHas('education', [
            'id' => $education->id,
            'degree' => 'New Degree',
            'institution' => 'New Institution',
        ]);
    }

    /** @test */
    public function updating_education_preserves_logo_when_not_provided(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('logo.png');
        $education = Education::factory()->create([
            'institution_logo' => $logo->store('education', 'public'),
        ]);

        $originalLogo = $education->institution_logo;

        $response = $this->actingAs($this->user)->put(route('education.update', $education), [
            'degree' => 'Updated Degree',
            'institution' => $education->institution,
            'start_date' => $education->start_date,
        ]);

        $response->assertRedirect(route('education.index'));

        $education->refresh();
        $this->assertEquals($originalLogo, $education->institution_logo);
        Storage::disk('public')->assertExists($originalLogo);
    }

    /** @test */
    public function updating_education_can_replace_logo(): void
    {
        Storage::fake('public');

        $oldLogo = UploadedFile::fake()->image('old-logo.png');
        $education = Education::factory()->create([
            'institution_logo' => $oldLogo->store('education', 'public'),
        ]);

        $oldLogoPath = $education->institution_logo;

        $newLogo = UploadedFile::fake()->image('new-logo.png');

        $response = $this->actingAs($this->user)->put(route('education.update', $education), [
            'degree' => $education->degree,
            'institution' => $education->institution,
            'start_date' => $education->start_date,
            'institution_logo' => $newLogo,
        ]);

        $response->assertRedirect(route('education.index'));

        $education->refresh();
        $this->assertNotEquals($oldLogoPath, $education->institution_logo);
        Storage::disk('public')->assertMissing($oldLogoPath);
        Storage::disk('public')->assertExists($education->institution_logo);
    }

    /** @test */
    public function updating_education_can_remove_logo(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('logo.png');
        $education = Education::factory()->create([
            'institution_logo' => $logo->store('education', 'public'),
        ]);

        $logoPath = $education->institution_logo;

        $response = $this->actingAs($this->user)->put(route('education.update', $education), [
            'degree' => $education->degree,
            'institution' => $education->institution,
            'start_date' => $education->start_date,
            'remove_logo' => true,
        ]);

        $response->assertRedirect(route('education.index'));

        $education->refresh();
        $this->assertNull($education->institution_logo);
        Storage::disk('public')->assertMissing($logoPath);
    }

    /** @test */
    public function guests_cannot_delete_education(): void
    {
        $education = Education::factory()->create();

        $response = $this->delete(route('education.destroy', $education));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('education', ['id' => $education->id]);
    }

    /** @test */
    public function authenticated_users_can_delete_education(): void
    {
        $education = Education::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('education.destroy', $education));

        $response->assertRedirect(route('education.index'));
        $this->assertDatabaseMissing('education', ['id' => $education->id]);
    }

    /** @test */
    public function deleting_education_removes_logo_file(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('logo.png');
        $education = Education::factory()->create([
            'institution_logo' => $logo->store('education', 'public'),
        ]);

        $logoPath = $education->institution_logo;
        Storage::disk('public')->assertExists($logoPath);

        $this->actingAs($this->user)->delete(route('education.destroy', $education));

        Storage::disk('public')->assertMissing($logoPath);
    }

    /** @test */
    public function guests_cannot_reorder_education(): void
    {
        $education1 = Education::factory()->create(['order' => 1]);
        $education2 = Education::factory()->create(['order' => 2]);

        $response = $this->post(route('education.reorder'), [
            'items' => [
                ['id' => $education2->id, 'order' => 1],
                ['id' => $education1->id, 'order' => 2],
            ],
        ]);

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_users_can_reorder_education(): void
    {
        $education1 = Education::factory()->create(['order' => 1]);
        $education2 = Education::factory()->create(['order' => 2]);
        $education3 = Education::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)->post(route('education.reorder'), [
            'education' => [
                ['id' => $education3->id, 'order' => 1],
                ['id' => $education1->id, 'order' => 2],
                ['id' => $education2->id, 'order' => 3],
            ],
        ]);

        $response->assertRedirect();

        $this->assertEquals(1, $education3->fresh()->order);
        $this->assertEquals(2, $education1->fresh()->order);
        $this->assertEquals(3, $education2->fresh()->order);
    }

    /** @test */
    public function institution_logo_url_accessor_returns_full_url(): void
    {
        Storage::fake('public');

        $logo = UploadedFile::fake()->image('logo.png');
        $education = Education::factory()->create([
            'institution_logo' => $logo->store('education', 'public'),
        ]);

        $this->assertStringContainsString('/storage/', $education->institution_logo_url);
        $this->assertStringContainsString($education->institution_logo, $education->institution_logo_url);
    }

    /** @test */
    public function institution_logo_url_accessor_returns_null_when_no_logo(): void
    {
        $education = Education::factory()->create(['institution_logo' => null]);

        $this->assertNull($education->institution_logo_url);
    }

    /** @test */
    public function period_accessor_returns_formatted_period(): void
    {
        $education = Education::factory()->create([
            'start_date' => '2020-01-15',
            'end_date' => '2024-05-20',
        ]);

        $this->assertStringContainsString('2020', $education->period);
        $this->assertStringContainsString('2024', $education->period);
    }

    /** @test */
    public function period_accessor_shows_present_for_current_education(): void
    {
        $education = Education::factory()->create([
            'start_date' => '2020-01-01',
            'end_date' => null,
            'is_current' => true,
        ]);

        $this->assertStringContainsString('Presente', $education->period);
    }

    /** @test */
    public function full_degree_accessor_returns_combined_degree_and_field(): void
    {
        $education = Education::factory()->create([
            'degree' => 'Bachelor of Science',
            'field_of_study' => 'Computer Science',
        ]);

        $this->assertEquals('Bachelor of Science in Computer Science', $education->full_degree);
    }

    /** @test */
    public function full_degree_accessor_returns_degree_only_when_no_field(): void
    {
        $education = Education::factory()->create([
            'degree' => 'Bachelor of Science',
            'field_of_study' => null,
        ]);

        $this->assertEquals('Bachelor of Science', $education->full_degree);
    }
}
