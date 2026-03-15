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


    return view('sector.show',['sector'->$sector]);
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
    return view('sectors.edit', compact('sector'));
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
          $sector = Sector::findOrFail($id);
          $sector->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        return redirect('/')->with('Secteur modifié !');

    }

    /**
     * Remove the specified resource from storage.
     */
     public function destroy($id)
    {

        $sector = Sector::findOrFail($id);

        $sector->delete();
        return redirect('/')->with('Secteur supprimé !');
    }
}
