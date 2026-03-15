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
    Schema::create('trajets', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); // مثلا: خط المدينة القديمة
        $table->string('heure_depart_matin')->nullable(); // 07:30
        $table->string('heure_depart_soir')->nullable(); // 16:30
        
        // الحافلة المكلفة بهاد الخط
        $table->foreignId('vehicule_id')->nullable()->constrained('vehicules');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trajets');
    }
};
