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
    Schema::create('matieres', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // اسم المادة
        $table->integer('coefficient')->default(1); // المعامل
        // المادة تابعة لمستوى معين (مثلا الرياضيات ديال السادس ماشي هي ديال الخامس)
        $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
};
