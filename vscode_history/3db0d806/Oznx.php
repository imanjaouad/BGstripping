<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::view('/resources/views/helloworld.blade.php', 'helloworld.blade.php');

Route::get('/users/{id}',function($id){
    return "the selected user is :". $id;
})
