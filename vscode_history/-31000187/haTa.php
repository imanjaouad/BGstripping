<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('stagiaire.index');
});

Route::get('stagiaire/create', function () {
    return view('stagiaire.create');
});

Route::post('stagiaire/store', [StagiaireController::class, 'store'])->name('stagiaire.store');







