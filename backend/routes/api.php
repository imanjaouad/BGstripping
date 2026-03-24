<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CasementController;
use App\Http\Controllers\PoussageController;
use App\Http\Controllers\TransportJournalierController;

// ─── Routes publiques ─────────────────────────────
Route::post('/login', [AuthController::class , 'login']);


// ─── Routes protégées (Sanctum) ───────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/me', [AuthController::class , 'me']);

    Route::get('/users',[UserController::class,'index']);
    Route::post('/users',[UserController::class,'store']);
    Route::put('/users/{id}',[UserController::class,'update']);
    Route::delete('/users/{id}',[UserController::class,'destroy']);

});

// ─── Poussages ────────────────────────────────────
Route::get('/poussages', [PoussageController::class , 'index']);
Route::post('/poussages', [PoussageController::class , 'store']);
Route::put('/poussages/{poussage}', [PoussageController::class , 'update']);
Route::delete('/poussages/{poussage}', [PoussageController::class , 'destroy']);

// ─── Casements ────────────────────────────────────

// ── Routes statiques (déclarées avant {id}) ──────────────────────────────────
Route::get('/casements/stats/monthly', [CasementController::class, 'monthly']);
Route::get('/casements/stats',         [CasementController::class, 'stats']);
Route::get('/casements/panneaux',      [CasementController::class, 'panneaux']);
Route::get('/casements/conducteurs',   [CasementController::class, 'conducteurs']);

// ── CRUD standard ─────────────────────────────────────────────────────────────
Route::get('/casements',           [CasementController::class, 'index']);
Route::post('/casements',          [CasementController::class, 'store']);
Route::get('/casements/{casement}',    [CasementController::class, 'show']);
Route::put('/casements/{casement}',    [CasementController::class, 'update']);
Route::delete('/casements/{casement}', [CasementController::class, 'destroy']);

// ── Vider tout (avec protection X-Confirm-Delete) ─────────────────────────────
Route::delete('/casements', [CasementController::class, 'destroyAll']);

// ─── Transport Journaliers ────────────────────────
Route::get('/transport-journaliers', [TransportJournalierController::class , 'index']);
Route::post('/transport-journaliers', [TransportJournalierController::class , 'store']);
Route::put('/transport-journaliers/{transportJournalier}', [TransportJournalierController::class , 'update']);
Route::delete('/transport-journaliers/{transportJournalier}', [TransportJournalierController::class , 'destroy']);