<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model {
    protected $table = 'formateurs';
    protected $primaryKey = 'id_formateur';
    public $timestamps = false;

    // هادو هما الحقول اللي مسموح ليهم يتسجلو من React
    protected $fillable = [
        'matricule', 'nom', 'prenom', 'type_contrat', 
        'mh_statutaire', 'nbr_semaines', 'metier', 'mdp_defaut'
    ];
}