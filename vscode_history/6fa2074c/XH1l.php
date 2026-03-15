<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Parametre extends Model {
    protected $table = 'parametres';
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'efp_name', 'login_admin', 'password_admin', 'toolbar_color', 
        'entete_type', 'heures_sup', 'surveillant_login', 'surveillant_pass', 
        'impression_annee', 'pied_groupe_nb', 'pied_groupe_gauche', 
        'pied_groupe_milieu', 'pied_groupe_droit'
    ];
}