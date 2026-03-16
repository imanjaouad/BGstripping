<?php

use Illuminate\Support\Facades\Route;
App\Http\Controllers\SectorController;

Route::get('/', function () {
    return view('welcome');
});


Route::ressource('sectors',SectorController::class);

