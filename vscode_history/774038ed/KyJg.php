<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 50px;
        }
        form {
            background-color: #fff;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 400px;
            margin: auto;
        }
        form div {
            margin-bottom: 15px;
        }
        label {
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 8px 10px;
            margin-top: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        button {
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <form action="post">
        <div>
        <label for="">Nom</label><br>
    <input type="text"><br>
        <label for="">Prenom</label><br>
    <input type="text"><br>
    <button type="submit">Ajouter</button>
        </div>
    </form>
</body>
</html>
