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
    width: 20%;
    box-sizing: border-box;
}

    </style>
</head>
<body>
    <div class="list-products">

    @foreach($products as products)
    <li>{{product->name}}</li>

    
    
</div>

</body>
</html>

