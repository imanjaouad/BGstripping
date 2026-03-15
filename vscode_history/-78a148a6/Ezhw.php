<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Middleware\RoleMiddleware;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';

Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');




// Routes protégées par rôle
Route::get('/admin', fn() => "Admin Dashboard")->middleware(['auth', RoleMiddleware::class.':admin,finance,user,director']);
Route::get('/finance', fn() => "Finance Dashboard")->middleware(['auth', RoleMiddleware::class.':finance']);
Route::get('/director', fn() => "Director Dashboard")->middleware(['auth', RoleMiddleware::class.':director']);
Route::get('/stats', fn() => "Stats Dashboard")->middleware(['auth', RoleMiddleware::class.':user,finance']);