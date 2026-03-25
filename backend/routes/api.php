<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CasementController;
use App\Http\Controllers\PoussageController;
use App\Http\Controllers\TransportJournalierController;
use Illuminate\Http\Request;

// ─── Routes publiques ─────────────────────────────
Route::post('/login', [AuthController::class , 'login']);
//Ça renvoie l’utilisateur connecté
Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    return response()->json($request->user());
});
// ─── Routes protégées (Sanctum) ───────────────────
Route::middleware(['auth:sanctum','role:admin,superadmin'])->group(function () {

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
Route::get('/casements', [CasementController::class , 'index']);
Route::post('/casements', [CasementController::class , 'store']);
Route::put('/casements/{casement}', [CasementController::class , 'update']);
Route::delete('/casements/{casement}', [CasementController::class , 'destroy']);

// ─── Transport Journaliers ────────────────────────
Route::get('/transport-journaliers', [TransportJournalierController::class , 'index']);
Route::post('/transport-journaliers', [TransportJournalierController::class , 'store']);
Route::put('/transport-journaliers/{transportJournalier}', [TransportJournalierController::class , 'update']);
Route::delete('/transport-journaliers/{transportJournalier}', [TransportJournalierController::class , 'destroy']);