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

    $table->decimal('volume_sote', 12, 2)->nullable(); // AJOUT
    $table->decimal('saute', 12, 2);
    $table->decimal('profondeur', 12, 2);

    $table->string('equipement');
    $table->json('equipements_json')->nullable(); // AJOUT

    $table->unsignedBigInteger('machine_id')->nullable(); // AJOUT

    $table->string('conducteur');
    $table->string('matricule');

    $table->time('heure_debut')->nullable(); // AJOUT
    $table->time('heure_fin')->nullable();   // AJOUT
    $table->decimal('temps', 8, 2)->nullable(); // AJOUT

    $table->string('poste')->nullable(); // AJOUT

    $table->string('etat_machine');
    $table->string('type_arret')->nullable();

    $table->time('arret_heure_debut')->nullable(); // AJOUT
    $table->time('arret_heure_fin')->nullable();   // AJOUT

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('poussages');
    }
};
