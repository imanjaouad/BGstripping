<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chantier extends Model
{
    protected $fillable = ['nom_chantier', 'type_terrain', 'profondeur_cible'];

    // ورش واحد عنده بزاف ديال التقارير
    public function rapports() {
        return $this->hasMany(RapportProduction::class);
    }
}
