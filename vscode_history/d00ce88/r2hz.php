<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    use HasFactory;

    protected $table = 'formateurs';
    protected $primaryKey = 'id_formateur';
    public $timestamps = false;

    // --- زِيـد هـاد الـسّـطـر ضـروري ---
    protected $fillable = [
        'matricule', 'nom', 'prenom', 'type_contrat', 'mh_statutaire', 'nbr_semaines', 'metier', 'mdp_defaut'
    ];
}