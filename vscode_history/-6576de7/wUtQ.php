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

class IstaController extends Controller {
    // جلب كاع البيانات اللازمة لصفحة السحب
    public function getAffectations() { return response()->json(Affectation::with(['groupe', 'module', 'formateur'])->get()); }
    public function getFormateurs() { return response()->json(Formateur::all()); }
    public function getGroupes() { return response()->json(Groupe::all()); }
    public function getModules() { return response()->json(Module::all()); }

    // إضافة مادة جديدة (للبنك أو مباشرة لأستاذ)
    public function storeAffectation(Request $request) {
        try {
            $affectation = new Affectation();
            $affectation->id_groupe = (int)$request->id_groupe;
            $affectation->id_module = (int)$request->id_module;
            // إذا كان id_formateur كاين كيردو رقم، إذا ماكاينش كيردو NULL (باش يمشي للبنك)
            $affectation->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $affectation->mh_pres = (int)$request->mh_pres;
            $affectation->mh_fad = (int)$request->mh_fad;
            $affectation->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // تحديث الأستاذ عند السحب والإفلات
    public function dropAffectation(Request $request) {
        $affectation = Affectation::find($request->id_affectation);
        if ($affectation) {
            $affectation->id_formateur = $request->id_formateur ? (int)$request->id_formateur : null;
            $affectation->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }
}