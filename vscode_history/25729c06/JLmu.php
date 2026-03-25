<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;

// Page d'accueil
Route::get('/', function () {
    return view('welcome');
});

// Cette ligne seule remplace TOUTES les routes manuelles (index, create, store, destroy, etc.)
Route::resource('sectors', SectorController::class);