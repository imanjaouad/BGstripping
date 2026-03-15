<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectorController;
SchoolController

Route::get('/', function () {
    return view('welcome');
});


Route::resource('sectors',SectorController::class);

