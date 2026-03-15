@extends('layouts.simple')

@section('title', 'Ajouter un secteur')

@section('content')
    <h1>Ajouter un secteur</h1>

    <form action="{{ route('sectors.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Nom du secteur</label>
            <input type="text" name="name" id="name" class="form-control" required>
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea name="description" id="description" class="form-control" rows="5"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Ajouter</button>
    </form>
@endsection