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
        Schema::create('arrets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapport_production_id')->constrained(); // شمن تقرير وقع فيه هاد التوقف
            $table->foreignId('type_arret_id')->constrained(); // شمن نوع ديال التوقف (Panne, Minage...)
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrets');
    }
};
