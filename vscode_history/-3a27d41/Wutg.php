<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;


Route::get('/', function () {
    return view('welcome');
});

// Routes Publiques (Accessibles sans être connecté)
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // On ajoutera les routes des posts ici plus tard
});

