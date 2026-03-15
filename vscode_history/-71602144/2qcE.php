<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Engin extends Model
{
    protected $fillable = ['code_parc', 'type_engin', 'modele', 'capacite_godet'];

    public function rapports() {
        return $this->hasMany(RapportProduction::class);
    }
}
