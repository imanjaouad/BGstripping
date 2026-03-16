<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $table = 'groupes';
    protected $primaryKey = 'id_groupe';
    public $timestamps = false;
}