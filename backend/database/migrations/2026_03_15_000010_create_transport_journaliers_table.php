<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transport_journaliers', function (Blueprint $table) {
            $table->id();
            $table->date('operation_date');
            $table->string('entreprise');       // 'procaneq' | 'transwine'
            $table->string('type_moyen');        // 'petits'  | 'grands'
            $table->integer('nombre_voyages')->default(0);
            $table->decimal('capacite_camion', 8, 2)->default(0);
            $table->decimal('volume_decape', 12, 2)->default(0);
            $table->timestamps();

            $table->unique(['operation_date', 'entreprise', 'type_moyen'], 'tj_date_ent_type_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_journaliers');
    }
};
