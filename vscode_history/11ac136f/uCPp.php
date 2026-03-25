<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Module;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modules = Module::all();
        return view("modules.index", ["modules" => $modules]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("modules.create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required',
        'description' => 'required',
        'masshoraire' => 'required',
    ]);

    Module::create([
        'nom' => $request->nom,
        'description' => $request->description,
        'masshoraire' => $request->masshoraire,
    ]);

    return redirect('/modules');
}

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        return view("modules.show", ["module" => $module]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        return view("modules.edit", ["module" => $module]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        $request->validate([
            'nom' => 'required|string|max:50',
            'description' => 'required|string|max:50',
            'masshoraire' => 'required|integer|max:500',
        ]);

        $module->update($request->all());

        return redirect('/modules');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();
        return redirect('/modules');
    }
}