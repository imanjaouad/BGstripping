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

       public function index()
    {
        $stagiaires = Stagiaire::all(); // récupérer tous les stagiaires
        return view('stagiaire.index', compact('stagiaires'));
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

        return redirect('/')->with('success', 'Stagiaire ajouté avec succès !');
    }
   
}
