<?php

use App\Models\User;

Route::get('/profile/{id}', function ($id) {
    $user = User::findOrFail($id);
    return view('profile', compact('user'));
});

?>

