<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// استيراد جميع النماذج (Models) اللازمة
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation;
use App\Models\Module;
use App\Models\Salle;
use App\Models\Seance;

class IstaController extends Controller
{
    // ==========================================
    // 1. الموارد الأساسية (Basic Resources)
    // ==========================================

    public function getFormateurs() {
        return response()->json(Formateur::all());
    }

    public function getGroupes() {
        return response()->json(Groupe::all());
    }

    public function getModules() {
        return response()->json(Module::all());
    }

    public function getSalles() {
        return response()->json(Salle::all());
    }

    // ==========================================
    // 2. إحصائيات لوحة القيادة (Dashboard Stats)
    // ==========================================

    public function getStats() {
        return response()->json([
            'total_groupes' => Groupe::count(),
            'total_formateurs' => Formateur::count(),
            'total_salles' => Salle::count(),
            'total_fp' => Formateur::where('type_contrat', 'FP')->count(),
            'total_fv' => Formateur::where('type_contrat', 'FV')->count(),
        ]);
    }

    // ==========================================
    // 3. تدبير المواد (Assignments / Affectations)
    // ==========================================

    public function getAffectations() {
        // جلب المواد مع العلاقات (القسم، المادة، الأستاذ)
        $data = Affectation::with(['groupe', 'module', 'formateur'])->get();
        return response()->json($data);
    }

    public function storeAffectation(Request $request) {
        try {
            $affectation = new Affectation();
            $affectation->id_groupe = (int)$request->id_groupe;
            $affectation->id_module = (int)$request->id_module;
            // إذا كان id_formateur خاوي كيرجع NULL (باش يمشي لبنك الوحدات)
            $affectation->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $affectation->mh_pres = (int)$request->mh_pres;
            $affectation->mh_fad = (int)$request->mh_fad;
            $affectation->save();

            return response()->json(['success' => true, 'message' => 'Affectation créée']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function updateAffectation(Request $request, $id) {
        $affectation = Affectation::find($id);
        if($affectation) {
            $affectation->id_groupe = (int)$request->id_groupe;
            $affectation->id_module = (int)$request->id_module;
            $affectation->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $affectation->mh_pres = (int)$request->mh_pres;
            $affectation->mh_fad = (int)$request->mh_fad;
            $affectation->save();
            return response()->json(['message' => 'Modifié avec succès']);
        }
        return response()->json(['message' => 'Non trouvé'], 404);
    }

    public function deleteAffectation($id) {
        $affectation = Affectation::find($id);
        if($affectation) {
            $affectation->delete();
            return response()->json(['message' => 'Supprimé']);
        }
        return response()->json(['message' => 'Non trouvé'], 404);
    }

    // ==========================================
    // 4. السحب والإفلات (Kanban / Drag & Drop)
    // ==========================================

    public function dropAffectation(Request $request) {
        $affectation = Affectation::find($request->id_affectation);
        if ($affectation) {
            // تحديث الأستاذ فقط (أو إرجاعه للبنك بـ NULL)
            $affectation->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $affectation->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }

    // ==========================================
    // 5. تدبير القاعات (Salles Management)
    // ==========================================

    public function storeSalle(Request $request) {
        $salle = new Salle();
        $salle->nom_local = $request->nom_local;
        $salle->type_local = $request->type_local;
        $salle->capacite = $request->capacite;
        $salle->save();
        return response()->json(['message' => 'Salle ajoutée']);
    }

    public function deleteSalle($id) {
        $salle = Salle::find($id);
        if($salle) {
            $salle->delete();
            return response()->json(['message' => 'Supprimée']);
        }
        return response()->json(['message' => 'Introuvable'], 404);
    }

    // ==========================================
    // 6. جدول الحصص الذكي (Interactive Timetable)
    // ==========================================

    public function getEmploi() {
        // جلب الحصص مع كل تفاصيلها (المادة، الأستاذ، القسم، القاعة)
        $emploi = Seance::with([
            'affectation.groupe', 
            'affectation.module', 
            'affectation.formateur',
            'salle'
        ])->get();
        return response()->json($emploi);
    }

    public function storeSeance(Request $request) {
        try {
            $seance = new Seance();
            $seance->id_affectation = (int)$request->id_affectation;
            $seance->id_salle = (int)$request->id_salle;
            $seance->id_periode = (int)$request->id_periode; // رقم السيمانة (1-4)
            $seance->jour = $request->jour;
            $seance->heure_debut = $request->heure_debut;
            $seance->heure_fin = $request->heure_fin;
            $seance->save();

            return response()->json(['success' => true, 'data' => $seance], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateSeance(Request $request, $id) {
        $seance = Seance::find($id);
        if ($seance) {
            $seance->id_affectation = (int)$request->id_affectation;
            $seance->id_salle = (int)$request->id_salle;
            if ($request->has('id_periode')) $seance->id_periode = (int)$request->id_periode;
            $seance->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }

    public function deleteSeance($id) {
        $seance = Seance::find($id);
        if ($seance) {
            $seance->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }
}