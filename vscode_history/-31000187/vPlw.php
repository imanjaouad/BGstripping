<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StagiaireController;

Route::get('stagiaire/create', [StagiaireController::class, 'create']);
Route::post('stagiaire/store', [StagiaireController::class, 'store'])->name('stagiaire.store');

Route::get('/', [StagiaireController::class, 'index']);



