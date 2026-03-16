@extends("layouts.main")

@section("content")

<form action="/schools" method="POST">
    
    @csrf

    <div class="mb-3">
        <label class="form-label">School name</label>
        <input class="form-control form-control-lg" type="text" name="name"/>
    </div>

    <div class="mb-3">
        <label class="form-label">Max</label>
        <input class="form-control form-control-lg" type="number" name="max"/>
    </div>

    <button type="submit" class="btn btn-primary btn-lg">
        Ajouter
    </button>

</form>

@endsection