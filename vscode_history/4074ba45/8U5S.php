<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Profil utilisateur</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f2f2f2;
        }
        .card {
            width: 350px;
            margin: 80px auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .card h2 {
            text-align: center;
            margin-bottom: 15px;
        }
        .info {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="card">
    <h2>Carte de profil</h2>

    <div class="info">
        <span class="label">Nom :</span>
        {{ $user->name }}
    </div>

    <div class="info">
        <span class="label">Email :</span>
        {{ $user->email }}
    </div>
    <div class="info">
        <span class="label">Password :</span>
        {{ $user->password}}
    </div>
</div>

</body>
</html>
