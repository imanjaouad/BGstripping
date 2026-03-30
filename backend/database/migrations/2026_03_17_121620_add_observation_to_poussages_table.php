<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::table('poussages', function (Blueprint $table) {
    if (!Schema::hasColumn('poussages', 'HTP')) {
        $table->decimal('HTP', 8, 2)->nullable();
    }

    if (!Schema::hasColumn('poussages', 'observation')) {
        $table->text('observation')->nullable();
    }
});
    }

    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {
            $table->dropColumn(['HTP', 'observation']);
        });
    }
};