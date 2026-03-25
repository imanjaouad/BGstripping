<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;

// Page d'accueil
Route::get('/', function () {
    return view('welcome');
});

// Routes pour les secteurs (dossier "sectors")
Route::get('/sectors/create', [SectorController::class, 'create'])->name('sectors.create'); // afficher formulaire
Route::post('/sectors', [SectorController::class, 'store'])->name('sectors.store');         // enregistrer formulaire

Route::delete('/sectors/{id}', [App\Http\Controllers\SectorController::class, 'destroy'])->name('sectors.destroy');

Route::get('/sectors', [SectorController::class, 'index'])->name('sectors.index');
