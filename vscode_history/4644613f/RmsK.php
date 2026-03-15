@extends("layouts.main")
@section("content")
<form action="/schools" method="post">
										<div class="mb-3">
											<label class="form-label">school name</label>
											<input class="form-control form-control-lg" type="text" name="name"/>
										</div>
										<div class="mb-3">
											<label class="form-label">max</label>
											<input class="form-control form-control-lg" type="number" name="max"/>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-lg"> Ajouter</button>
									</form>
@endsection