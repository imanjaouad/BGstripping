<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;
use App\Models\Sector;

// Page d'accueil
Route::get('/', function () {
    $sectors = Sector::all(); 
    
    return view('welcome', compact('sectors'));
});

Route::resource('sectors', SectorController::class);
