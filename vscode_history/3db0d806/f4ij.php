<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/users', function (Request $request) {
    return response()->json([
        'message' => 'Route users fonctionne'
    ]);
});
