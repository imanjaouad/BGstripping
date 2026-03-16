@extends("layouts.main")

@section("content")

<form action="/sectors" method="POST">
    
    @csrf

    <div class="mb-3">
        <label class="form-label">Sector name</label>
        <input class="form-control form-control-lg" type="text" name="name"/>
    </div>

    <button type="submit" class="btn btn-primary btn-lg">
        Ajouter
    </button>

</form>

@endsection