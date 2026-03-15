<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
            'poste_id' => 1, // تجريبياً غانديرو بوسط 1
            'volume_decapé' => $request->volume_decapé,
            'compteur_debut' => $request->compteur_debut,
            'compteur_fin' => $request->compteur_fin,
        ]);

        return redirect()->back()->with('success', 'Rapport enregistré !');
    }
}