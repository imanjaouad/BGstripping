<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('poussages', function (Blueprint $table) {

            $table->string('panneau')->nullable()->change();
            $table->string('tranchee')->nullable()->change();
            $table->string('niveau')->nullable()->change();

            $table->decimal('saute',12,2)->nullable()->change();
            $table->decimal('profondeur',12,2)->nullable()->change();
            $table->decimal('volume_sote',12,2)->nullable()->change();

            $table->string('conducteur')->nullable()->change();
            $table->string('matricule')->nullable()->change();

        });
    }

    public function down(): void
    {
        //
    }
};