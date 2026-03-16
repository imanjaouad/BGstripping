<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('vehicules', function (Blueprint $table) {
        $table->id();
        $table->string('matricule')->unique(); // الترقيم (12345-أ-26)
        $table->integer('capacite'); // شحال كتهز
        $table->string('marque')->nullable(); // نوع الحافلة
        
        // شكون الشيفور المسؤول عليها دابا
        $table->foreignId('chauffeur_id')->nullable()->constrained('chauffeurs');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
