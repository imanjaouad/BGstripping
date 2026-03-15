<?php

use Illuminate\Support\Facades\Route;

Route::get('/users', function (Request $request) {
    return "Hello world";
});
