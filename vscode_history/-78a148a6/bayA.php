Route::get('/admin', function () {
    return "Admin Dashboard";
})->middleware(['auth', 'role:admin']);

Route::get('/finance', function () {
    return "Finance Dashboard";
})->middleware(['auth', 'role:finance']);

Route::get('/director', function () {
    return "Director Dashboard";
})->middleware(['auth', 'role:director']);

// Exemple route accessible par plusieurs rôles
Route::get('/stats', function () {
    return "Stats Dashboard";
})->middleware(['auth', 'role:user,finance']);