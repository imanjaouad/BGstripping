<?php

namespace App\Http\Controllers;

use App\Models\TransportJournalier;
use Illuminate\Http\Request;

class TransportJournalierController extends Controller
{
    /**
     * List all records, optionally filtered by date.
     */
    public function index(Request $request)
    {
        $query = TransportJournalier::query();

        if ($request->has('date')) {
            $query->where('operation_date', $request->date);
        }

        return response()->json($query->orderBy('operation_date', 'desc')->get());
    }

    /**
     * Upsert a transport record.
     * Uses updateOrCreate on the unique key (date, entreprise, type_moyen).
     */
    public function store(Request $request)
    {
        $request->validate([
            'operation_date'  => 'required|date',
            'entreprise'      => 'required|string|in:procaneq,transwine',
            'type_moyen'      => 'required|string|in:petits,grands',
            'nombre_voyages'  => 'nullable|integer|min:0',
            'capacite_camion' => 'nullable|numeric|min:0',
        ]);

        $voyages  = (int)    ($request->nombre_voyages  ?? 0);
        $capacite = (float)  ($request->capacite_camion ?? 0);

        $record = TransportJournalier::updateOrCreate(
            [
                'operation_date' => $request->operation_date,
                'entreprise'     => $request->entreprise,
                'type_moyen'     => $request->type_moyen,
            ],
            [
                'nombre_voyages'  => $voyages,
                'capacite_camion' => $capacite,
                'volume_decape'   => $voyages * $capacite,
                'panneau'         => $request->panneau ?? null,
                'tranchee'        => $request->tranchee ?? null,
                'niveau'          => $request->niveau ?? null,
            ]
        );

        return response()->json($record);
    }

    /**
     * Update an existing record.
     */
    public function update(Request $request, TransportJournalier $transportJournalier)
    {
        $data = $request->only(['nombre_voyages', 'capacite_camion', 'panneau', 'tranchee', 'niveau']);

        $voyages  = (int)   ($data['nombre_voyages']  ?? $transportJournalier->nombre_voyages);
        $capacite = (float) ($data['capacite_camion'] ?? $transportJournalier->capacite_camion);

        $transportJournalier->update([
            'nombre_voyages'  => $voyages,
            'capacite_camion' => $capacite,
            'volume_decape'   => $voyages * $capacite,
            'panneau'         => $data['panneau']  ?? $transportJournalier->panneau,
            'tranchee'        => $data['tranchee'] ?? $transportJournalier->tranchee,
            'niveau'          => $data['niveau']   ?? $transportJournalier->niveau,
        ]);

        return response()->json($transportJournalier);
    }

    /**
     * Delete a record.
     */
    public function destroy(TransportJournalier $transportJournalier)
    {
        $transportJournalier->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}