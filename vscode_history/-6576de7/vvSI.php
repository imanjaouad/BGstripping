<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// استيراد جميع النماذج (Models) اللازمة للعمل
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation;
use App\Models\Module;
use App\Models\Salle;
use App\Models\Seance;

class IstaController extends Controller
{
    // ==========================================
    // 1. تدبير الأساتذة (Staff Management)
    // ==========================================

    public function getFormateurs() {
        return response()->json(Formateur::all());
    }

    public function storeFormateur(Request $request) {
        // إنشاء أستاذ جديد مع كل الحقول (الأسابيع، الباسوورد، إلخ)
        $f = Formateur::create($request->all());
        return response()->json($f);
    }

    public function updateFormateur(Request $request, $id) {
        $f = Formateur::find($id);
        if ($f) {
            $f->update($request->all());
            return response()->json(['message' => 'Success']);
        }
        return response()->json(['error' => 'Formateur non trouvé'], 404);
    }

    public function deleteFormateur($id) {
        $f = Formateur::find($id);
        if ($f) {
            $f->delete();
            return response()->json(['message' => 'Supprimé']);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }


    // ==========================================
    // 2. إحصائيات لوحة القيادة (Dashboard Analytics)
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
    // 3. تدبير المواد والتعيينات (Assignments)
    // ==========================================

    public function getAffectations() {
        // جلب المواد مع العلاقات كاملة (القسم، المادة، الأستاذ)
        return response()->json(Affectation::with(['groupe', 'module', 'formateur'])->get());
    }

    public function storeAffectation(Request $request) {
        try {
            $aff = new Affectation();
            $aff->id_groupe = (int)$request->id_groupe;
            $aff->id_module = (int)$request->id_module;
            $aff->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $aff->mh_pres = (int)$request->mh_pres;
            $aff->mh_fad = (int)$request->mh_fad;
            $aff->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateAffectation(Request $request, $id) {
        $aff = Affectation::find($id);
        if ($aff) {
            $aff->update($request->all());
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }

    public function deleteAffectation($id) {
        $aff = Affectation::find($id);
        if ($aff) {
            $aff->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Non trouvé'], 404);
    }


    // ==========================================
    // 4. السحب والإفلات السريع (Drag & Drop Kanban)
    // ==========================================

    public function dropAffectation(Request $request) {
        $aff = Affectation::find($request->id_affectation);
        if ($aff) {
            // تحديث الأستاذ فقط عند تحريك البطاقة
            $aff->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $aff->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }


    // ==========================================
    // 5. جدول الحصص الذكي (Smart Scheduler Grid)
    // ==========================================

    public function getEmploi() {
        // جلب كاع الحصص مع القاعات والأساتذة والأقسام
        return response()->json(Seance::with(['affectation.groupe', 'affectation.module', 'affectation.formateur', 'salle'])->get());
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
            if($request->has('id_periode')) $seance->id_periode = (int)$request->id_periode;
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


    // ==========================================
    // 6. تدبير القاعات والوحدات (Basics)
    // ==========================================

    public function getSalles() { return response()->json(Salle::all()); }
    public function getGroupesList() { return response()->json(Groupe::all()); }
    public function getModulesList() { return response()->json(Module::all()); }

    public function storeSalle(Request $request) {
        $s = Salle::create($request->all());
        return response()->json($s);
    }

    public function deleteSalle($id) {
        Salle::destroy($id);
        return response()->json(['success' => true]);
    }
    
}