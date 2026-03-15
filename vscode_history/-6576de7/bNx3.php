<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// === HADO HOMA LI KANO NA9SIN ===
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation; // <-- Hada howa li dar lik mochkil!

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

        // 4. Jib Modules (Bach n3mro Select f Formulaire)
    public function getModules() {
        return response()->json(\App\Models\Module::all());
    }

    // 5. Enregistrer Affectation Jdida (SAVE)
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

        // 6. Modifier (UPDATE)
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

    // 7. Supprimer (DELETE)
    public function deleteAffectation($id) {
        $affectation = Affectation::find($id);
        if($affectation) {
            $affectation->delete();
            return response()->json(['message' => 'Supprimé avec succès!']);
        }
        return response()->json(['message' => 'Non trouvé'], 404);
    }
        // 8. Jib Statistiques (Dashboard)
    public function getStats() {
        return response()->json([
            'total_groupes' => Groupe::count(),
            'total_formateurs' => Formateur::count(),
            'total_salles' => \App\Models\Salle::count(), // Nsit masawbtch lik Model Salle, daba ndiroh
            'total_fp' => Formateur::where('type_contrat', 'FP')->count(),
            'total_fv' => Formateur::where('type_contrat', 'FV')->count(),
        ]);
    }
        // --- GESTION SALLES ---

    // 9. Jib Salles
    public function getSalles() {
        return response()->json(\App\Models\Salle::all());
    }

    // 10. Zid Salle Jdida
    public function storeSalle(Request $request) {
        $salle = new \App\Models\Salle();
        $salle->nom_local = $request->nom_local;
        $salle->type_local = $request->type_local; // Salle ou Atelier
        $salle->capacite = $request->capacite;
        $salle->save();
        return response()->json(['message' => 'Salle ajoutée!']);
    }

    // 11. Msa7 Salle
    public function deleteSalle($id) {
        $salle = \App\Models\Salle::find($id);
        if($salle) {
            $salle->delete();
            return response()->json(['message' => 'Supprimée!']);
        }
        return response()->json(['message' => 'Introuvable'], 404);
    }
}


