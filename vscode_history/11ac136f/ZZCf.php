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
        $modules= Module::all();
        return view("modules.index",["modules"=>$modules]);
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
        'name'=>'required|string|max:50',
        'description'=>'required|string|max:50',
        'masshoraire'=>'required|string|max:50',
    ]);
    Module::create($request->all());
    return redirect("/modules");
}
    /**
     * 
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view(modules.edit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        $request->validate([
            'name'=>'required'|'string'|'max:50',
            'description'=>'required'|'string'|'max:50',
            'masshoraire'=>'required'|'string'|'max:50',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();
        return redirect("/modules");
    }
}
