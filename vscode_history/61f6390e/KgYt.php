<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // <--- INDISPENSABLE
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <--- INDISPENSABLE
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request) {
        try {
            $fields = $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|min:4'
            ]);

            $user = User::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => Hash::make($fields['password']) // On utilise Hash::make
            ]);

            $token = $user->createToken('socialtoken')->plainTextToken;

            return response(['user' => $user, 'token' => $token], 201);
            
        } catch (\Exception $e) {
            // Si ça plante encore, on veut savoir pourquoi dans les logs
            Log::error($e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $user->createToken('socialtoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response(['message' => 'Déconnecté'], 200);
    }
}