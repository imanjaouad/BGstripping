<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request) {
    try {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:4' // On baisse à 4 caractères pour tester
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password'])
        ]);

        $token = $user->createToken('socialtoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 201);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        // Si la validation échoue, Laravel va nous renvoyer les détails exacts
        return response()->json(['errors' => $e->errors()], 422);
    }
}


    // connexion : 

    public function login(request $request){
        $fields = $request->validate([
            'email'=>'required|string',
            'password'=>'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'=>'Identifiants incorrects'
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;
        return response ([
            'user'=>$user, 'token'=>$token],200);
        
    }

    // déconnexion :

    public function logout(request $request){
        $request->user()->currentAccessToken()->delete();
        return response(['message'=>'deconnexion effectuée'],200);
    }
}
