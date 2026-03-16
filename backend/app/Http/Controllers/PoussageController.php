<?php

namespace App\Http\Controllers;

use App\Models\Poussage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PoussageController extends Controller
{
    public function index(): JsonResponse
    {
        $poussages = Poussage::query()
            ->with('machine:id,name')
            ->latest('operation_date')
            ->latest('id')
            ->limit(500)
            ->get();

        return response()->json([
            'data' => $poussages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'panneau'          => ['nullable', 'string', 'max:255'],
            'tranchee'         => ['nullable', 'string', 'max:255'],
            'niveau'           => ['nullable', 'string', 'max:255'],
            'volume_soté'      => ['nullable', 'numeric', 'min:0'],
            'profendeur'       => ['nullable', 'numeric', 'min:0'],
            'equipements'      => ['nullable', 'array'],
            'conducteur'       => ['nullable', 'string', 'max:255'],
            'matricule'        => ['nullable', 'string', 'max:255'],
            'heureDebut'       => ['nullable', 'date_format:H:i'],
            'heureFin'         => ['nullable', 'date_format:H:i'],
            'temps'            => ['nullable', 'numeric', 'min:0'],
            'compteurDebut'    => ['nullable', 'integer', 'min:0'],
            'compteurFin'      => ['nullable', 'integer', 'min:0'],
            'poste'            => ['nullable', 'string', 'max:255'],
            'etatMachine'      => ['nullable', 'string', 'max:255'],
            'typeArret'        => ['nullable', 'string', 'max:255'],
            'heureDebutArret'  => ['nullable', 'date_format:H:i'],
            'heureFinArret'    => ['nullable', 'date_format:H:i'],
        ]);

        $poussage = Poussage::create([
            'operation_date'    => $validated['date'],
            'panneau'           => $validated['panneau'] ?? '',
            'tranchee'          => $validated['tranchee'] ?? '',
            'niveau'            => $validated['niveau'] ?? '',
            'volume_sote'       => $validated['volume_soté'] ?? 0,
            'saute'             => $validated['volume_soté'] ?? 0,
            'profondeur'        => $validated['profendeur'] ?? 0,
            'equipement'        => is_array($validated['equipements'] ?? null)
                                    ? implode(', ', $validated['equipements'])
                                    : '',
            'equipements_json'  => $validated['equipements'] ?? [],
            'conducteur'        => $validated['conducteur'] ?? '',
            'matricule'         => $validated['matricule'] ?? '',
            'compteur_debut'    => $validated['compteurDebut'] ?? 0,
            'compteur_fin'      => $validated['compteurFin'] ?? 0,
            'heure_debut'       => $validated['heureDebut'] ?? null,
            'heure_fin'         => $validated['heureFin'] ?? null,
            'temps'             => $validated['temps'] ?? 0,
            'poste'             => $validated['poste'] ?? '',
            'etat_machine'      => $validated['etatMachine'] ?? 'En marche',
            'type_arret'        => $validated['typeArret'] ?? '',
            'arret_heure_debut' => $validated['heureDebutArret'] ?? null,
            'arret_heure_fin'   => $validated['heureFinArret'] ?? null,
        ]);

        return response()->json([
            'message' => 'Poussage enregistré avec succès.',
            'data'    => $poussage->load('machine:id,name'),
        ], 201);
    }

    public function update(Request $request, Poussage $poussage): JsonResponse
    {
        $validated = $request->validate([
            'date'             => ['sometimes', 'date'],
            'panneau'          => ['nullable', 'string', 'max:255'],
            'tranchee'         => ['nullable', 'string', 'max:255'],
            'niveau'           => ['nullable', 'string', 'max:255'],
            'volume_soté'      => ['nullable', 'numeric', 'min:0'],
            'profendeur'       => ['nullable', 'numeric', 'min:0'],
            'equipements'      => ['nullable', 'array'],
            'conducteur'       => ['nullable', 'string', 'max:255'],
            'matricule'        => ['nullable', 'string', 'max:255'],
            'heureDebut'       => ['nullable', 'date_format:H:i'],
            'heureFin'         => ['nullable', 'date_format:H:i'],
            'temps'            => ['nullable', 'numeric', 'min:0'],
            'compteurDebut'    => ['nullable', 'integer', 'min:0'],
            'compteurFin'      => ['nullable', 'integer', 'min:0'],
            'poste'            => ['nullable', 'string', 'max:255'],
            'etatMachine'      => ['nullable', 'string', 'max:255'],
            'typeArret'        => ['nullable', 'string', 'max:255'],
            'heureDebutArret'  => ['nullable', 'date_format:H:i'],
            'heureFinArret'    => ['nullable', 'date_format:H:i'],
        ]);

        $poussage->update([
            'operation_date'    => $validated['date'] ?? $poussage->operation_date,
            'panneau'           => array_key_exists('panneau', $validated) ? ($validated['panneau'] ?? '') : $poussage->panneau,
            'tranchee'          => array_key_exists('tranchee', $validated) ? ($validated['tranchee'] ?? '') : $poussage->tranchee,
            'niveau'            => array_key_exists('niveau', $validated) ? ($validated['niveau'] ?? '') : $poussage->niveau,
            'volume_sote'       => $validated['volume_soté'] ?? $poussage->volume_sote,
            'saute'             => $validated['volume_soté'] ?? $poussage->saute,
            'profondeur'        => $validated['profendeur'] ?? $poussage->profondeur,
            'equipement'        => is_array($validated['equipements'] ?? null)
                                    ? implode(', ', $validated['equipements'])
                                    : $poussage->equipement,
            'equipements_json'  => $validated['equipements'] ?? $poussage->equipements_json,
            'conducteur'        => array_key_exists('conducteur', $validated) ? ($validated['conducteur'] ?? '') : $poussage->conducteur,
            'matricule'         => array_key_exists('matricule', $validated) ? ($validated['matricule'] ?? '') : $poussage->matricule,
            'compteur_debut'    => $validated['compteurDebut'] ?? $poussage->compteur_debut,
            'compteur_fin'      => $validated['compteurFin'] ?? $poussage->compteur_fin,
            'heure_debut'       => $validated['heureDebut'] ?? $poussage->heure_debut,
            'heure_fin'         => $validated['heureFin'] ?? $poussage->heure_fin,
            'temps'             => $validated['temps'] ?? $poussage->temps,
            'poste'             => array_key_exists('poste', $validated) ? ($validated['poste'] ?? '') : $poussage->poste,
            'etat_machine'      => $validated['etatMachine'] ?? $poussage->etat_machine,
            'type_arret'        => array_key_exists('typeArret', $validated) ? ($validated['typeArret'] ?? '') : $poussage->type_arret,
            'arret_heure_debut' => $validated['heureDebutArret'] ?? $poussage->arret_heure_debut,
            'arret_heure_fin'   => $validated['heureFinArret'] ?? $poussage->arret_heure_fin,
        ]);

        return response()->json([
            'message' => 'Poussage mis à jour avec succès.',
            'data'    => $poussage->fresh()->load('machine:id,name'),
        ]);
    }

    public function destroy(Poussage $poussage): JsonResponse
    {
        $poussage->delete();

        return response()->json([
            'message' => 'Poussage supprimé avec succès.',
        ]);
    }
}
