<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schools= School::all();
        return view("schools.index",["schools"=>$schools]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("schools.create");
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        School::create($request->all());
        return redirect('/schools');
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(School $school)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, School $school)
{
    // خذ القيمة من الفورم، إلا ما جاتش استعمل القيمة القديمة
    $school->name 
    $school->max  

    $school->save();

    return redirect("/schools");


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school)
    {
        //
    }
}
