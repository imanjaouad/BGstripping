<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation;
use App\Models\Module;
use App\Models\Salle;
use App\Models\Seance;

class IstaController extends Controller
{
    // 1. الإحصائيات العامة
    public function getStats() {
        return response()->json([
            'total_groupes' => Groupe::count(),
            'total_formateurs' => Formateur::count(),
            'total_salles' => Salle::count(),
            'total_fp' => Formateur::where('type_contrat', 'FP')->count(),
            'total_fv' => Formateur::where('type_contrat', 'FV')->count(),
        ]);
    }

    // 2. حساب تقدم المواد (Avancement) - هادي هي اللي كانت ناقصاك
    public function getAvancement() {
        $data = Affectation::with(['groupe', 'module'])->get()->map(function($aff) {
            // كيحسب شحال من حصة تبرمجات لهاد المادة في جدول seances
            $realise = Seance::where('id_affectation', $aff->id_affectation)->count();
            $prevu = $aff->mh_pres + $aff->mh_fad;
            $pourcentage = $prevu > 0 ? round(($realise / $prevu) * 100) : 0;

            return [
                'groupe' => $aff->groupe->code_groupe ?? 'N/A',
                'module' => $aff->module->intitule_module ?? 'Module',
                'realise' => $realise,
                'prevu' => $prevu,
                'pourcentage' => $pourcentage > 100 ? 100 : $pourcentage
            ];
        });
        return response()->json($data);
    }

    // 3. باقي الدوال (خلاصة سريعة)
    public function getFormateurs() { return response()->json(Formateur::all()); }
    public function getGroupes() { return response()->json(Groupe::all()); }
    public function getAffectations() { return response()->json(Affectation::with(['groupe', 'module', 'formateur'])->get()); }
    public function getModules() { return response()->json(Module::all()); }
    public function getSalles() { return response()->json(Salle::all()); }
    public function getEmploi() { return response()->json(Seance::with(['affectation.groupe', 'affectation.module', 'affectation.formateur', 'salle'])->get()); }

    public function storeFormateur(Request $request) { $f = Formateur::create($request->all()); return response()->json($f); }
    public function updateFormateur(Request $request, $id) { $f = Formateur::find($id); $f ? $f->update($request->all()) : null; return response()->json(['m'=>'ok']); }
    public function deleteFormateur($id) { Formateur::destroy($id); return response()->json(['m'=>'ok']); }

    public function storeSeance(Request $request) {
        $s = new Seance();
        $s->id_affectation = (int)$request->id_affectation;
        $s->id_salle = (int)$request->id_salle;
        $s->id_periode = (int)$request->id_periode;
        $s->jour = $request->jour;
        $s->heure_debut = $request->heure_debut;
        $s->heure_fin = $request->heure_fin;
        $s->save();
        return response()->json($s);
    }
    
    public function updateSeance(Request $request, $id) {
        $s = Seance::find($id);
        if ($s) { $s->update($request->all()); return response()->json(['s'=>true]); }
        return response()->json(['e'=>'error'], 404);
    }

    public function deleteSeance($id) { Seance::destroy($id); return response()->json(['s'=>true]); }

    public function dropAffectation(Request $request) {
        $aff = Affectation::find($request->id_affectation);
        if ($aff) { $aff->id_formateur = $request->id_formateur; $aff->save(); return response()->json(['s'=>true]); }
        return response()->json(['s'=>false], 404);
    }

    public function storeAffectation(Request $request) {
        $aff = new Affectation();
        $aff->id_groupe = (int)$request->id_groupe;
        $aff->id_module = (int)$request->id_module;
        $aff->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
        $aff->mh_pres = (int)$request->mh_pres;
        $aff->mh_fad = (int)$request->mh_fad;
        $aff->save();
        return response()->json(['s'=>true]);
    }
        // --- تدبير المجموعات (Group Management) ---
    
    public function storeGroupe(Request $request) {
        $g = Groupe::create($request->all());
        return response()->json($g);
    }

    public function updateGroupe(Request $request, $id) {
        $g = Groupe::find($id);
        if($g) {
            $g->update($request->all());
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }

    public function deleteGroupe($id) {
    $groupe = \App\Models\Groupe::find($id);
    if($groupe) {
        // تمسح كاع الحصص والمواد المرتبطة بهاد الكروب أولاً باش مايوقعش بلوكاج
        \App\Models\Seance::whereIn('id_affectation', function($query) use ($id) {
            $query->select('id_affectation')->from('affectations')->where('id_groupe', $id);
        })->delete();
        
        \App\Models\Affectation::where('id_groupe', $id)->delete();
        
        // دابا عاد تمسح الكروب
        $groupe->delete();
        
        return response()->json(['success' => true]);
    }
    return response()->json(['error' => 'not found'], 404);
}
        // 20. جلب استعمال القاعات (Room Occupancy)
    public function getSallesOccupation() {
        $seances = Seance::with(['affectation.groupe', 'affectation.formateur', 'salle'])->get();
        return response()->json($seance);
    }

    
}