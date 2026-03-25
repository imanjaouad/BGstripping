<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model {
    protected $table = 'seances';
    protected $primaryKey = 'id_seance';
    public $timestamps = false;

    // Khassna n3ayto 3la relations li fihom
    public function affectation() {
        return $this->belongsTo(Affectation::class, 'id_affectation');
    }
    public function salle() {
        return $this->belongsTo(\App\Models\Salle::class, 'id_salle');
    }
}