<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sectors = Sector::all();
        return view('sectors.index', compact('sectors'));
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('sectors.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{

    Sector::create($request->all());


    return redirect()->route('sectors.index');
}

    /**
     * Display the specified resource.
     */
    public function show(Sector $sector)
    {
        return view('sector.show',['sector'->$sector]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
{
    $sector = Sector::findOrFail($id);
    return view('sectors.edit', compact('sector')); // <--- Très important
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sector $sector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sector $sector)
    {
        $sector->delete();

        return redirect()->route('sectors.index')
                         ->with('success', 'Secteur supprimé avec succès.');
    }
}
