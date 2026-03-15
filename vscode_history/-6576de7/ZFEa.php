<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation;
use App\Models\Salle;
use App\Models\Seance;
use App\Models\Module;

class IstaController extends Controller
{
    public function getFormateurs() { return response()->json(Formateur::all()); }
    public function getGroupes() { return response()->json(Groupe::all()); }
    public function getModules() { return response()->json(Module::all()); }
    public function getSalles() { return response()->json(Salle::all()); }

    public function getAffectations() {
        return response()->json(Affectation::with(['groupe', 'module', 'formateur'])->get());
    }

    public function getStats() {
        return response()->json([
            'total_groupes' => Groupe::count(),
            'total_formateurs' => Formateur::count(),
            'total_salles' => Salle::count(),
            'total_fp' => Formateur::where('type_contrat', 'FP')->count(),
            'total_fv' => Formateur::where('type_contrat', 'FV')->count(),
        ]);
    }

    public function getEmploi() {
        return response()->json(Seance::with(['affectation.groupe', 'affectation.module', 'affectation.formateur', 'salle'])->get());
    }

    public function storeSeance(Request $request) {
        $seance = new Seance();
        $seance->id_affectation = $request->id_affectation;
        $seance->id_salle = $request->id_salle;
        $seance->id_periode = $request->id_periode;
        $seance->jour = $request->jour;
        $seance->heure_debut = $request->heure_debut;
        $seance->heure_fin = $request->heure_fin;
        $seance->save();
        return response()->json(['message' => 'Success', 'data' => $seance]);
    }

    public function dropAffectation(Request $request) {
        $affectation = Affectation::find($request->id_affectation);
        if ($affectation) {
            $affectation->id_formateur = $request->id_formateur;
            $affectation->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }
}