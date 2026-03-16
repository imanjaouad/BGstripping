<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('action.index');
});

Route::get('/create',function(){
    return view('action.create');
})

Route::