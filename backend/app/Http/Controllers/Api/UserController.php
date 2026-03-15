<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Obtenir tous les utilisateurs
     * POST /api/users
     */
    public function index(Request $request)
    {
        // Vérification de sécurité (optionnel si middleware déjà en place)
        $user = Auth::user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $users = User::all();
        return response()->json($users);
    }

    /**
     * Créer un nouvel utilisateur
     * POST /api/users
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:4',
            'role' => 'required|in:admin,limited',
            'modeOpiration' => 'required|in:poussage,casement,transport,all',
        ]);

        $newUser = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'modeOpiration' => $validated['modeOpiration'],
        ]);

        return response()->json([
            'success' => true,
            'user' => $newUser
        ], 201);
    }

    /**
     * Mettre à jour un utilisateur existant
     * PUT /api/users/{id}
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $userToUpdate = User::findOrFail($id);

        $validated = $request->validate([
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'password' => 'nullable|string|min:4',
            'role' => 'sometimes|in:admin,limited',
            'modeOpiration' => 'sometimes|in:poussage,casement,transport,all',
        ]);

        if (isset($validated['username'])) {
            $userToUpdate->username = $validated['username'];
        }
        if (isset($validated['role'])) {
            $userToUpdate->role = $validated['role'];
        }
        if (isset($validated['modeOpiration'])) {
            $userToUpdate->modeOpiration = $validated['modeOpiration'];
        }
        if (!empty($validated['password'])) {
            $userToUpdate->password = Hash::make($validated['password']);
        }

        $userToUpdate->save();

        return response()->json([
            'success' => true,
            'user' => $userToUpdate
        ]);
    }

    /**
     * Supprimer un utilisateur
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, $id)
    {
        $user = Auth::user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $userToDelete = User::findOrFail($id);
        
        // Empêcher l'admin de se supprimer lui-même ? (optionnel)
        if ($user && $userToDelete->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $userToDelete->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
