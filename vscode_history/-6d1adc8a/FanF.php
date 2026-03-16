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
    Schema::create('notes', function (Blueprint $table) {
        $table->id();
        $table->float('valeur'); // النقطة (مثلا 15.5)
        $table->enum('type', ['controle', 'examen', 'tp'])->default('controle'); // نوع الفرض
        
        // النقطة ديال من؟ وفاشمن مادة؟
        $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
        $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
