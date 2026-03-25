<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stagiaire;

class StagiaireController extends Controller
{
    public function create()
    {
        return view('stagiaire.create');
    }

    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'nom' => 'required',
            'prenom' => 'required'
        ]);

        // Enregistrement
        Stagiaire::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom
        ]);

        return redirect()->back()->with('success', 'Stagiaire ajouté avec succès !');
    }
}
