@extends('layouts.main')

@section('content')
<main class="d-flex w-100">
    <div class="container d-flex flex-column">
        <div class="row vh-100">
            <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">

                    <div class="text-center mt-4">
                        <h1 class="h2">Create Sector</h1>
                        <p class="lead">
                            Fill in the form to create a new sector
                        </p>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <div class="m-sm-3">
                                <!-- Formulaire Laravel -->
                                <form action="{{ route('sectors.store') }}" method="POST">
                                    @csrf
                                    <div class="mb-3">
                                        <label class="form-label">Sector Name</label>
                                        <input class="form-control form-control-lg" type="text" name="name" placeholder="Enter sector name" required />
                                    </div>
                                    <div class="d-grid gap-2 mt-3">
                                        <button type="submit" class="btn btn-lg btn-primary">Create Sector</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mb-3">
                        <a href="{{ route('sectors.index') }}">Back to sectors list</a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>
@endsection