<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RapportProduction extends Model
{
    protected $fillable = [
    'date_operation', 'chantier_id', 'engin_id', 'personnel_id', 
    'poste_id', 'volume_decapé', 'compteur_debut', 'compteur_fin',
    'tranchee', 'niveau' // زدت هاد الجوج هنا
];

    // علاقات عكسية (التقرير ينتمي لـ...)
    public function chantier() { return $this->belongsTo(Chantier::class); }
    public function engin() { return $this->belongsTo(Engin::class); }
    public function personnel() { return $this->belongsTo(Personnel::class); }
    public function poste() { return $this->belongsTo(Poste::class); }

    // التقرير الواحد يقدروا يكونوا فيه بزاف ديال التوقفات
    public function arrets() {
        return $this->hasMany(Arret::class, 'rapport_id');
    }
}
