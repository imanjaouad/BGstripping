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
use App\Models\Parametre;

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
    // app/Http/Controllers/Api/IstaController.php

public function getAvancement() {
    // هاد الدالة هي "الخيط" اللي كيربط الجدول بالداشبورد
    return response()->json(
        Affectation::with(['groupe', 'module'])->get()->map(function($aff) {
            // كيحسب شحال من حصة تبرمجات فعليا في Emploi لهاد المادة
            $heuresRealisees = Seance::where('id_affectation', $aff->id_affectation)->count();
            $totalPrevu = $aff->mh_pres + $aff->mh_fad;
            
            return [
                'groupe' => $aff->groupe->code_groupe,
                'module' => $aff->module->intitule_module,
                'realise' => $heuresRealisees,
                'prevu' => $totalPrevu,
                'pourcentage' => $totalPrevu > 0 ? round(($heuresRealisees / $totalPrevu) * 100) : 0
            ];
        })
    );
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

        // --- 15. تسجيل الحصة مع الاستنساخ الأوتوماتيكي للشهر ---
    public function storeSeance(Request $request) {
        try {
            $id_periode = (int)$request->id_periode;

            // إذا كان المستخدم كيعمر السيمانة 1 (S1)
            if ($id_periode === 1) {
                $seances = [];
                // تكرار العملية للاسابيع 1، 2، 3، و 4
                for ($i = 1; $i <= 4; $i++) {
                    // حماية: نمسحو أي حصة قديمة في نفس الوقت واليوم لهاد القسم باش مايوقعش تداخل
                    Seance::where('id_periode', $i)
                        ->where('jour', $request->jour)
                        ->where('heure_debut', $request->heure_debut)
                        ->whereHas('affectation', function($q) use ($request) {
                            // نجيبو id_groupe من الـ Affectation
                            $aff = Affectation::find($request->id_affectation);
                            $q->where('id_groupe', $aff->id_groupe);
                        })->delete();

                    // تسجيل الحصة الجديدة في السيمانة i
                    $s = new Seance();
                    $s->id_affectation = (int)$request->id_affectation;
                    $s->id_salle = (int)$request->id_salle;
                    $s->id_periode = $i; // رقم السيمانة الحالي في التكرار
                    $s->jour = $request->jour;
                    $s->heure_debut = $request->heure_debut;
                    $s->heure_fin = $request->heure_fin;
                    $s->save();
                    $seances[] = $s;
                }
                return response()->json(['message' => 'Mois complet planifié ! ✨', 'data' => $seances]);
            } else {
                // إذا كان كيعمر S2 أو S3 أو S4، كيتسجل غير في ديك السيمانة بوحدها (تعديل استثنائي)
                $s = new Seance();
                $s->id_affectation = (int)$request->id_affectation;
                $s->id_salle = (int)$request->id_salle;
                $s->id_periode = $id_periode;
                $s->jour = $request->jour;
                $s->heure_debut = $request->heure_debut;
                $s->heure_fin = $request->heure_fin;
                $s->save();
                return response()->json(['message' => 'Séance ajoutée à S'.$id_periode, 'data' => $s]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
        // --- تدبير القاعات (Salles CRUD) ---

    public function storeSalle(Request $request) {
        $salle = new Salle();
        $salle->nom_local = $request->nom_local;
        $salle->type_local = $request->type_local;
        $salle->capacite = $request->capacite ?? 30;
        $salle->save();
        return response()->json(['success' => true]);
    }

    public function deleteSalle($id) {
        $salle = Salle::find($id);
        if($salle) {
            // مهم: نمسحو كاع الحصص اللي مبرمجة في هاد القاعة أولاً باش SQL يخلّينا نمسحوها
            \App\Models\Seance::where('id_salle', $id)->delete();
            
            $salle->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'not found'], 404);
    }

        // --- ⚙️ GESTION DES PARAMÈTRES ---
    public function getSettings() {
    return response()->json(Parametre::find(1));
}

    public function updateSettings(Request $request) {
    $settings = Parametre::find(1);
        if($settings) {
            $settings->update($request->all());
            return response()->json(['success' => true]);
    }
    return response()->json(['error' => 'Not found'], 404);
}
    

    
}