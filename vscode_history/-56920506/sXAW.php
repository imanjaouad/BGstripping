<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        form {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
}

form div {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="text"],
input[type="number"],
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

textarea {
    height: 80px;
    resize: vertical;
}

button {
    padding: 10px 20px;
    background-color: #007BFF;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
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

