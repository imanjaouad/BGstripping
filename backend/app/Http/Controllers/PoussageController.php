<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\Poussage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PoussageController extends Controller
{
    public function index(): JsonResponse
    {
        $poussages = Poussage::query()
            ->with('machine:id,name')
            ->latest('operation_date')
            ->latest('id')
            ->limit(200)
            ->get();

        return response()->json([
            'data' => $poussages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'panneau' => ['required', 'string', 'max:255'],
            'tranchee' => ['required', 'string', 'max:255'],
            'niveau' => ['required', 'string', 'max:255'],
            'saute' => ['required', 'numeric', 'min:0'],
            'profondeur' => ['required', 'numeric', 'min:0'],
            'machineId' => ['required', 'integer', 'exists:machines,id'],
            'conducteur' => ['required', 'string', 'max:255'],
            'matricule' => ['required', 'string', 'max:255'],
            'debutCompteur' => ['required', 'integer', 'min:0'],
            'finCompteur' => ['required', 'integer', 'min:0', 'gte:debutCompteur'],
            'etatMachine' => ['required', Rule::in(['en_marche', 'en_arret'])],
            'typeArret' => ['nullable', 'required_if:etatMachine,en_arret', 'string', 'max:255'],
            'heureDebutArret' => ['nullable', 'required_if:etatMachine,en_arret', 'date_format:H:i'],
            'heureFinArret' => ['nullable', 'required_if:etatMachine,en_arret', 'date_format:H:i'],
        ]);

        $machine = Machine::query()->findOrFail($validated['machineId']);

        $poussage = Poussage::create([
            'operation_date' => $validated['date'],
            'panneau' => $validated['panneau'],
            'tranchee' => $validated['tranchee'],
            'niveau' => $validated['niveau'],
            'saute' => $validated['saute'],
            'profondeur' => $validated['profondeur'],
            'equipement' => $machine->name,
            'machine_id' => $machine->id,
            'conducteur' => $validated['conducteur'],
            'matricule' => $validated['matricule'],
            'compteur_debut' => $validated['debutCompteur'],
            'compteur_fin' => $validated['finCompteur'],
            'etat_machine' => $validated['etatMachine'],
            'type_arret' => $validated['typeArret'] ?? null,
            'arret_heure_debut' => $validated['heureDebutArret'] ?? null,
            'arret_heure_fin' => $validated['heureFinArret'] ?? null,
        ]);

        return response()->json([
            'message' => 'Poussage enregistre avec succes.',
            'data' => $poussage->load('machine:id,name'),
        ], 201);
    }
}
