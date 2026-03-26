<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Structure de la table casements
     *
     * Champs mappés depuis le formulaire React (EMPTY_FORM) :
     *  - Localisation     : date, panneau, tranchee, niveau, profondeur
     *  - Production       : volume_saute
     *  - Personnel        : conducteur, matricule, poste
     *  - Equipements      : equipements (JSON), arrets_equipements (JSON)
     *  - Temps            : heure_debut_compteur, heure_fin_compteur, temps (TB), htp
     *  - Etat machine     : etat_machine, type_arret, heure_debut_arret, heure_fin_arret
     *  - KPIs calculés    : oee, tu, td (stockés depuis le formulaire)
     */
    public function up(): void
    {
        Schema::create('casements', function (Blueprint $table) {
            $table->id();

            // ── 1. Localisation & Identification ──────────────────────────
            $table->date('date');
            $table->string('panneau', 100)->nullable();
            $table->string('tranchee', 100)->nullable();
            $table->string('niveau', 100)->nullable();
            $table->string('profondeur', 100)->nullable();

            // ── 2. Production ─────────────────────────────────────────────
            $table->decimal('volume_saute', 10, 2)->default(0);

            // ── 3. Personnel ──────────────────────────────────────────────
            $table->string('conducteur', 150)->nullable();
            $table->string('matricule', 50)->nullable();
            $table->string('poste', 50)->nullable();

            // ── 4. Équipements ────────────────────────────────────────────
            // Liste des équipements sélectionnés : ["7500M1", "P&H1", ...]
            $table->json('equipements')->nullable();

            // Arrêts par équipement : { "7500M1": { debut, fin, nature, duree }, ... }
            $table->json('arrets_equipements')->nullable();

            // ── 5. Temps ──────────────────────────────────────────────────
            $table->time('heure_debut_compteur')->nullable();
            $table->time('heure_fin_compteur')->nullable();

            // TB = heure_fin - heure_debut (calculé auto côté client, stocké ici)
            $table->decimal('temps', 8, 2)->nullable();

            // HTP = TB - TA (temps de travail productif)
            $table->decimal('htp', 8, 2)->nullable();

            // ── 6. État machine & Arrêts ──────────────────────────────────
            $table->enum('etat_machine', ['marche', 'arret'])->default('marche');
            $table->string('type_arret', 100)->nullable();
            $table->time('heure_debut_arret')->nullable();
            $table->time('heure_fin_arret')->nullable();

            // ── 7. KPIs (calculés par le formulaire) ─────────────────────
            $table->decimal('oee', 5, 2)->nullable();
            $table->decimal('tu', 5, 2)->nullable();
            $table->decimal('td', 5, 2)->nullable();

            $table->timestamps();
            $table->softDeletes();

            // ── Index ─────────────────────────────────────────────────────
            $table->index('date');
            $table->index('panneau');
            $table->index('etat_machine');
            $table->index('conducteur');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('casements');
    }
};
