<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
   protected $fillable =[
        'first_name',
        'last_name',
        'age',
        'school_id',
        'sector_id',

    ];
   public function school():
        return $this->belongsTo
}


