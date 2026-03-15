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




Route::get('/finance', function () {
    return "Finance Dashboard";
})->middleware([ 'auth', RoleMiddleware::class.':finance' ]);

Route::get('/admin', function () {
    return "Admin Dashboard";
})->middleware([ 'auth', RoleMiddleware::class.':admin' ]);

Route::get('/director', function () {
    return "Director Dashboard";
})->middleware([ 'auth', RoleMiddleware::class.':director' ]);

Route::get('/stats', function () {
    return "Stats Dashboard";
})->middleware(['auth', RoleMiddleware::class.':user,finance']);