<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier un secteur</title>
    {{-- J'ajoute Bootstrap via Internet pour que le style fonctionne sans rien installer --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

    <div class="container mt-5">
        <h1>Modifier le secteur : {{ $sector->name }}</h1>

        <!-- 1. CHANGE LA ROUTE : On va vers 'update' et on donne l'ID du secteur -->
        <form action="{{ route('sectors.update', $sector->id) }}" method="POST">
            
            @csrf
            
            <!-- 2. AJOUTE CETTE LIGNE : C'est obligatoire pour dire à Laravel que c'est une modification -->
            @method('PUT')

            <div class="mb-3">
                <label for="name" class="form-label">Nom du secteur</label>
                <!-- 3. AJOUTE VALUE : Pour afficher le nom actuel dans la case -->
                <input type="text" name="name" id="name" class="form-control" value="{{ $sector->name }}" required>
            </div>

            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <!-- 4. METS LE TEXTE ICI : Pour le textarea, la valeur se met entre les balises -->
                <textarea name="description" id="description" class="form-control" rows="5">{{ $sector->description }}</textarea>
            </div>

            <button type="submit" class="btn btn-warning">Modifier</button>
            <a href="{{ route('sectors.index') }}" class="btn btn-secondary">Annuler</a>
        </form>
    </div>

</body>
</html>