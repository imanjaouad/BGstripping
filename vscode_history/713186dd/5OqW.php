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
    $chantiers = \App\Models\Chantier::all();
    $engins = \App\Models\Engin::all();
    $typeArrets = \App\Models\TypeArret::all();
    $personnels = \App\Models\Personnel::all();
    $rapports = \App\Models\RapportProduction::with(['engin', 'personnel'])->latest()->get();

    return view('operations.poussage', compact('chantiers', 'engins', 'personnels', 'rapports', 'typeArrets'));
}

    public function store(Request $request)
{
    // 1. تسجيل التقرير فالداتابيز
    $rapport = \App\Models\RapportProduction::create([
        'date_operation' => $request->date_operation,
        'chantier_id'    => $request->chantier_id,
        'engin_id'       => $request->engin_id,
        'personnel_id'   => $request->personnel_id,
        'poste_id'       => 1, // بوسط افتراضي
        'tranchee'       => $request->tranchee,
        'niveau'         => $request->niveau,
        'compteur_debut' => $request->compteur_debut,
        'compteur_fin'   => $request->compteur_fin,
        'volume_decapé'  => $request->volume_decapé,
    ]);

    // 2. إذا كانت الماكينة حبسات (Arrêt)، نسجل التوقف
    if ($request->statut_machine == 'arret') {
        \App\Models\Arret::create([
            'rapport_id'    => $rapport->id,
            'type_arret_id' => $request->type_arret_id,
            'heure_debut'   => $request->heure_debut_arret,
            'heure_fin'     => $request->heure_fin_arret,
        ]);
    }

    return redirect()->back()->with('success', 'Rapport de poussage synchronisé avec succès !');
}
    
}