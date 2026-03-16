<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\IstaController; // <-- Manensawch had ligne

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// === HADO HOMA LES ROUTES DYALNA ===
Route::get('/formateurs', [IstaController::class, 'getFormateurs']);
Route::get('/groupes', [IstaController::class, 'getGroupes']);
Route::get('/affectations', [IstaController::class, 'getAffectations']);

use App\Models\Module; // Zid hadi lfou9 m3a uses

Route::get('/modules', [IstaController::class, 'getModules']);
Route::post('/affectations', [IstaController::class, 'storeAffectation']);

Route::put('/affectations/{id}', [IstaController::class, 'updateAffectation']);
Route::delete('/affectations/{id}', [IstaController::class, 'deleteAffectation']);

Route::get('/stats', [IstaController::class, 'getStats']);

Route::get('/salles', [IstaController::class, 'getSalles']);
Route::post('/salles', [IstaController::class, 'storeSalle']);
Route::delete('/salles/{id}', [IstaController::class, 'deleteSalle']);

// Route dyal Drag & Drop
Route::post('/kanban-drop', [IstaController::class, 'dropAffectation']);

Route::get('/emploi', [IstaController::class, 'getEmploi']);

Route::post('/emploi/seance', [IstaController::class, 'storeSeance']);

Route::put('/emploi/seance/{id}', [IstaController::class, 'updateSeance']);
Route::delete('/emploi/seance/{id}', [IstaController::class, 'deleteSeance']);

Route::post('/formateurs', [IstaController::class, 'storeFormateur']);
Route::put('/formateurs/{id}', [IstaController::class, 'updateFormateur']);
Route::delete('/formateurs/{id}', [IstaController::class, 'deleteFormateur']);

Route::get('/avancement', [IstaController::class, 'getAvancement']);

Route::delete('/groupes/{id}', [IstaController::class, 'deleteGroupe']);

Route::post('/salles', [IstaController::class, 'storeSalle']);
Route::delete('/salles/{id}', [IstaController::class, 'deleteSalle']);

Route::get('/settings', [IstaController::class, 'getSettings']);
Route::post('/settings', [IstaController::class, 'updateSettings']);

Route::post('/login', [IstaController::class, 'login']);

Route::post('/groupes', [IstaController::class, 'storeGroupe']);

