<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chantier extends Model
{
    return $this->hasMany(RapportProduction::class);
}
