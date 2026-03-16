<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;



Route::get('/users/{id}', function($id) {
    return "the selected user is : " . $id;
});


Route::get('/profile/{id}', function ($id) {
    $user = User::findOrFail($id);
    return view('profile', compact('user'));
});



Route::fallback(function () {
    return '404';
});
