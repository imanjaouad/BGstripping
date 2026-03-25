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
