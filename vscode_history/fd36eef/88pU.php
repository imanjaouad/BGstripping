<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeArret extends Model
{
    protected $fillable = ['libelle_arret', 'categorie'];

    public function arrets() {
        return $this->hasMany(Arret::class);
    }
}
