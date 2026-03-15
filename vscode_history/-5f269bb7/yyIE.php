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

        $table->id(); // بدل integer('id')

        $table->string('first_name'); // بلا espace
        $table->string('last_name');
        $table->integer('age');

        $table->unsignedBigInteger('school_id');
        $table->foreign('school_id')->references('id')->on('schools');

        $table->unsignedBigInteger('sector_id');
        $table->foreign('sector_id')->references('id')->on('sectors');

        $table->timestamps();
    });

    protected $fillable =[
        'first_name',
        'last_name',
        'age',
        'school_id',
        'sector_id',

    ];
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
