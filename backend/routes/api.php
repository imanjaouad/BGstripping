<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\SecuriteController;
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

// Routes pour la gestion de la sécurité (documents et images)
Route::prefix('securite')->group(function () {
    Route::get('/', [SecuriteController::class, 'index']);      // Lister les fichiers
    Route::post('/', [SecuriteController::class, 'store']);     // Ajouter un fichier
    Route::delete('/{id}', [SecuriteController::class, 'destroy']); // Supprimer un fichier
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