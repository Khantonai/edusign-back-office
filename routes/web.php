<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\PresenceController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/api/courses/{id}', action: [CourseController::class, 'showJson'])->middleware(['professor']);


    Route::get('courses', [CourseController::class, 'index'])->name('courses');
    
    Route::post('/presence/prof-sign', [PresenceController::class, 'profMark']);
    Route::post('/presence/revoke', [PresenceController::class, 'revoke']);

    Route::get('courses/create', function () {
        return Inertia::render('courses/create');
    })->name('courses.index');

    Route::get('/students', [UserController::class, 'students'])->middleware(['professor'])->name('students.index');

    Route::post('courses/create', [CourseController::class, 'store'])->middleware(['professor']);

    Route::get('/courses/{course}', [CourseController::class, 'show'])->middleware(['professor'])->name('courses.show');


    Route::post('/courses/generate-token', action: [CourseController::class, 'generateToken'])->middleware(['professor'])->name('courses.generate-token');

    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware(['professor'])->name('courses.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
