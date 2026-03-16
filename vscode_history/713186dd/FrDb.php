<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RapportProduction;
use App\Models\Chantier;
use App\Models\Engin;
use App\Models\Personnel;

class RapportController extends Controller
{
    public function index()
    {
        // هاد السطر كيجيب كاع التقارير اللي مسجلين باش نبينوهم فـ Historique
        $rapports = RapportProduction::with(['chantier', 'engin', 'personnel'])->latest()->get();
        
        // غانحتاجو هاد الداتا باش نعمرو الـ Dropdowns (القوائم)
        $chantiers = Chantier::all();
        $engins = Engin::all();
        $personnels = Personnel::all();

        return view('operations.poussage', compact('rapports', 'chantiers', 'engins', 'personnels'));
    }

    public function store(Request $request)
    {
        // تسجيل المعلومات اللي جاية من الفورمير
        RapportProduction::create([
            'date_operation' => $request->date_operation,
            'chantier_id' => $request->chantier_id,
            'engin_id' => $request->engin_id,
            'personnel_id' => $request->personnel_id,
            'poste_id' => 1, // بوسط افتراضي
            'volume_decapé' => $request->volume_decapé,
            'compteur_debut' => $request->compteur_debut,
            'compteur_fin' => $request->compteur_fin,
        ]);

        return redirect()->back()->with('success', 'Rapport enregistré !');
    }
    public function store(Request $request)
{
    // 1. التحقق من صحة البيانات (Validation)
    $request->validate([
        'date_operation' => 'required|date',
        'chantier_id' => 'required|exists:chantiers,id',
        'engin_id' => 'required|exists:engins,id',
        'personnel_id' => 'required|exists:personnels,id',
        'compteur_debut' => 'required|numeric',
        'compteur_fin' => 'required|numeric|gt:compteur_debut', // Fin > Début
        'volume_decapé' => 'required|numeric',
    ], [
        'compteur_fin.gt' => 'Le compteur fin doit être supérieur au compteur début !'
    ]);

    // 2. التسجيل
    RapportProduction::create([
        'date_operation' => $request->date_operation,
        'chantier_id' => $request->chantier_id,
        'engin_id' => $request->engin_id,
        'personnel_id' => $request->personnel_id,
        'poste_id' => 1, 
        'volume_decapé' => $request->volume_decapé,
        'compteur_debut' => $request->compteur_debut,
        'compteur_fin' => $request->compteur_fin,
    ]);

    return redirect()->back()->with('success', 'Le rapport a été synchronisé avec la base de données !');
}
}