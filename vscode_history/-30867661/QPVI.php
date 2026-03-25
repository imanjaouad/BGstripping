@extends('layouts.main')

@section('content')

<div class="container mt-4">

    <h2 class="mb-4">Liste des modules</h2>

    <a href="/modules/create" class="btn btn-success mb-3">
        Ajouter une module
    </a>

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created at</th>
                <th>Updated at</th>
                <th>Masse horaire</th>



                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($modules as $module)
                <tr>
                    <td>{{ $module->id }}</td>
                    <td>{{ $module->nom }}</td>
                    <td>{{ $module->description }}</td>
                    <td>{{ $module->created_at }}</td>
                    <td>{{ $module->updated_at }}</td>
                    <td>{{ $module->masshoraire }}</td>

                    <td>
                        <!-- Edit button -->
                        <a href="/modules/{{ $module->id }}/edit" class="btn btn-primary btn-sm">
                            Edit
                        </a>

                        <!-- Delete button -->
                        <form action="/modules/{{ $module->id }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger btn-sm" onclick="return confirm('Voulez-vous vraiment supprimer ce module ?')">
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
