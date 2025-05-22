<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PresenceSessionController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('courses/create', function () {
        return Inertia::render('courses/create');
    })->name('courses.index');

    Route::get('/students', [UserController::class, 'students'])->middleware(['professor'])->name('students.index');

    Route::post('courses/create', [CourseController::class, 'store'])->middleware(['professor']);

    Route::get('/courses', [CourseController::class, 'index'])->middleware(['professor'])->name('courses.index');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->middleware(['professor'])->name('courses.show');

    // Route::post('/presence-sessions', [PresenceSessionController::class, 'store'])->middleware(['professor'])->name('presence-sessions.store');

    Route::post('/courses/generate-token', [CourseController::class, 'generateToken'])->middleware(['professor'])->name('courses.generate-token');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
