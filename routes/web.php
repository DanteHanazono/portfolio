<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/portfolio', [HomeController::class, 'portfolio'])->name('portfolio');
Route::get('/skills', [HomeController::class, 'skills'])->name('skills');
Route::get('/testimonials', [HomeController::class, 'testimonials'])->name('testimonials');

Route::get('/contact', [ContactMessageController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

Route::get('/project/{slug}', [ProjectController::class, 'publicShow'])->name('project.show');
Route::post('/project/{slug}/like', [ProjectController::class, 'like'])->name('project.like');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured'])->name('projects.toggle-featured');
    Route::post('projects/{project}/toggle-published', [ProjectController::class, 'togglePublished'])->name('projects.toggle-published');
    Route::post('projects/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');

    Route::resource('technologies', TechnologyController::class);
    Route::post('technologies/{technology}/toggle-featured', [TechnologyController::class, 'toggleFeatured'])->name('technologies.toggle-featured');
    Route::post('technologies/reorder', [TechnologyController::class, 'reorder'])->name('technologies.reorder');

    Route::resource('experiences', ExperienceController::class);
    Route::post('experiences/reorder', [ExperienceController::class, 'reorder'])->name('experiences.reorder');

    Route::resource('education', EducationController::class);
    Route::post('education/reorder', [EducationController::class, 'reorder'])->name('education.reorder');
});

require __DIR__.'/settings.php';
