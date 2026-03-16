@extends('layouts.main')
@section('content')
                                    <form action="/schools" method="post>
                                       @csrf
										<div class="mb-3">
											<label class="form-label">school name</label>
											<input class="form-control form-control-lg" type="text" name="name" placeholder="Enter your name" />
										</div>
										<div class="mb-3">
											<label class="form-label">capacité (max)</label>
											<input class="form-control form-control-lg" type="number" name="max" placeholder="Enter your email" />
										</div>
										
										<div class="d-grid gap-2 mt-3">
											<button type="submit" class="btn btn-primary btn-lg">Ajouter</button>										</div>
									</form>
@endsection