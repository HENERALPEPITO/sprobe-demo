<?php

use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('user can upload file for employee', function () {
    Storage::fake('private');
    
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    
    $file = UploadedFile::fake()->create('document.pdf', 100);
    
    $response = $this
        ->actingAs($user)
        ->post(route('files.store'), [
            'file' => $file,
            'employee_id' => $employee->id
        ]);
        
    $response->assertRedirect();
    $response->assertSessionHas('success');
    
    Storage::disk('private')->assertExists('employee-files/' . $file->hashName());
});

test('user cannot upload file larger than 10MB', function () {
    Storage::fake('private');
    
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    
    $file = UploadedFile::fake()->create('large-document.pdf', 11 * 1024);
    
    $response = $this
        ->actingAs($user)
        ->post(route('files.store'), [
            'file' => $file,
            'employee_id' => $employee->id
        ]);
        
    $response->assertInvalid(['file']);
    
    Storage::disk('private')->assertMissing('employee-files/' . $file->hashName());
});

test('user can download uploaded file', function () {
    Storage::fake('private');
    
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $file = UploadedFile::fake()->create('document.pdf', 100);
    
    $response = $this
        ->actingAs($user)
        ->post(route('files.store'), [
            'file' => $file,
            'employee_id' => $employee->id
        ]);
        
    $fileUpload = $employee->files()->first();
    
    $response = $this
        ->actingAs($user)
        ->get(route('files.download', $fileUpload));
        
    $response->assertStatus(200);
    $response->assertHeader('content-type', 'application/pdf');
});
