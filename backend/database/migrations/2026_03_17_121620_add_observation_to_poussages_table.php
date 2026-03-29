<?php



use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
      Schema::table('poussages', function (Blueprint $table) {
    $table->text('observation')->nullable();
});
    }

    public function down(): void
    {
        Schema::table('poussages', function (Blueprint $table) {

            $table->dropColumn('HTP');
            $table->dropColumn('observation');
        });
    }
};