<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transport_journaliers', function (Blueprint $table) {
            $table->string('panneau')->nullable()->after('volume_decape');
            $table->string('tranchee')->nullable()->after('panneau');
            $table->string('niveau')->nullable()->after('tranchee');
        });
    }

    public function down(): void
    {
        Schema::table('transport_journaliers', function (Blueprint $table) {
            $table->dropColumn(['panneau', 'tranchee', 'niveau']);
        });
    }
};
