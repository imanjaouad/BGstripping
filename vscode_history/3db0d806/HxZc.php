<?php

use Illuminate\Support\Facades\Route;

Route::match(['get','post'],'/greeting', function () {
    return "Hello world";
});
