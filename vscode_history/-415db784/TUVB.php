@extends('layouts.layout')

@section('title', 'Liste des produits')

@section('content')

<style>
    .product {
        border: 1px solid #000;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>

<div class="list-products">
    <h2>Liste des produits</h2>

    <ul>
        @foreach($products as $product)
            <div class="product">
                <li>id : {{ $product->id }}</li>
                <li>name : {{ $product->name }}</li>
                <li>prix : {{ $product->price }}</li>
                <li>qte : {{ $product->qte }}</li>
            </div>
        @endforeach
    </ul>
</div>

@endsection