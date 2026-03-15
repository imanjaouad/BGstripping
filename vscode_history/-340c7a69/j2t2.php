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
                    <td>{{$school->id}}</td>
                    <td>{{$school->name}}</td>
                    <td>{{$school->max}}</td>
                    <td>{{$school->created_at}}</td>
                    <td>{{$school->updated_at}}</td>


                    <td>
                        <a href="/schools/create" class="btn btn-primary btn-sm">
                            Edit
                        </a>

                        <form action="" method="POST" style="display:inline;">
                            @csrf
                            @method('delete')
                            <button class="btn btn-danger btn-sm">
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