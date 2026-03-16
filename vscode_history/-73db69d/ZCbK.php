<?php

use Illuminate\Support\Facades\Route;

// Hada howa l-Code S7ri (Catch-All Route)
// Kaygol l Laravel: Ay haja ktbha l-utilisateur, 3tih la page React.
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');