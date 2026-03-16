<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;

Route::get('/', function () {
    return view('welcome');
});

// Dashboard général
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Contact routes
Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'send'])->name('contact.send');

// Routes protégées par rôle
Route::get('/admin', fn() => "Admin Dashboard")->middleware(['auth', RoleMiddleware::class.':admin,finance,user,director']);
Route::get('/finance', fn() => "Finance Dashboard")->middleware(['auth', RoleMiddleware::class.':finance']);
Route::get('/director', fn() => "Director Dashboard")->middleware(['auth', RoleMiddleware::class.':director']);
Route::get('/stats', fn() => "Stats Dashboard")->middleware(['auth', RoleMiddleware::class.':user,finance']);