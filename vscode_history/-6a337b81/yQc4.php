@extends("layouts.main")

@section("content")

<h2>Editer secteur</h2>

<form action="/sectors/{{ $sector->id }}" method="POST">
    
    @csrf
    @method('PUT')  {{-- ضروري باش Laravel يعرف update --}}

    <div class="mb-3">
        <label class="form-label">Nom du secteur</label>
        <input class="form-control form-control-lg" 
               type="text" 
               name="name" 
               value="{{ $sector->name }}"  
               required>
    </div>

    <button type="submit" class="btn btn-primary btn-lg">
        Update
    </button>

</form>

@endsection