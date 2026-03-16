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
    Schema::create('arrets', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // سمية المحطة
        
        // إحداثيات GPS (مهمة بزاف)
        $table->decimal('latitude', 10, 8); 
        $table->decimal('longitude', 11, 8);
        
        $table->integer('ordre'); // الترتيب (المحطة 1، المحطة 2...)
        
        // تابعة لأي خط؟
        $table->foreignId('trajet_id')->constrained('trajets')->onDelete('cascade');
        
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
