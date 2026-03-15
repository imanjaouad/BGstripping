<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Casement extends Model
{
    protected $fillable = [
        'operation_date',
        'panneau',
        'tranchee',
        'niveau',
        'volume_casse',
        'granulometrie',
        'type_roche',
        'nombre_coups',
        'equipements',
        'conducteur',
        'matricule',
        'heure_debut',
        'heure_fin',
        'temps',
        'poste',
        'etat_machine',
        'type_arret',
        'arret_heure_debut',
        'arret_heure_fin',
    ];

    protected $casts = [
        'operation_date' => 'date',
        'volume_casse'   => 'decimal:2',
        'temps'          => 'decimal:2',
        'nombre_coups'   => 'integer',
        'equipements'    => 'array',
    ];
}
