<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    protected $fillable = ['matricule', 'nom_prenom', 'fonction'];

    public function rapports() {
        return $this->hasMany(RapportProduction::class);
    }
}
