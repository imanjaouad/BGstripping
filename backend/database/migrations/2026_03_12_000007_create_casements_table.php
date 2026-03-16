<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('casements', function (Blueprint $table) {
            $table->id();
            $table->date('operation_date');
            $table->string('panneau')->nullable();
            $table->string('tranchee')->nullable();
            $table->string('niveau')->nullable();
            $table->decimal('volume_casse', 12, 2)->default(0);
            $table->string('granulometrie')->nullable();
            $table->string('type_roche')->nullable();
            $table->unsignedInteger('nombre_coups')->default(0);
            $table->json('equipements')->nullable();
            $table->string('conducteur')->nullable();
            $table->string('matricule')->nullable();
            $table->time('heure_debut')->nullable();
            $table->time('heure_fin')->nullable();
            $table->decimal('temps', 8, 2)->default(0);
            $table->string('poste')->nullable();
            $table->string('etat_machine')->default('en_marche');
            $table->string('type_arret')->nullable();
            $table->time('arret_heure_debut')->nullable();
            $table->time('arret_heure_fin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('casements');
    }
};
