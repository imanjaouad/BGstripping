<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des produits</title>
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
            width: 20%;
            box-sizing: border-box;
        }

        ul {
            list-style-type: none;
        }

        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="list-products">
        <h2>Liste des produits</h2>
        <ul>
            @foreach($products as $product)
                <li><strong>Nom :</strong> {{ $product->name }}</li>
                <li><strong>Description :</strong> {{ $product->description }}</li>
                <li><strong>Prix :</strong> {{ $product->price }}</li>
                <li><strong>Quantité :</strong> {{ $product->qte }}</li>
                <hr>
            @endforeach
        </ul>
    </div>
</body>
</html>
