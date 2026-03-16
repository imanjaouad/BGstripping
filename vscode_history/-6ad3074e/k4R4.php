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
    Schema::create('classes', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // السمية: مثلا "A" أو "1"
        $table->integer('capacite')->default(30); // شحال كيهز القسم
        
        // هنا كنقولو للباز: هاد القسم راه تابع لواحد Niveau
        $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
