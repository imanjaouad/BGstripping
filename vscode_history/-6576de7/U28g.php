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