<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\PoussageController;
use Illuminate\Support\Facades\Route;

Route::get('/machines', [MachineController::class, 'index']);
Route::post('/machines', [MachineController::class, 'store']);

Route::get('/poussages', [PoussageController::class, 'index']);
Route::post('/poussages', [PoussageController::class, 'store']);

// ─── Routes publiques ──────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ─── Routes protégées (Sanctum) ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});