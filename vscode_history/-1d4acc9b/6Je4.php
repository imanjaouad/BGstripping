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
    Schema::create('niveaux', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // السمية: مثلا "الأول ابتدائي"
        $table->enum('cycle', ['maternelle', 'primaire', 'college', 'lycee']); // السلك
        $table->text('description')->nullable(); // وصف اختياري
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('niveaux');
    }
};
