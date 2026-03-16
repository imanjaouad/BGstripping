<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->string('panneau')->nullable()->change();
            $table->string('tranchee')->nullable()->change();
            $table->string('niveau')->nullable()->change();
            $table->string('equipement')->nullable()->change();
            $table->string('conducteur')->nullable()->change();
            $table->string('matricule')->nullable()->change();
            $table->string('etat_machine')->nullable()->change();
            $table->unsignedBigInteger('compteur_debut')->nullable()->change();
            $table->unsignedBigInteger('compteur_fin')->nullable()->change();
            $table->string('type_arret')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->string('panneau')->nullable(false)->change();
            $table->string('tranchee')->nullable(false)->change();
            $table->string('niveau')->nullable(false)->change();
            $table->string('equipement')->nullable(false)->change();
            $table->string('conducteur')->nullable(false)->change();
            $table->string('matricule')->nullable(false)->change();
            $table->string('etat_machine')->nullable(false)->change();
            $table->unsignedBigInteger('compteur_debut')->nullable(false)->change();
            $table->unsignedBigInteger('compteur_fin')->nullable(false)->change();
            $table->string('type_arret')->nullable(false)->change();
        });
    }
};
