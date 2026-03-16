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
        
        // جرب هاد السطر بهاد الطريقة:
        $table->unsignedBigInteger('rapport_id'); 
        $table->foreign('rapport_id')->references('id')->on('rapport_productions')->onDelete('cascade');

        // الربط مع نوع التوقف
        $table->foreignId('type_arret_id')->constrained('type_arrets');
        
        $table->time('heure_debut');
        $table->time('heure_fin');
        $table->text('description')->nullable();
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
