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
    Schema::create('enseignants', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // مربوط بكونط User
        $table->string('matricule')->unique(); // رقم التأجير
        $table->string('specialite'); // التخصص (ماط، فرنسية...)
        $table->date('date_embauche'); // تاريخ التشغيل
        $table->decimal('salaire', 8, 2)->nullable(); // الصالير
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignants');
    }
};
