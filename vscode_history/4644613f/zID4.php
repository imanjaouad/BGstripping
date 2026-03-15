@extends("layouts.main")

@section("content")

<div class="mb-3">
    <h1 class="h3 d-inline align-middle">Nouvelle école</h1>
</div>

<div class="row">
    <div class="col-12 col-lg-6">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0"></h5>
            </div>
            <div class="card-body">
                <form action="/schools" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nom de l'école</label>
                        <input type="text" name="name" class="form-control" placeholder="Ex: École Polytechnique" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Capacité maximale (Max)</label>
                        <input type="number" name="max" class="form-control" placeholder="Ex: 100" required min="1">
                    </div>

                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                        <a href="/schools" class="btn btn-secondary">Annuler</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection