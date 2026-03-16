<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des produits</title>
    <style>
       
div {
    margin-bottom: 10px;
    background-color:grey;
    border:2px solid black;
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
