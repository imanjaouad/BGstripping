<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'masshoraire',
        'id_'
    ];
    public function Module(){

   
        return $this->belongsTo(Student::class);
}

public function Module(){

   
        return $this->belongsTo(Student::class);
}

}


