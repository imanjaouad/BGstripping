<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model {
    protected $table = 'groupes';
    protected $primaryKey = 'id_groupe';
    public $timestamps = false;

    // الحقول اللي Laravel مسموح ليه يعمرهم ديناميكياً
    protected $fillable = [
        'code_groupe', 'id_filiere', 'annee_formation', 
        'nbr_semaines', 'mh_hebdo', 'mh_annuelle', 
        'statut', 'id_proprietaire'
    ];

    // علاقة ديناميكية مع الشعبة (Filiere)
    public function filiere() {
        return $this->belongsTo(Filiere::class, 'id_filiere');
    }
}