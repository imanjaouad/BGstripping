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
            // Noms de champs envoyés par le frontend (camelCase) → mappés vers snake_case du modèle
            'date' => ['required', 'date'],
            'panneau' => ['nullable', 'string', 'max:255'],
            'tranchee' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
            'volume_sote' => ['nullable', 'numeric', 'min:0'],
            'profondeur' => ['nullable', 'numeric', 'min:0'],
            'equipements' => ['nullable', 'array'],
            'conducteur' => ['nullable', 'string', 'max:255'],
            'matricule' => ['nullable', 'string', 'max:255'],
            'machine_id' => ['nullable', 'integer', 'exists:machines,id'],
            'heureDebut' => ['nullable', 'date_format:H:i'],
            'heureFin' => ['nullable', 'date_format:H:i'],
            'temps' => ['nullable', 'numeric', 'min:0'],
           
            'poste' => ['nullable', 'string', 'max:255'],
            'etat_machine' => ['nullable', 'in:En marche,En arrêt'],
            'type_arret' => ['nullable', 'string', 'max:255'],
            'heureDebutArret' => ['nullable', 'date_format:H:i'],
            'heureFinArret' => ['nullable', 'date_format:H:i'],
            'htp' => ['nullable', 'numeric', 'min:0', 'max:8'],
        ]);

        $poussage = Poussage::create([
            'operation_date' => $validated['date'],
            'panneau' => $validated['panneau'] ?? '',
            'tranchee' => $validated['tranchee'] ?? '',
            'niveau' => $validated['niveau'] ?? '',
            'volume_sote' => $validated['volume_sote'] ?? 0,
            'saute' => $validated['volume_sote'] ?? 0,
            'profondeur' => $validated['profondeur'] ?? 0,
            'equipement' => is_array($validated['equipements'] ?? null)
            ? implode(', ', $validated['equipements'])
            : '',
            'equipements_json' => $validated['equipements'] ?? [],
            'machine_id' => $validated['machine_id'] ?? null,
            'conducteur' => $validated['conducteur'] ?? '',
            'matricule' => $validated['matricule'] ?? '',
           
            'heure_debut' => $validated['heureDebut'] ?? null,
            'heure_fin' => $validated['heureFin'] ?? null,
            'temps' => $validated['temps'] ?? 0,
            'poste' => $validated['poste'] ?? '',
            'etat_machine' => $validated['etat_machine'] ?? 'En marche',
            'type_arret' => $validated['type_arret'] ?? '',
            'arret_heure_debut' => $validated['heureDebutArret'] ?? null,
            'arret_heure_fin' => $validated['heureFinArret'] ?? null,
            'HTP' => $validated['htp'] ?? null,
        ]);

        return response()->json([
            'message' => 'Poussage enregistré avec succès.',
            'data' => $poussage->load('machine:id,name'),
        ], 201);
    }

    public function update(Request $request, Poussage $poussage): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['sometimes', 'date'],
            'panneau' => ['nullable', 'string', 'max:255'],
            'tranchee' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
            'volume_sote' => ['nullable', 'numeric', 'min:0'],
            'profondeur' => ['nullable', 'numeric', 'min:0'],
            'equipements' => ['nullable', 'array'],
            'conducteur' => ['nullable', 'string', 'max:255'],
            'matricule' => ['nullable', 'string', 'max:255'],
            'machine_id' => ['nullable', 'integer', 'exists:machines,id'],
            'heureDebut' => ['nullable', 'date_format:H:i'],
            'heureFin' => ['nullable', 'date_format:H:i'],
            'temps' => ['nullable', 'numeric', 'min:0'],
           
            
            'etat_machine' => ['nullable', 'in:En marche,En arrêt'],
            'type_arret' => ['nullable', 'string', 'max:255'],
            'heureDebutArret' => ['nullable', 'date_format:H:i'],
            'heureFinArret' => ['nullable', 'date_format:H:i'],
            'htp' => ['nullable', 'numeric', 'min:0', 'max:8'],
        ]);

        $poussage->update([
            'operation_date' => $validated['date'] ?? $poussage->operation_date,
            'panneau' => array_key_exists('panneau', $validated) ? ($validated['panneau'] ?? '') : $poussage->panneau,
            'tranchee' => array_key_exists('tranchee', $validated) ? ($validated['tranchee'] ?? '') : $poussage->tranchee,
            'niveau' => array_key_exists('niveau', $validated) ? ($validated['niveau'] ?? '') : $poussage->niveau,
            'volume_sote' => array_key_exists('volume_sote', $validated) ? ($validated['volume_sote'] ?? 0) : $poussage->volume_sote,
            'saute' => array_key_exists('volume_sote', $validated) ? ($validated['volume_sote'] ?? 0) : $poussage->saute,
            'profondeur' => array_key_exists('profondeur', $validated) ? ($validated['profondeur'] ?? 0) : $poussage->profondeur,
            'equipement' => array_key_exists('equipements', $validated)
            ? (is_array($validated['equipements']) ? implode(', ', $validated['equipements']) : '')
            : $poussage->equipement,
            'equipements_json' => array_key_exists('equipements', $validated) ? ($validated['equipements'] ?? []) : $poussage->equipements_json,
            'machine_id' => array_key_exists('machine_id', $validated) ? $validated['machine_id'] : $poussage->machine_id,
            'conducteur' => array_key_exists('conducteur', $validated) ? ($validated['conducteur'] ?? '') : $poussage->conducteur,
            'matricule' => array_key_exists('matricule', $validated) ? ($validated['matricule'] ?? '') : $poussage->matricule,
            
            'heure_debut' => array_key_exists('heureDebut', $validated) ? ($validated['heureDebut'] ?? null) : $poussage->heure_debut,
            'heure_fin' => array_key_exists('heureFin', $validated) ? ($validated['heureFin'] ?? null) : $poussage->heure_fin,
            'temps' => array_key_exists('temps', $validated) ? ($validated['temps'] ?? 0) : $poussage->temps,
            
            'etat_machine' => array_key_exists('etat_machine', $validated) ? ($validated['etat_machine'] ?? 'En marche') : $poussage->etat_machine,
            'type_arret' => array_key_exists('type_arret', $validated) ? ($validated['type_arret'] ?? '') : $poussage->type_arret,
            'arret_heure_debut' => array_key_exists('heureDebutArret', $validated) ? ($validated['heureDebutArret'] ?? null) : $poussage->arret_heure_debut,
            'arret_heure_fin' => array_key_exists('heureFinArret', $validated) ? ($validated['heureFinArret'] ?? null) : $poussage->arret_heure_fin,
            'HTP' => array_key_exists('htp', $validated) ? ($validated['htp'] ?? null) : $poussage->HTP,
        ]);

        return response()->json([
            'message' => 'Poussage mis à jour avec succès.',
            'data' => $poussage->fresh()->load('machine:id,name'),
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