<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * CasementRequest — Validation centralisée pour la création ET la mise à jour.
 *
 * Règles alignées sur le formulaire React :
 *  - Champs obligatoires : date, panneau, volume_saute, etat_machine
 *  - Champs optionnels   : tous les autres (nullable)
 *  - Enum etat_machine   : 'marche' | 'arret'  (valeurs internes sans accent)
 */
class CasementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adapter si authentification JWT/Sanctum
    }

    public function rules(): array
    {
        return [
            // ── Localisation ──────────────────────────────────────────────
            'date'                    => ['required', 'date'],
            'panneau'                 => ['nullable', 'string', 'max:100'],
            'tranchee'                => ['nullable', 'string', 'max:100'],
            'niveau'                  => ['nullable', 'string', 'max:100'],
            'profondeur'              => ['nullable', 'string', 'max:100'],

            // ── Production ────────────────────────────────────────────────
            'volume_saute'            => ['required', 'numeric', 'min:0'],

            // ── Personnel ─────────────────────────────────────────────────
            'conducteur'              => ['nullable', 'string', 'max:150'],
            'matricule'               => ['nullable', 'string', 'max:50'],
            'poste'                   => ['nullable', 'string', 'max:50'],

            // ── Équipements ───────────────────────────────────────────────
            'equipements'             => ['nullable', 'array'],
            'equipements.*'           => ['string', 'max:50'],
            'arrets_equipements'      => ['nullable', 'array'],

            // ── Temps ─────────────────────────────────────────────────────
            'heure_debut_compteur'    => ['nullable', 'date_format:H:i'],
            'heure_fin_compteur'      => ['nullable', 'date_format:H:i'],
            'temps'                   => ['nullable', 'numeric', 'min:0'],
            'htp'                     => ['nullable', 'numeric', 'min:0'],

            // ── État machine ──────────────────────────────────────────────
            'etat_machine'            => ['required', 'in:marche,arret'],
            'type_arret'              => ['nullable', 'string', 'max:100'],
            'heure_debut_arret'       => ['nullable', 'date_format:H:i'],
            'heure_fin_arret'         => ['nullable', 'date_format:H:i'],

            // ── KPIs ──────────────────────────────────────────────────────
            'oee'                     => ['nullable', 'numeric', 'min:0', 'max:100'],
            'tu'                      => ['nullable', 'numeric', 'min:0', 'max:100'],
            'td'                      => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.required'          => 'La date est obligatoire.',
            'date.date'              => 'Format de date invalide.',
            'volume_saute.required'  => 'Le volume sauté est obligatoire.',
            'volume_saute.numeric'   => 'Le volume sauté doit être un nombre.',
            'volume_saute.min'       => 'Le volume sauté ne peut pas être négatif.',
            'etat_machine.required'  => "L'état de la machine est obligatoire.",
            'etat_machine.in'        => "L'état de la machine doit être 'marche' ou 'arret'.",
            'oee.max'                => "L'OEE ne peut pas dépasser 100%.",
            'tu.max'                 => "Le TU ne peut pas dépasser 100%.",
            'td.max'                 => "Le TD ne peut pas dépasser 100%.",
        ];
    }

    /**
     * Nettoyage avant validation :
     * Convertit les chaînes vides en null pour les champs numériques.
     */
    protected function prepareForValidation(): void
    {
        $numericFields = ['volume_saute', 'temps', 'htp', 'oee', 'tu', 'td'];

        foreach ($numericFields as $field) {
            if ($this->has($field) && $this->input($field) === '') {
                $this->merge([$field => null]);
            }
        }
    }
}
