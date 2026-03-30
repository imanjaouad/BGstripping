<?php

namespace Database\Seeders;

use App\Models\Casement;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * CasementSeeder — Génère 30 opérations réalistes pour tester l'interface.
 *
 * Équipements disponibles (comme dans INITIAL_EQUIP React) :
 *   7500M1, 7500M2, P&H1, P&H2, 200B1
 *
 * Postes : Matin, Après-midi, Nuit
 * Panneaux : P01 → P06
 */
class CasementSeeder extends Seeder
{
    private array $equipements    = ['7500M1', '7500M2', 'P&H1', 'P&H2', '200B1'];
    private array $postes         = ['1er', '2ème', '3ème'];
    private array $panneaux       = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];
    private array $conducteurs    = [];
    private array $typesArret     = ['Panne mécanique', 'Maintenance préventive', 'Arrêt électrique', 'Attente engin', 'Météo'];

    public function run(): void
    {
        Casement::truncate();

        $records = [];
        $now     = Carbon::now();

        for ($i = 0; $i < 30; $i++) {
            $date       = $now->copy()->subDays(rand(0, 90))->format('Y-m-d');
            $etatMachine = rand(0, 4) > 0 ? 'marche' : 'arret'; // 80% marche

            // Heur de marche 
            $debutH  = rand(6, 7);
            $debutM  = [0, 30][rand(0, 1)];
            $finH    = $debutH + rand(6, 10);
            $temps   = round(($finH * 60 - $debutH * 60 - $debutM) / 60, 2);

            // Arrêt éventuel
            $dureeArret = $etatMachine === 'arret' ? rand(1, 3) + rand(0, 1) * 0.5 : 0;
            $htp        = round(max(0, $temps - $dureeArret), 2);

            // Volume sauté (proportionnel au HTP)
            $volumeSaute = round($htp * rand(60, 120) + rand(-50, 50), 2);

            // KPIs
            $oee = rand(60, 95);
            $tu  = rand(55, 90);
            $td  = rand(70, 98);

            // Équipements (1 à 3 aléatoires)
            $nb      = rand(1, 3);
            $equips  = array_slice($this->equipements, rand(0, count($this->equipements) - $nb), $nb);

            $record = [
                'date'                 => $date,
                'panneau'              => $this->panneaux[rand(0, count($this->panneaux) - 1)],
                'tranchee'             => 'T-' . str_pad(rand(1, 20), 2, '0', STR_PAD_LEFT),
                'niveau'               => rand(1, 5) . 'N',
                'profondeur'           => rand(5, 30) . ' m',
                'volume_saute'         => max(0, $volumeSaute),
                'conducteur'           => $this->conducteurs[rand(0, count($this->conducteurs) - 1)],
                'matricule'            => 'MAT-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT),
                'poste'                => $this->postes[rand(0, count($this->postes) - 1)],
                'equipements'          => $equips,
                'arrets_equipements'   => null,
                'heure_debut_compteur' => sprintf('%02d:%02d', $debutH, $debutM),
                'heure_fin_compteur'   => sprintf('%02d:00',   $finH),
                'temps'                => $temps,
                'htp'                  => $htp,
                'etat_machine'         => $etatMachine,
                'type_arret'           => $etatMachine === 'arret'
                    ? $this->typesArret[rand(0, count($this->typesArret) - 1)]
                    : null,
                'heure_debut_arret'    => null,
                'heure_fin_arret'      => null,
                'oee'                  => $oee,
                'tu'                   => $tu,
                'td'                   => $td,
                'created_at'           => now(),
                'updated_at'           => now(),
            ];

            $records[] = $record;
        }

        // Insérer par batch
        foreach (array_chunk($records, 10) as $chunk) {
            Casement::insert($chunk);
        }

        $this->command->info('✅  30 opérations casement insérées avec succès.');
    }
}
