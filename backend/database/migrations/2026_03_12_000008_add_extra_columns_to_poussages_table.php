<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->decimal('volume_sote', 12, 2)->nullable()->after('profondeur');
            $table->time('heure_debut')->nullable()->after('compteur_fin');
            $table->time('heure_fin')->nullable()->after('heure_debut');
            $table->decimal('temps', 8, 2)->nullable()->after('heure_fin');
            $table->string('poste')->nullable()->after('temps');
            $table->json('equipements_json')->nullable()->after('equipement');
        });
    }

    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->dropColumn([
                'volume_sote',
                'heure_debut',
                'heure_fin',
                'temps',
                'poste',
                'equipements_json',
            ]);
        });
    }
};
