<?php

namespace Tests\Feature;

use App\Models\ReviewTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTemplateTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create and authenticate a user for testing
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_user_can_view_review_templates_list()
    {
        // Create some test templates
        ReviewTemplate::factory()->count(3)->create();

        // Test the index endpoint
        $response = $this->get('/review-templates');

        $response->assertStatus(200)
            ->assertInertia(fn ($assert) => $assert
                ->component('review-templates/index')
                ->has('templates', 3)
            );
    }

    public function test_user_can_create_review_template()
    {
        $templateData = [
            'title' => 'Performance Review Template',
            'description' => 'Annual performance review template',
            'criteria' => [
                'Communication skills',
                'Technical expertise',
                'Team collaboration'
            ]
        ];

        $response = $this->post('/review-templates', $templateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('review_templates', [
            'title' => $templateData['title'],
            'description' => $templateData['description']
        ]);
    }

    public function test_user_cannot_create_template_with_invalid_data()
    {
        $response = $this->post('/review-templates', [
            'title' => '', // Required field is empty
            'description' => 'Some description',
            'criteria' => 'not-an-array' // Should be an array
        ]);

        $response->assertSessionHasErrors(['title', 'criteria']);
    }

    public function test_user_can_update_review_template()
    {
        $template = ReviewTemplate::factory()->create();
        
        $updatedData = [
            'title' => 'Updated Template',
            'description' => 'Updated description',
            'criteria' => [
                'Updated criterion 1',
                'Updated criterion 2'
            ]
        ];

        $response = $this->put("/review-templates/{$template->id}", $updatedData);

        $response->assertRedirect();
        $this->assertDatabaseHas('review_templates', [
            'id' => $template->id,
            'title' => $updatedData['title'],
            'description' => $updatedData['description']
        ]);
    }

    public function test_user_cannot_update_template_with_invalid_data()
    {
        $template = ReviewTemplate::factory()->create();

        $response = $this->put("/review-templates/{$template->id}", [
            'title' => '', // Required field is empty
            'criteria' => 'not-an-array' // Should be an array
        ]);

        $response->assertSessionHasErrors(['title', 'criteria']);
    }

    public function test_user_can_delete_review_template()
    {
        $template = ReviewTemplate::factory()->create();

        $response = $this->delete("/review-templates/{$template->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('review_templates', ['id' => $template->id]);
    }

    public function test_review_template_criteria_is_json()
    {
        $template = ReviewTemplate::factory()->create([
            'criteria' => ['Test Criterion 1', 'Test Criterion 2']
        ]);

        $this->assertIsArray($template->criteria);
        $this->assertCount(2, $template->criteria);
    }
}
