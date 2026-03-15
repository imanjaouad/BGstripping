<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Body: { username, password, modeOpiration }
     */
   public function login(Request $request)
{
    $request->validate([
        'username'     => 'required|string',
        'password'     => 'required|string',
        'modeOpiration' => 'required|in:poussage,casement,transport',
    ]);

    // Authentification avec username 
    $credentials = $request->only('username', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'success' => false,
            'message' => 'Identifiant ou mot de passe incorrect.',
        ], 401);
    }

    $user = Auth::user();

    // Vérification du mode
    if ($user->role !== 'admin' && $user->modeOpiration !== $request->modeOpiration) {
        Auth::logout();
        return response()->json([
            'success' => false,
            'message' => 'Accès refusé : mode opération non autorisé.',
        ], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'            => $user->id,
            'username'      => $user->username,
            'role'          => $user->role,
            'modeOpiration' => $user->modeOpiration,
        ],
    ]);
}

    /**
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * GET /api/me
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user'    => [
                'id'            => $user->id,
                'username'      => $user->username,
                'role'          => $user->role,
                'modeOpiration' => $user->modeOpiration,
            ],
        ]);
    }
}