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
    Schema::create('chauffeurs', function (Blueprint $table) {
        $table->id();
        // الشيفور حتى هو User (باش يدخل للتطبيق)
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('permis'); // رقم البيرمي
        $table->string('telephone');
        $table->boolean('disponible')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chauffeurs');
    }
};
