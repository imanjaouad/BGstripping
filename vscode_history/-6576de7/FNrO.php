<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// === HADO HOMA LI KANO NA9SIN ===
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Affectation; // <-- Hada howa li dar lik mochkil!

class IstaController extends Controller
{
    // 1. Jib l'asatida
    public function getFormateurs()
    {
        return response()->json(Formateur::all());
    }

    // 2. Jib les Groupes
    public function getGroupes()
    {
        return response()->json(Groupe::all());
    }

    // 3. Jib Affectations
    public function getAffectations()
    {
        $data = Affectation::with(['groupe', 'module', 'formateur'])->get();
        return response()->json($data);
    }
}

