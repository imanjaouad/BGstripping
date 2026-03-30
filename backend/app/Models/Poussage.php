<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Poussage extends Model
{
    protected $fillable = [
        'operation_date',
        'panneau',
        'tranchee',
        'niveau',
        'saute',
        'profondeur',
        'volume_sote',
        'equipement',
        'equipements_json',
        'machine_id',
        'conducteur',
        'matricule',
       
        'heure_debut',
        'heure_fin',
        'temps',
       
        'etat_machine',
        'type_arret',
        'arret_heure_debut',
        'arret_heure_fin',
    ];

    protected $casts = [
        'operation_date'  => 'date',
        'saute'           => 'decimal:2',
        'profondeur'      => 'decimal:2',
        'volume_sote'     => 'decimal:2',
        'temps'           => 'decimal:2',
        'equipements_json' => 'array',
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}