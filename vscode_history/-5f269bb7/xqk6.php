<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->integer('id');
            $table->string('first name');
            $table->string('last name');
            $table->integer('age');
            $table->unsignedBigInteger('uschool_id');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->unsignedBigInteger('sectors_id');
            $table->foreign('sector_id')->references('id')->on('sectors');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
