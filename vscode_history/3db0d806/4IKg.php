<?php

use Illuminate\Support\Facades\Route;

Route::post('/greeting', function () {
    return "Hello world";
});
