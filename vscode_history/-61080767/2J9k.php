<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehiculeController;
Route::get('/', function () {
    return view('welcome');
});

Route::resource('vehicules', VehiculeController::class);