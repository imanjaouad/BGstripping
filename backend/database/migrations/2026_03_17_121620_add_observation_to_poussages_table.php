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

        Schema::table('poussages', function (Blueprint $table) {

            $table->number('HTP')->nullable();
            $table->decimal('observation', 8, 2)->nullable();
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