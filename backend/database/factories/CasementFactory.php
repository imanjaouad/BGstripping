<?php

namespace Database\Factories;

use App\Models\Casement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * CasementFactory — Génère des enregistrements Casement pour les tests.
 */
class CasementFactory extends Factory
{
    protected $model = Casement::class;

    private array $equipements = ['7500M1', '7500M2', 'P&H1', 'P&H2', '200B1'];
    private array $panneaux    = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];
    private array $postes      = ['Matin', 'Après-midi', 'Nuit'];

    public function definition(): array
    {
        $debutH = $this->faker->numberBetween(6, 7);
        $finH   = $debutH + $this->faker->numberBetween(6, 10);
        $temps  = round(($finH - $debutH), 2);
        $htp    = round($temps - $this->faker->randomFloat(1, 0, 1.5), 2);
        $etat   = $this->faker->boolean(80) ? 'marche' : 'arret';

        return [
            'date'                 => $this->faker->dateTimeBetween('-90 days')->format('Y-m-d'),
            'panneau'              => $this->faker->randomElement($this->panneaux),
            'tranchee'             => 'T-' . str_pad($this->faker->numberBetween(1, 20), 2, '0', STR_PAD_LEFT),
            'niveau'               => $this->faker->numberBetween(1, 5) . 'N',
            'profondeur'           => $this->faker->numberBetween(5, 30) . ' m',
            'volume_saute'         => $this->faker->randomFloat(2, 200, 1200),
            'conducteur'           => $this->faker->name(),
            'matricule'            => 'MAT-' . str_pad($this->faker->numberBetween(100, 999), 3, '0', STR_PAD_LEFT),
            'poste'                => $this->faker->randomElement($this->postes),
            'equipements'          => $this->faker->randomElements($this->equipements, $this->faker->numberBetween(1, 3)),
            'arrets_equipements'   => null,
            'heure_debut_compteur' => sprintf('%02d:00', $debutH),
            'heure_fin_compteur'   => sprintf('%02d:00', $finH),
            'temps'                => $temps,
            'htp'                  => max(0, $htp),
            'etat_machine'         => $etat,
            'type_arret'           => $etat === 'arret' ? $this->faker->randomElement(['Panne mécanique', 'Maintenance', 'Arrêt électrique']) : null,
            'heure_debut_arret'    => null,
            'heure_fin_arret'      => null,
            'oee'                  => $this->faker->randomFloat(1, 60, 95),
            'tu'                   => $this->faker->randomFloat(1, 55, 90),
            'td'                   => $this->faker->randomFloat(1, 70, 98),
        ];
    }

    // ── States ────────────────────────────────────────────────────────────────

    public function marche(): static
    {
        return $this->state(['etat_machine' => 'marche', 'type_arret' => null]);
    }

    public function arret(): static
    {
        return $this->state([
            'etat_machine' => 'arret',
            'type_arret'   => $this->faker->randomElement(['Panne mécanique', 'Maintenance', 'Arrêt électrique']),
        ]);
    }
}
