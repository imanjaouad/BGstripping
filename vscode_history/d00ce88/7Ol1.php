<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    use HasFactory;
    protected $table = 'formateurs'; // Smya d table f SQL
    protected $primaryKey = 'id_formateur'; // Smya d l'ID
    public $timestamps = false; // Ma3ndnach created_at f SQL
}