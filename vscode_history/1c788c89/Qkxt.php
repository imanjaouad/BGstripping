<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arret extends Model
{
    protected $fillable = ['rapport_production_id', 'type_arret_id', 'heure_debut', 'heure_fin', 'commentaire'];

    public function rapport() {
        return $this->belongsTo(RapportProduction::class);
    }

    public function type() {
        return $this->belongsTo(TypeArret::class, 'type_arret_id');
    }
}