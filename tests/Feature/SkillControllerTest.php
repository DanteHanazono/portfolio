<?php

namespace Tests\Feature;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_skills_index(): void
    {
        $response = $this->get(route('skills.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_skills_index(): void
    {
        $skills = Skill::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('skills.index'));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Skills/Index')
                ->has('skills', 3)
        );
    }

    public function test_skills_index_returns_ordered_items(): void
    {
        Skill::factory()->create(['name' => 'First', 'order' => 2]);
        Skill::factory()->create(['name' => 'Second', 'order' => 1]);
        Skill::factory()->create(['name' => 'Third', 'order' => 3]);

        $response = $this->actingAs($this->user)->get(route('skills.index'));

        $response->assertInertia(
            fn($page) => $page
                ->where('skills.0.name', 'Second')
                ->where('skills.1.name', 'First')
                ->where('skills.2.name', 'Third')
        );
    }

    public function test_skills_can_be_filtered_by_category(): void
    {
        Skill::factory()->create(['name' => 'React', 'category' => 'Frontend']);
        Skill::factory()->create(['name' => 'Laravel', 'category' => 'Backend']);

        $response = $this->actingAs($this->user)->get(route('skills.index', ['category' => 'Frontend']));

        $response->assertInertia(
            fn($page) => $page
                ->has('skills', 1)
                ->where('skills.0.name', 'React')
        );
    }

    public function test_skills_can_be_searched(): void
    {
        Skill::factory()->create(['name' => 'React']);
        Skill::factory()->create(['name' => 'Vue']);
        Skill::factory()->create(['name' => 'Laravel']);

        $response = $this->actingAs($this->user)->get(route('skills.index', ['search' => 'React']));

        $response->assertInertia(
            fn($page) => $page
                ->has('skills', 1)
                ->where('skills.0.name', 'React')
        );
    }

    public function test_guests_cannot_access_create_form(): void
    {
        $response = $this->get(route('skills.create'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_create_form(): void
    {
        $response = $this->actingAs($this->user)->get(route('skills.create'));

        $response->assertOk();
        $response->assertInertia(fn($page) => $page->component('Skills/Create'));
    }

    public function test_guests_cannot_create_skill(): void
    {
        $response = $this->post(route('skills.store'), [
            'name' => 'React',
            'category' => 'Frontend',
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('skills', 0);
    }

    public function test_authenticated_users_can_create_skill_with_required_fields(): void
    {
        $data = [
            'name' => 'React',
            'category' => 'Frontend',
        ];

        $response = $this->actingAs($this->user)->post(route('skills.store'), $data);

        $response->assertRedirect(route('skills.index'));
        $this->assertDatabaseHas('skills', [
            'name' => 'React',
            'category' => 'Frontend',
        ]);
    }

    public function test_name_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('skills.store'), [
            'category' => 'Frontend',
        ]);

        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('skills', 0);
    }

    public function test_category_is_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('skills.store'), [
            'name' => 'React',
        ]);

        $response->assertSessionHasErrors('category');
        $this->assertDatabaseCount('skills', 0);
    }

    public function test_icon_is_optional(): void
    {
        $response = $this->actingAs($this->user)->post(route('skills.store'), [
            'name' => 'React',
            'category' => 'Frontend',
            'icon' => '⚛️',
        ]);

        $response->assertRedirect(route('skills.index'));
        $this->assertDatabaseHas('skills', [
            'name' => 'React',
            'icon' => '⚛️',
        ]);
    }

    public function test_years_experience_must_be_positive_integer(): void
    {
        $response = $this->actingAs($this->user)->post(route('skills.store'), [
            'name' => 'React',
            'category' => 'Frontend',
            'years_experience' => -1,
        ]);

        $response->assertSessionHasErrors('years_experience');
    }

    public function test_guests_cannot_view_skill_details(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->get(route('skills.show', $skill));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_skill_details(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->user)->get(route('skills.show', $skill));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Skills/Show')
                ->has('skill')
                ->where('skill.id', $skill->id)
        );
    }

    public function test_guests_cannot_access_edit_form(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->get(route('skills.edit', $skill));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_edit_form(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->user)->get(route('skills.edit', $skill));

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Skills/Edit')
                ->where('skill.id', $skill->id)
        );
    }

    public function test_guests_cannot_update_skill(): void
    {
        $skill = Skill::factory()->create(['name' => 'Old Name']);

        $response = $this->put(route('skills.update', $skill), [
            'name' => 'New Name',
            'category' => $skill->category,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('skills', ['name' => 'Old Name']);
    }

    public function test_authenticated_users_can_update_skill(): void
    {
        $skill = Skill::factory()->create([
            'name' => 'Old Name',
            'category' => 'Frontend',
        ]);

        $response = $this->actingAs($this->user)->put(route('skills.update', $skill), [
            'name' => 'New Name',
            'category' => 'Backend',
        ]);

        $response->assertRedirect(route('skills.index'));
        $this->assertDatabaseHas('skills', [
            'id' => $skill->id,
            'name' => 'New Name',
            'category' => 'Backend',
        ]);
    }

    public function test_guests_cannot_delete_skill(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->delete(route('skills.destroy', $skill));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('skills', ['id' => $skill->id]);
    }

    public function test_authenticated_users_can_delete_skill(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('skills.destroy', $skill));

        $response->assertRedirect(route('skills.index'));
        $this->assertDatabaseMissing('skills', ['id' => $skill->id]);
    }

    public function test_guests_cannot_toggle_highlighted(): void
    {
        $skill = Skill::factory()->create(['is_highlighted' => false]);

        $response = $this->post(route('skills.toggle-highlighted', $skill));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_toggle_highlighted(): void
    {
        $skill = Skill::factory()->create(['is_highlighted' => false]);

        $response = $this->actingAs($this->user)->post(route('skills.toggle-highlighted', $skill));

        $response->assertRedirect();
        $this->assertTrue($skill->fresh()->is_highlighted);
    }

    public function test_toggle_highlighted_can_be_toggled_off(): void
    {
        $skill = Skill::factory()->create(['is_highlighted' => true]);

        $this->actingAs($this->user)->post(route('skills.toggle-highlighted', $skill));

        $this->assertFalse($skill->fresh()->is_highlighted);
    }

    public function test_guests_cannot_reorder_skills(): void
    {
        $skill1 = Skill::factory()->create(['order' => 1]);
        $skill2 = Skill::factory()->create(['order' => 2]);

        $response = $this->post(route('skills.reorder'), [
            'skills' => [
                ['id' => $skill2->id, 'order' => 1],
                ['id' => $skill1->id, 'order' => 2],
            ],
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_reorder_skills(): void
    {
        $skill1 = Skill::factory()->create(['order' => 1]);
        $skill2 = Skill::factory()->create(['order' => 2]);
        $skill3 = Skill::factory()->create(['order' => 3]);

        $response = $this->actingAs($this->user)->post(route('skills.reorder'), [
            'skills' => [
                ['id' => $skill3->id, 'order' => 1],
                ['id' => $skill1->id, 'order' => 2],
                ['id' => $skill2->id, 'order' => 3],
            ],
        ]);

        $response->assertRedirect();

        $this->assertEquals(1, $skill3->fresh()->order);
        $this->assertEquals(2, $skill1->fresh()->order);
        $this->assertEquals(3, $skill2->fresh()->order);
    }

    public function test_highlighted_scope_filters_only_highlighted_skills(): void
    {
        Skill::factory()->create(['is_highlighted' => true]);
        Skill::factory()->create(['is_highlighted' => false]);

        $highlighted = Skill::highlighted()->get();

        $this->assertCount(1, $highlighted);
        $this->assertTrue($highlighted->first()->is_highlighted);
    }

    public function test_by_category_scope_filters_skills_by_category(): void
    {
        Skill::factory()->create(['category' => 'Frontend']);
        Skill::factory()->create(['category' => 'Backend']);

        $frontend = Skill::byCategory('Frontend')->get();

        $this->assertCount(1, $frontend);
        $this->assertEquals('Frontend', $frontend->first()->category);
    }
}
