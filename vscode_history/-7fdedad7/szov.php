<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


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