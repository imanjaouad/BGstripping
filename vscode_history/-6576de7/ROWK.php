<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// === IMPORTS DES MODELS ===
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation;
use App\Models\Salle;
use App\Models\Seance;

class IstaController extends Controller
{
    // 1. Jib l'asatida
    public function getFormateurs()
    {
        return response()->json(Formateur::all());
    }

    // 2. Jib les Groupes
    public function getGroupes()
    {
        return response()->json(Groupe::all());
    }

    // 3. Jib Affectations
    public function getAffectations()
    {
        $data = Affectation::with(['groupe', 'module', 'formateur'])->get();
        return response()->json($data);
    }

    // 4. Jib Modules
    public function getModules() {
        return response()->json(\App\Models\Module::all());
    }

    // 5. Enregistrer Affectation Jdida
    public function storeAffectation(Request $request) {
        $affectation = new Affectation();
        $affectation->id_groupe = $request->id_groupe;
        $affectation->id_module = $request->id_module;
        $affectation->id_formateur = $request->id_formateur;
        $affectation->mh_pres = $request->mh_pres;
        $affectation->mh_fad = $request->mh_fad;
        $affectation->save();

        return response()->json(['message' => 'Ajouté avec succès!']);
    }

    // 6. Modifier Affectation
    public function updateAffectation(Request $request, $id) {
        $affectation = Affectation::find($id);
        if($affectation) {
            $affectation->id_groupe = $request->id_groupe;
            $affectation->id_module = $request->id_module;
            $affectation->id_formateur = $request->id_formateur;
            $affectation->mh_pres = $request->mh_pres;
            $affectation->mh_fad = $request->mh_fad;
            $affectation->save();
            return response()->json(['message' => 'Modifié avec succès!']);
        }
        return response()->json(['message' => 'Non trouvé'], 404);
    }

    // 7. Supprimer Affectation
    public function deleteAffectation($id) {
        $affectation = Affectation::find($id);
        if($affectation) {
            $affectation->delete();
            return response()->json(['message' => 'Supprimé avec succès!']);
        }
        return response()->json(['message' => 'Non trouvé'], 404);
    }

    // 8. Statistiques Dashboard
    public function getStats() {
        return response()->json([
            'total_groupes' => Groupe::count(),
            'total_formateurs' => Formateur::count(),
            'total_salles' => Salle::count(),
            'total_fp' => Formateur::where('type_contrat', 'FP')->count(),
            'total_fv' => Formateur::where('type_contrat', 'FV')->count(),
        ]);
    }

    // 9. Jib Salles
    public function getSalles() {
        return response()->json(Salle::all());
    }

    // 10. Zid Salle
    public function storeSalle(Request $request) {
        $salle = new Salle();
        $salle->nom_local = $request->nom_local;
        $salle->type_local = $request->type_local;
        $salle->capacite = $request->capacite;
        $salle->save();
        return response()->json(['message' => 'Salle ajoutée!']);
    }

    // 11. Msa7 Salle
    public function deleteSalle($id) {
        $salle = Salle::find($id);
        if($salle) {
            $salle->delete();
            return response()->json(['message' => 'Supprimée!']);
        }
        return response()->json(['message' => 'Introuvable'], 404);
    }

    // 12. Drag & Drop Affectation (Kanban)
    public function dropAffectation(Request $request) {
        $affectation = Affectation::find($request->id_affectation);
        if ($affectation) {
            $affectation->id_formateur = $request->id_formateur;
            $affectation->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }

    // 14. Jib Emploi du Temps
    public function getEmploi() {
        $emploi = Seance::with([
            'affectation.groupe', 
            'affectation.module', 
            'affectation.formateur',
            'salle'
        ])->get();
        return response()->json($emploi);
    }

    // === 15. HADI HIYA LI KANT NA9SAK (Store Séance) ===
    public function storeSeance(Request $request) {
        try {
            $seance = new Seance();
            $seance->id_affectation = $request->id_affectation;
            $seance->id_salle = $request->id_salle;
            $seance->id_periode = $request->id_periode;
            $seance->jour = $request->jour;
            $seance->heure_debut = $request->heure_debut;
            $seance->heure_fin = $request->heure_fin;
            $seance->save();

            return response()->json(['message' => 'Séance ajoutée !', 'data' => $seance], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}