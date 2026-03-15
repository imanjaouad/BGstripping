@extends('layouts.main')

@section('content')

<div class="container mt-4">

    <h2 class="mb-4">Liste des écoles</h2>

    <a href="/schools/create" class="btn btn-success mb-3">
        Ajouter une école
    </a>

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Max</th>
                <th>Created at</th>
                <th>Updated at</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($schools as $school)
                <tr>
                    <td>{{ $school->id }}</td>
                    <td>{{ $school->name }}</td>
                    <td>{{ $school->max }}</td>
                    <td>{{ $school->created_at }}</td>
                    <td>{{ $school->updated_at }}</td>

                    <td>
                        <!-- Edit button -->
                        <a href="/schools/{{ $school->id }}/edit" class="btn btn-primary btn-sm">
                            Edit
                        </a>

                        <!-- Delete button -->
                       <a href="/schools/{{ $school->id }}/edit" class="btn btn-primary btn-sm">Edit</a>
                            @csrf
                            @method('DELETE') {{-- مهم، بدل 'delete' بصيغة صحيحة --}}
                            <button class="btn btn-danger btn-sm" onclick="return confirm('Voulez-vous vraiment supprimer cette école ?')">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

</div>

@endsection