@extends("layouts.main")

@section("content")

<div class="mb-3">
    <h1 class="h3 d-inline align-middle">Modifier le module :</h1>
</div>

<div class="row">
    <div class="col-12 col-lg-6">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0"></h5>
            </div>
            <div class="card-body">
                <form action="/moduless/{{ $module->id }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label">Nom du module </label>
                        <input type="text" name="name" class="form-control" value="{{ $module->name }}" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <input type="number" name="max" class="form-control" value="{{ $module->description }}" required min="1">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Masse horaire </label>
                        <input type="number" name="masshoraire" class="form-control" value="{{ $module->masshoraire }}" placeholder="X heure ... " required min="1">
                    </div>

                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                        <a href="/moduless" class="btn btn-secondary">Annuler</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection