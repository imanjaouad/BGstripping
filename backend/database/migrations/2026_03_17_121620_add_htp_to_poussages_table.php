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
        Schema::table('poussages', function (Blueprint $table) {
            $table->decimal('HTP', 8, 2)->nullable()->after('heure_fin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->dropColumn('HTP');
        });
    }
};
