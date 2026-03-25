<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post; // <--- TRÈS IMPORTANT : L'IMPORT DU MODÈLE
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Voir tous les posts
    public function index() {
        try {
            // On récupère les posts avec le nom de l'utilisateur
            return Post::with('user')->latest()->get();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Créer un post
    public function store(Request $request) {
        try {
            $request->validate([
                'content' => 'required|string|max:280'
            ]);

            $post = Post::create([
                'content' => $request->content,
                'user_id' => $request->user()->id // Récupère l'ID de l'utilisateur connecté
            ]);

            return response($post->load('user'), 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}