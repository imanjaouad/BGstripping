<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('action.index');
});

Route::get('stagiaire/create',function(){
    return view('stagiaire.create');
});




