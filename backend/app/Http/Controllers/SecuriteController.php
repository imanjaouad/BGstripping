<?php

namespace App\Http\Controllers;

use App\Models\Securite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SecuriteController extends Controller
{
    /**
     * Liste des documents et images de sécurité.
     */
    public function index()
    {
        $files = Securite::latest()->get();
        return response()->json($files);
    }

    /**
     * Enregistrer un nouveau fichier (document ou image).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|in:document,image',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = $file->getClientOriginalName();
            
            // Stockage dans le dossier 'public/securite' (sera accessible via /storage/securite/...)
            $path = $file->store('securite', 'public');

            $securite = Securite::create([
                'type' => $request->type,
                'filename' => $filename,
                'path' => $path,
            ]);

            return response()->json([
                'message' => 'Fichier ajouté avec succès !',
                'data' => $securite
            ], 201);
        }

        return response()->json(['message' => 'Aucun fichier reçu.'], 400);
    }

    /**
     * Supprimer un fichier.
     */
    public function destroy($id)
    {
        $securite = Securite::findOrFail($id);
        
        // Supprimer le fichier physique du stockage
        Storage::disk('public')->delete($securite->path);
        
        // Supprimer l'entrée de la base de données
        $securite->delete();

        return response()->json(['message' => 'Fichier supprimé.']);
    }
}
