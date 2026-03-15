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

        /* Simple style pour la liste */
        ul {
            margin: 20px;
            font-family: Arial, sans-serif;
            padding-left: 0;
        }

        li {
            margin-bottom: 5px;
        }

        .product {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="list-products">
        <h2>Liste des produits</h2>
        <ul>
            @foreach($products as $product)
                <li>id {{ $product->id }}</li>
                <li>name : {{ $product->name }}</li>
                <li>prix :{{ $product->price }}</li>
                <li>qte : {{ $product->qte }}</li>
                <hr>
            @endforeach
        </ul>
    </div>
</body>
</html>
