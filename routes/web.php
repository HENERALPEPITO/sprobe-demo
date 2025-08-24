<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReviewTemplateController;
use App\Http\Controllers\EmployeeController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Employee routes
    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::put('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');

    // Review template routes
    Route::get('review-templates', [ReviewTemplateController::class, 'index'])->name('review-templates.index');
    Route::post('review-templates', [ReviewTemplateController::class, 'store'])->name('review-templates.store');
    Route::put('review-templates/{reviewTemplate}', [ReviewTemplateController::class, 'update'])->name('review-templates.update');
    Route::delete('review-templates/{reviewTemplate}', [ReviewTemplateController::class, 'destroy'])->name('review-templates.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
