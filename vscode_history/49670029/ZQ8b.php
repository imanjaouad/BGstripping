<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des stagiaires</title>
</head>
<body>

    <h1>Liste des stagiaires</h1>

    @foreach ($stagiaires as $stagiaire)
        <p>
            ID: {{ $stagiaire->id }}<br>
            Nom: {{ $stagiaire->nom }}<br>
            Prénom: {{ $stagiaire->prenom }}
        </p>
        <hr>
    @endforeach
    @if(session('success'))
    <div style="color: green; font-weight: bold; margin-bottom: 20px;">
        {{ session('success') }}
    </div>
@endif

</body>
</html>
