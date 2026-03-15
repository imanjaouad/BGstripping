<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $fillable = ['libelle_poste', 'heure_debut', 'heure_fin'];

    public function rapports() {
        return $this->hasMany(RapportProduction::class);
    }
}