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
    Schema::create('eleves', function (Blueprint $table) {
        $table->id();
        $table->string('massar_id')->unique(); // رقم مسار
        $table->string('nom');
        $table->string('prenom');
        $table->date('date_naissance');
        $table->enum('genre', ['male', 'female']);
        $table->string('photo')->nullable(); // تصويرة

        // العلاقات (Relations) - ركز هنا مزيان
        $table->foreignId('tuteur_id')->constrained('tuteurs')->onDelete('cascade'); // ولد من؟
        $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade'); // فاشمن قسم؟
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eleves');
    }
};
