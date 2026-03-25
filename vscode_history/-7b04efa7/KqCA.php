<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('paiements', function (Blueprint $table) {
        $table->id();
        // شكون التلميذ اللي تخلص عليه؟
        $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
        
        $table->decimal('montant', 10, 2); // شحال خلص (بالدرهم)
        $table->date('date_paiement'); // فوقاش
        $table->string('mois_concerne')->nullable(); // واش شهر 9 ولا 10...
        $table->enum('statut', ['paye', 'impaye', 'partiel'])->default('paye'); // الحالة
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
