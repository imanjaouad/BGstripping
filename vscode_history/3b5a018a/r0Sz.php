@extends('layouts.main')

@section('title', 'Create Sector')

@section('content')
<div class="container mt-5">
    <h1>Create Sector</h1>
    <p>Fill in the form to create a new sector</p>

    <form action="{{ route('sectors.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label">Sector Name</label>
            <input type="text" name="name" class="form-control" placeholder="Enter sector name" required>
        </div>
        <button type="submit" class="btn btn-primary">Create Sector</button>
    </form>

    <a href="{{ route('sectors.index') }}" class="btn btn-secondary mt-3">Back to sectors list</a>
</div>
@endsection