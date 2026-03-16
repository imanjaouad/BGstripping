<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ← ajouter HasFactory ici

    protected $fillable = [
        'username',
        'password',
        'mode_operation',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function getAuthIdentifierName(): string
{
    return 'username';
}
}