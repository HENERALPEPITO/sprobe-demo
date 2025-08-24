<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeTest extends TestCase
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

    public function test_user_can_view_employees_list()
    {
        // Create some test employees
        Employee::factory()->count(3)->create();

        // Test the index endpoint
        $response = $this->get('/employees');

        $response->assertStatus(200)
            ->assertInertia(fn ($assert) => $assert
                ->component('Employees/index')
                ->has('employees', 3)
            );
    }

    public function test_user_can_create_employee()
    {
        $employeeData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'position' => 'Software Engineer',
            'department' => 'Engineering',
            'hire_date' => '2025-01-01',
        ];

        $response = $this->post('/employees', $employeeData);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', $employeeData);
    }

    public function test_user_cannot_create_employee_with_invalid_data()
    {
        $response = $this->post('/employees', [
            'first_name' => '', // Required field is empty
            'last_name' => 'Doe',
            'email' => 'invalid-email', // Invalid email format
            'position' => 'Software Engineer',
            'department' => 'Engineering',
            'hire_date' => '2025-01-01',
        ]);

        $response->assertSessionHasErrors(['first_name', 'email']);
    }

    public function test_user_can_update_employee()
    {
        $employee = Employee::factory()->create();
        
        $updatedData = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'position' => 'Senior Engineer',
            'department' => 'Engineering',
            'hire_date' => '2025-02-01',
        ];

        $response = $this->put("/employees/{$employee->id}", $updatedData);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', $updatedData);
    }

    public function test_user_cannot_update_employee_with_invalid_data()
    {
        $employee = Employee::factory()->create();

        $response = $this->put("/employees/{$employee->id}", [
            'first_name' => '', // Required field is empty
            'email' => 'invalid-email', // Invalid email format
        ]);

        $response->assertSessionHasErrors(['first_name', 'email']);
    }

    public function test_user_can_delete_employee()
    {
        $employee = Employee::factory()->create();

        $response = $this->delete("/employees/{$employee->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }

    public function test_user_cannot_create_duplicate_email()
    {
        // Create an employee first
        $existingEmployee = Employee::factory()->create();

        // Try to create another employee with the same email
        $response = $this->post('/employees', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $existingEmployee->email, // Using same email
            'position' => 'Software Engineer',
            'department' => 'Engineering',
            'hire_date' => '2025-01-01',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_user_can_update_employee_without_changing_email()
    {
        $employee = Employee::factory()->create();

        $response = $this->put("/employees/{$employee->id}", [
            'first_name' => 'Updated Name',
            'last_name' => $employee->last_name,
            'email' => $employee->email, // Same email
            'position' => $employee->position,
            'department' => $employee->department,
            'hire_date' => $employee->hire_date,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', ['first_name' => 'Updated Name']);
    }
}
