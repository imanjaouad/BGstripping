@extends("layouts.main")

@section("content")

<h2>Editer école</h2>

<form action="/schools/{{ $school->id }}" method="POST">
    
    @csrf
    @method('PUT')  {{-- ضروري باش Laravel يعرف هاد الفورم update --}}

    <div class="mb-3">
        <label class="form-label">School name</label>
        <input class="form-control form-control-lg" 
               type="text" 
               name="name" 
               value="{{ $school->name }}"  
               required>
    </div>

    <div class="mb-3">
        <label class="form-label">Max</label>
        <input class="form-control form-control-lg" 
               type="number" 
               name="max" 
               value="{{ $school->max }}"  
               required 
               max="200" 
               min="1">
    </div>

    <button type="submit" class="btn btn-primary btn-lg">
        Update
    </button>

</form>

@endsection