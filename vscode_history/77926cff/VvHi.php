<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChantierController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/mode-poussage', [RapportController::class, 'poussage'])->name('poussage');
// رابط باش نشوفو لستة ديال الأوراش
Route::get('/chantiers', [ChantierController::class, 'index'])->name('chantiers.index');

// رابط الفورمير فين غاندخلو ورش جديد
Route::get('/chantiers/create', [ChantierController::class, 'create'])->name('chantiers.create');

// رابط باش نسجلو الداتا فالداتابيز (POST)
Route::post('/chantiers', [ChantierController::class, 'store'])->name('chantiers.store');