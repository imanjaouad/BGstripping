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
            {{-- Boucle pour afficher chaque secteur --}}
            @foreach($sectors as $sector)
            <tr>
                <td>{{ $sector->id }}</td>
                <td>{{ $sector->name }}</td>
                <td>{{ $sector->description }}</td>
                <td>
                    <!-- Boutons d'action (Modifier/Supprimer) -->
                    <a href="#" class="btn btn-sm btn-warning">Modifier</a>
                    <a href="#" class="btn btn-sm btn-danger">Supprimer</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

</body>
</html>