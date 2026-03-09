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
        'equipement',
        'machine_id',
        'conducteur',
        'matricule',
        'compteur_debut',
        'compteur_fin',
        'etat_machine',
        'type_arret',
        'arret_heure_debut',
        'arret_heure_fin',
    ];

    protected $casts = [
        'operation_date' => 'date',
        'saute' => 'decimal:2',
        'profondeur' => 'decimal:2',
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
