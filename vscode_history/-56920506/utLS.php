<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    form {
    margin: 20px;
    font-family: Arial, sans-serif;
}

div {
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 3px;
}

input, textarea, button {
    padding: 5px;
    width: 40%;
    box-sizing: border-box;
}

    </style>
</head>
<body>
    <form method="post" action="/products">
    @csrf
    <div>
        <label for="name">Nom du produit :</label>
        <input type="text" name="name" id="name">
    </div>

    <div>
        <label for="description">Description du produit :</label>
        <textarea name="description" id="description"></textarea>
    </div>

    <div>
        <label for="price">Prix du produit :</label>
        <input type="number" name="price" id="price" step="0.01">
    </div>

    <div>
        <label for="qte">Quantité du produit :</label>
        <input type="number" name="qte" id="qte">
    </div>

    <div>
        <button type="submit">Ajouter le produit</button>
    </div>
</form>

</body>
</html>

