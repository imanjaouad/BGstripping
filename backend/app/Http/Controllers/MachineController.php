<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Machine::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:machines,name'],
        ]);

        $machine = Machine::create([
            'name' => trim($validated['name']),
        ]);

        return response()->json([
            'message' => 'Machine ajoutee avec succes.',
            'data' => $machine,
        ], 201);
    }
}
