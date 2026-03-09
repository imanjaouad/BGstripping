<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        $now = now();
        DB::table('machines')->insert([
            ['name' => 'D11', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'D10', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pelle 1', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pelle 2', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pelle 3', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Chargeuse', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bulldozer', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
