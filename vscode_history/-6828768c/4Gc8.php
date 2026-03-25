<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model {
    protected $table = 'salles';
    protected $primaryKey = 'id_salle';
    public $timestamps = false;
    protected $fillable = ['nom_local', 'type_local', 'capacite'];
}