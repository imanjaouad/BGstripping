<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Voir tous les posts
    public function index() {
        return Post::with('user')->latest()->get(); // On récupère aussi le nom de l'auteur
    }

    // Créer un post
    public function store(Request $request) {
        $request->validate(['content' => 'required|string|max:280']);

        $post = Post::create([
            'content' => $request->content,
            'user_id' => $request->user()->id // L'ID de l'utilisateur connecté
        ]);

        return response($post->load('user'), 201);
    }
}