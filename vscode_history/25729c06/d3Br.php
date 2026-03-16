<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;

Route::get('/', function () {
    return view('welcome');
});

// Routes pour les secteurs
Route::resource('sectors', SectorController::class);

use App\Http\Controllers\SectorController;

Route::get('/sector/create', [SectorController::class, 'create'])->name('sectors.create');
Route::post('/sector', [SectorController::class, 'store'])->name('sectors.store');