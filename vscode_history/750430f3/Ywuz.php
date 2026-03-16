<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    protected $fillable =[
        'name',
        'email',
        'password',
    ];
    public function school(){

   
        return $this->belongsTo(School::class);
}
}
