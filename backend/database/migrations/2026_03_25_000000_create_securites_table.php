<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('securites', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'document' ou 'image'
            $table->string('filename'); // Nom d'origine du fichier
            $table->string('path'); // Chemin de stockage (storage/app/public/securite/...)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('securites');
    }
};
