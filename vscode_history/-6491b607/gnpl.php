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
        Schema::create('rapport_productions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chantier_id');
            $table->unsignedBigInteger('engin_id');
            $table->unsignedBigInteger('personnel_id');
            $table->unsignedBigInteger('poste_id');
            $table->date('date');
            $table->integer('quantite');
            $table->text('observation')->nullable();
            $table->timestamps();
            $table->string('tranchee')->nullable();
            $table->float('niveau')->nullable();
            $table->foreign('chantier_id')->references('id')->on('chantiers')->onDelete('cascade');
            $table->foreign('engin_id')->references('id')->on('engins')->onDelete('cascade');
            $table->foreign('personnel_id')->references('id')->on('personnels')->onDelete('cascade');
            $table->foreign('poste_id')->references('id')->on('postes')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapport_productions');
    }
};
