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
            $table->foreignId('chantier_id')->constrained();
$table->foreignId('engin_id')->constrained();
$table->foreignId('personnel_id')->constrained();
$table->foreignId('poste_id')->constrained();
$table->date('date_operation');
$table->float('volume_decapé');
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
