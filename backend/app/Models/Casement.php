<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Casement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'casements';

    /**
     * Tous les champs autorisés en mass assignment.
     * Mappés 1:1 avec le formulaire React (EMPTY_FORM + OEE).
     */
    protected $fillable = [
        // Localisation
        'date',
        'panneau',
        'tranchee',
        'niveau',
        'profondeur',

        // Production
        'volume_saute',

        // Personnel
        'conducteur',
        'matricule',
        'poste',

        // Équipements
        'equipements',
        'arrets_equipements',

        // Temps
        'heure_debut_compteur',
        'heure_fin_compteur',
        'temps',
        'htp',

        // État machine
        'etat_machine',
        'type_arret',
        'heure_debut_arret',
        'heure_fin_arret',

        // KPIs
        'oee',
        'tu',
        'td',
    ];

    /**
     * Cast automatiques.
     * - Les colonnes JSON sont décodées en array PHP à la lecture.
     * - Les décimaux sont retournés en float.
     */
    protected $casts = [
        'date'               => 'date:Y-m-d',
        'equipements'        => 'array',
        'arrets_equipements' => 'array',
        'volume_saute'       => 'float',
        'temps'              => 'float',
        'htp'                => 'float',
        'oee'                => 'float',
        'tu'                 => 'float',
        'td'                 => 'float',
        'deleted_at'         => 'datetime',
    ];

    // ─── Accesseurs ──────────────────────────────────────────────────────────

    /**
     * Rendement = volume_saute / temps  (m²/h)
     * Retourne 0 si temps est nul pour éviter la division par zéro.
     */
    public function getRendementAttribute(): float
    {
        if (!$this->temps || $this->temps == 0) return 0;
        return round($this->volume_saute / $this->temps, 2);
    }

    /**
     * Durée de l'arrêt global en heures (heure_fin_arret - heure_debut_arret).
     */
    public function getDureeArretAttribute(): float
    {
        if (!$this->heure_debut_arret || !$this->heure_fin_arret) return 0;

        [$dh, $dm] = explode(':', substr($this->heure_debut_arret, 0, 5));
        [$fh, $fm] = explode(':', substr($this->heure_fin_arret,   0, 5));

        $minutes = ((int)$fh * 60 + (int)$fm) - ((int)$dh * 60 + (int)$dm);
        return $minutes > 0 ? round($minutes / 60, 2) : 0;
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    /** Filtrer par état machine */
    public function scopeMarche($query)
    {
        return $query->where('etat_machine', 'marche');
    }

    public function scopeArret($query)
    {
        return $query->where('etat_machine', 'arret');
    }

    /** Filtrer par plage de dates */
    public function scopeEntreDates($query, string $debut, string $fin)
    {
        return $query->whereBetween('date', [$debut, $fin]);
    }

    /** Filtrer par panneau */
    public function scopePanneau($query, string $panneau)
    {
        return $query->where('panneau', $panneau);
    }

    /** Filtrer par conducteur */
    public function scopeConducteur($query, string $conducteur)
    {
        return $query->where('conducteur', 'like', "%{$conducteur}%");
    }
}