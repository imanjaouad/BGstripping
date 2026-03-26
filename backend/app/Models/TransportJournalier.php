<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransportJournalier extends Model
{
    use HasFactory;

    protected $table = 'transport_journaliers';

    protected $fillable = [
        'operation_date',
        'entreprise',
        'type_moyen',
        'nombre_voyages',
        'capacite_camion',
        'volume_decape',
<<<<<<< HEAD
        'panneau',
        'tranchee',
        'niveau',
    ];

    protected $casts = [
        'operation_date' => 'date',
        'nombre_voyages' => 'integer',
        'capacite_camion' => 'decimal:2',
        'volume_decape' => 'decimal:2',
=======
    ];

    protected $casts = [
        'operation_date'  => 'date',
        'nombre_voyages'  => 'integer',
        'capacite_camion' => 'decimal:2',
        'volume_decape'   => 'decimal:2',
>>>>>>> clean-IMANE
    ];
}
