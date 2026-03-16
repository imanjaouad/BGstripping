<?php

use Illuminate\Support\Facades\Route;


Route::get('/users/{id}', function($id) {
    return "the selected user is : " . $id;
});

