<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poussages', function (Blueprint $table) {
            $table->id();
            $table->date('operation_date');
            $table->string('panneau');
            $table->string('tranchee');
            $table->string('niveau');
            $table->decimal('saute', 12, 2);
            $table->decimal('profondeur', 12, 2);
            $table->string('equipement');
            $table->string('conducteur');
            $table->string('matricule');
            $table->unsignedBigInteger('compteur_debut');
            $table->unsignedBigInteger('compteur_fin');
            $table->string('etat_machine');
            $table->string('type_arret')->nullable();
            $table->date('arret_debut')->nullable();
            $table->date('arret_fin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poussages');
    }
};
