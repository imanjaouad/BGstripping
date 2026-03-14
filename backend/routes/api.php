<?php

use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\CasementController;
// use App\Http\Controllers\MachineController;
use App\Http\Controllers\PoussageController;
use Illuminate\Support\Facades\Route;

// ─── Machines ─────────────────────────────────────────────────────────────────
// Route::get('/machines', [MachineController::class , 'index']);
// Route::post('/machines', [MachineController::class , 'store']);

// ─── Poussages ────────────────────────────────────────────────────────────────
Route::get('/poussages', [PoussageController::class , 'index']);
Route::post('/poussages', [PoussageController::class , 'store']);
Route::put('/poussages/{poussage}', [PoussageController::class , 'update']);
Route::delete('/poussages/{poussage}', [PoussageController::class , 'destroy']);

// ─── Casements ────────────────────────────────────────────────────────────────
// Route::get('/casements', [CasementController::class , 'index']);
// Route::post('/casements', [CasementController::class , 'store']);
// Route::put('/casements/{casement}', [CasementController::class , 'update']);
// Route::delete('/casements/{casement}', [CasementController::class , 'destroy']);

// ─── Routes publiques ─────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class , 'login']);

// ─── Routes protégées (Sanctum) ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/me', [AuthController::class , 'me']);
});