<?php

use App\Http\Controllers\MachineController;
use App\Http\Controllers\PoussageController;
use Illuminate\Support\Facades\Route;

Route::get('/machines', [MachineController::class, 'index']);
Route::post('/machines', [MachineController::class, 'store']);

Route::get('/poussages', [PoussageController::class, 'index']);
Route::post('/poussages', [PoussageController::class, 'store']);
