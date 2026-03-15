<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\StudentController;



Route::get('/', function () {
    return view('welcome');
});


Route::resource('sectors',SectorController::class);
Route::resource('schools',SchoolController::class);
Route::resource('students',StudentController::class);




