@extends('layouts.layout')

@section('title', 'Ajouter produit')

@section('content')
<div class="container-fluid">

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Ajouter un produit</h6>
        </div>
        <div class="card-body">
            <form method="post" action="/products">
                @csrf
                <div class="form-group">
                    <label for="name">Nom du produit :</label>
                    <input type="text" name="name" id="name" class="form-control">
                </div>

                <div class="form-group">
                    <label for="description">Description du produit :</label>
                    <textarea name="description" id="description" class="form-control"></textarea>
                </div>

                <div class="form-group">
                    <label for="price">Prix du produit :</label>
                    <input type="number" name="price" id="price" step="0.01" class="form-control">
                </div>

                <div class="form-group">
                    <label for="qte">Quantité du produit :</label>
                    <input type="number" name="qte" id="qte" class="form-control">
                </div>

                <button type="submit" class="btn btn-primary">Ajouter le produit</button>
            </form>
        </div>
    </div>

</div>
@endsection