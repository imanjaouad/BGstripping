<?php

namespace App\Http\Controllers;

use App\Models\Casement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CasementController extends Controller
{
    public function index(): JsonResponse
    {
        $casements = Casement::query()
            ->latest('operation_date')
            ->latest('id')
            ->limit(500)
            ->get();

        return response()->json([
            'data' => $casements,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'panneau'          => ['nullable', 'string', 'max:255'],
            'tranchee'         => ['nullable', 'string', 'max:255'],
            'niveau'           => ['nullable', 'string', 'max:255'],
            'volume_casse'     => ['nullable', 'numeric', 'min:0'],
            'granulometrie'    => ['nullable', 'string', 'max:255'],
            'type_roche'       => ['nullable', 'string', 'max:255'],
            'nombreCoups'      => ['nullable', 'integer', 'min:0'],
            'equipements'      => ['nullable', 'array'],
            'conducteur'       => ['nullable', 'string', 'max:255'],
            'matricule'        => ['nullable', 'string', 'max:255'],
            'heureDebut'       => ['nullable', 'date_format:H:i'],
            'heureFin'         => ['nullable', 'date_format:H:i'],
            'temps'            => ['nullable', 'numeric', 'min:0'],
            'poste'            => ['nullable', 'string', 'max:255'],
            'etatMachine'      => ['nullable', 'string', 'max:255'],
            'typeArret'        => ['nullable', 'string', 'max:255'],
            'heureDebutArret'  => ['nullable', 'date_format:H:i'],
            'heureFinArret'    => ['nullable', 'date_format:H:i'],
        ]);

        $casement = Casement::create([
            'operation_date'    => $validated['date'],
            'panneau'           => $validated['panneau'] ?? null,
            'tranchee'          => $validated['tranchee'] ?? null,
            'niveau'            => $validated['niveau'] ?? null,
            'volume_casse'      => $validated['volume_casse'] ?? 0,
            'granulometrie'     => $validated['granulometrie'] ?? null,
            'type_roche'        => $validated['type_roche'] ?? null,
            'nombre_coups'      => $validated['nombreCoups'] ?? 0,
            'equipements'       => $validated['equipements'] ?? [],
            'conducteur'        => $validated['conducteur'] ?? null,
            'matricule'         => $validated['matricule'] ?? null,
            'heure_debut'       => $validated['heureDebut'] ?? null,
            'heure_fin'         => $validated['heureFin'] ?? null,
            'temps'             => $validated['temps'] ?? 0,
            'poste'             => $validated['poste'] ?? null,
            'etat_machine'      => $validated['etatMachine'] ?? 'en_marche',
            'type_arret'        => $validated['typeArret'] ?? null,
            'arret_heure_debut' => $validated['heureDebutArret'] ?? null,
            'arret_heure_fin'   => $validated['heureFinArret'] ?? null,
        ]);

        return response()->json([
            'message' => 'Casement enregistré avec succès.',
            'data'    => $casement,
        ], 201);
    }

    public function update(Request $request, Casement $casement): JsonResponse
    {
        $validated = $request->validate([
            'date'             => ['sometimes', 'date'],
            'panneau'          => ['nullable', 'string', 'max:255'],
            'tranchee'         => ['nullable', 'string', 'max:255'],
            'niveau'           => ['nullable', 'string', 'max:255'],
            'volume_casse'     => ['nullable', 'numeric', 'min:0'],
            'granulometrie'    => ['nullable', 'string', 'max:255'],
            'type_roche'       => ['nullable', 'string', 'max:255'],
            'nombreCoups'      => ['nullable', 'integer', 'min:0'],
            'equipements'      => ['nullable', 'array'],
            'conducteur'       => ['nullable', 'string', 'max:255'],
            'matricule'        => ['nullable', 'string', 'max:255'],
            'heureDebut'       => ['nullable', 'date_format:H:i'],
            'heureFin'         => ['nullable', 'date_format:H:i'],
            'temps'            => ['nullable', 'numeric', 'min:0'],
            'poste'            => ['nullable', 'string', 'max:255'],
            'etatMachine'      => ['nullable', 'string', 'max:255'],
            'typeArret'        => ['nullable', 'string', 'max:255'],
            'heureDebutArret'  => ['nullable', 'date_format:H:i'],
            'heureFinArret'    => ['nullable', 'date_format:H:i'],
        ]);

        $casement->update([
            'operation_date'    => $validated['date'] ?? $casement->operation_date,
            'panneau'           => $validated['panneau'] ?? $casement->panneau,
            'tranchee'          => $validated['tranchee'] ?? $casement->tranchee,
            'niveau'            => $validated['niveau'] ?? $casement->niveau,
            'volume_casse'      => $validated['volume_casse'] ?? $casement->volume_casse,
            'granulometrie'     => $validated['granulometrie'] ?? $casement->granulometrie,
            'type_roche'        => $validated['type_roche'] ?? $casement->type_roche,
            'nombre_coups'      => $validated['nombreCoups'] ?? $casement->nombre_coups,
            'equipements'       => $validated['equipements'] ?? $casement->equipements,
            'conducteur'        => $validated['conducteur'] ?? $casement->conducteur,
            'matricule'         => $validated['matricule'] ?? $casement->matricule,
            'heure_debut'       => $validated['heureDebut'] ?? $casement->heure_debut,
            'heure_fin'         => $validated['heureFin'] ?? $casement->heure_fin,
            'temps'             => $validated['temps'] ?? $casement->temps,
            'poste'             => $validated['poste'] ?? $casement->poste,
            'etat_machine'      => $validated['etatMachine'] ?? $casement->etat_machine,
            'type_arret'        => $validated['typeArret'] ?? $casement->type_arret,
            'arret_heure_debut' => $validated['heureDebutArret'] ?? $casement->arret_heure_debut,
            'arret_heure_fin'   => $validated['heureFinArret'] ?? $casement->arret_heure_fin,
        ]);

        return response()->json([
            'message' => 'Casement mis à jour avec succès.',
            'data'    => $casement->fresh(),
        ]);
    }

    public function destroy(Casement $casement): JsonResponse
    {
        $casement->delete();

        return response()->json([
            'message' => 'Casement supprimé avec succès.',
        ]);
    }
}
