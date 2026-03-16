<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $table = 'groupes';
    protected $primaryKey = 'id_groupe';
    public $timestamps = false;

    // --- هـادو هـما الـحقـول الـلي مـسمـوح نـعمـروهـم (Mass Assignment) ---
    protected $fillable = [
        'code_groupe', 'id_filiere', 'annee_formation', 'nbr_semaines', 
        'mh_hebdo', 'mh_annuelle', 'statut', 'fusion_status', 
        'type_formation', 'id_proprietaire'
    ];
}