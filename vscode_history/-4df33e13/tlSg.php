<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\SchoolController;



Route::get('/', function () {
    return view('welcome');
});


Route::resource('sectors',SectorController::class);
Route::resource('schools',SchoolController::class);


