<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->time('arret_heure_debut')->nullable()->after('type_arret');
            $table->time('arret_heure_fin')->nullable()->after('arret_heure_debut');
        });
    }

    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->dropColumn(['arret_heure_debut', 'arret_heure_fin']);
        });
    }
};
