<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;

Route::get('/', function () {
    return view('welcome');
});


Route::ressource('sectors',SectorController::class);

