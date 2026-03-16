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
    $personnels = \App\Models\Personnel::all();
    $rapports = \App\Models\RapportProduction::with(['engin', 'personnel'])->latest()->get();

    return view('operations.poussage', compact('chantiers', 'engins', 'personnels', 'rapports'));
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
    
}