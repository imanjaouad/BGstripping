@extends('layouts.main')

@section('content')

<div class="mb-3">
    <h1 class="h3 d-inline align-middle">Tableau de bord</h1>
</div>

<div class="row">
    <div class="col-12 d-flex">
        <div class="card flex-fill shadow-sm">
            <div class="card-header">
                <h5 class="card-title mb-0">Derniers Étudiants</h5>
            </div>
            <table class="table table-hover my-0">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th class="d-none d-xl-table-cell">École</th>
                        <th class="d-none d-md-table-cell">Secteur</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach(\App\Models\Student::with(['school', 'sector'])->latest()->take(10)->get() as $student)
                    <tr>
                        <td>{{ $student->first_name }}</td>
                        <td>{{ $student->last_name }}</td>
                        <td class="d-none d-xl-table-cell">{{ $student->school->name }}</td>
                        <td class="d-none d-md-table-cell">{{ $student->sector->name }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection