<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des Secteurs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des Secteurs</h1>
        <a href="{{ route('sectors.create') }}" class="btn btn-primary">Ajouter un secteur</a>
    </div>

    {{-- Message de succès si on vient d'ajouter/modifier/supprimer --}}
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sectors as $sector)
            <tr>
                <td>{{ $sector->id }}</td>
                <td>{{ $sector->name }}</td>
                <td>{{ $sector->description }}</td>
                <td>
                    <div class="d-flex gap-2">
                        <!-- BOUTON MODIFIER -->
                        <!-- On envoie l'ID du secteur dans la route -->
                        <a href="{{ route('sectors.edit', $sector->id) }}" class="btn btn-sm btn-warning">Modifier</a>

                        <!-- BOUTON SUPPRIMER -->
                        <!-- Attention : Pour supprimer, il faut un formulaire, pas juste un lien -->
                        <form action="{{ route('sectors.destroy', $sector->id) }}" method="POST" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger">Supprimer</button>
                        </form>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

</body>
</html>