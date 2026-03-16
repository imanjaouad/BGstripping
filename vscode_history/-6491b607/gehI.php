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
        
        // كنكريو الحقل أولاً ونعطيوه النوع الدقيق UnsignedBigInteger
        $table->unsignedBigInteger('rapport_id'); 
        $table->unsignedBigInteger('type_arret_id');

        $table->time('heure_debut');
        $table->time('heure_fin');
        $table->text('description')->nullable();
        $table->timestamps();

        // دابا كنديرو الربط يدوياً باش نأكدوا لـ MySQL السّميات
        $table->foreign('rapport_id')
              ->references('id')
              ->on('rapport_productions')
              ->onDelete('cascade');

        $table->foreign('type_arret_id')
              ->references('id')
              ->on('type_arrets')
              ->onDelete('cascade');
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
