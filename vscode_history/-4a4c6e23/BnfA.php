<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use App\Models\Seance; // <--- HADI ZIDHA
class Affectation extends Model
{
    protected $table = 'affectations';
    protected $primaryKey = 'id_affectation';
    public $timestamps = false;

    public function groupe() { return $this->belongsTo(Groupe::class, 'id_groupe'); }
    public function module() { return $this->belongsTo(Module::class, 'id_module'); }
    public function formateur() { return $this->belongsTo(Formateur::class, 'id_formateur'); }
}