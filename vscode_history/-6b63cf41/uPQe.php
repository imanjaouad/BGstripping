<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

public function up()
{
    Schema::create('niveaux', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // السمية: مثلا "الأول ابتدائي"
        $table->enum('cycle', ['maternelle', 'primaire', 'college', 'lycee']); // السلك
        $table->text('description')->nullable(); // وصف اختياري
        $table->timestamps();
    });
}