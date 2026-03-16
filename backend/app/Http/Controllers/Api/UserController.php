<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Liste tous les utilisateurs
    public function index(Request $request)
    {
        $query = User::query();

        // Recherche
        if($request->search){
            $query->where('username','like','%'.$request->search.'%');
        }

        // Filtre par role
        if($request->role){
            $query->where('role',$request->role);
        }

        // Filtre par mode_operation
        if($request->mode){
            $query->where('mode_operation',$request->mode);
        }

        return response()->json($query->get());
    }

    // Créer un nouvel utilisateur
    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required|unique:users',
            'password'=>'required|min:4',
            'mode_operation'=>'required',
            'role'=>'required'
        ]);

        $user = User::create([
            'username'=>$request->username,
            'password'=>Hash::make($request->password),
            'mode_operation'=>$request->mode_operation,
            'role'=>$request->role
        ]);

        return response()->json($user,201);
    }

    // Mettre à jour un utilisateur
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if($request->username){
            $user->username = $request->username;
        }
        if($request->password){
            $user->password = Hash::make($request->password);
        }
        if($request->mode_operation){
            $user->mode_operation = $request->mode_operation;
        }
        if($request->role){
            $user->role = $request->role;
        }

        $user->save();
        return response()->json($user);
    }

    // Supprimer un utilisateur
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(["message"=>"User deleted"]);
    }

}

