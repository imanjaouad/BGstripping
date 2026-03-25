<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Securite extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'filename',
        'path',
    ];

    /**
     * Obtenir l'URL complète du fichier pour l'affichage (image ou téléchargement).
     */
    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }
}
