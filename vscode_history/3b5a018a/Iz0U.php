<!DOCTYPE html>
<html lang="fr">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Ajouter un secteur - AdminKit</title>

    {{-- Utilisation de asset() pour que le CSS charge correctement --}}
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</head>

<body>
	<div class="wrapper">
        {{-- SIDEBAR (Menu Gauche) --}}
		<nav id="sidebar" class="sidebar js-sidebar">
			<div class="sidebar-content js-simplebar">
				<a class="sidebar-brand" href="{{ route('sectors.index') }}">
                  <span class="align-middle">AdminKit</span>
                </a>
				<ul class="sidebar-nav">
					<li class="sidebar-header">Menu</li>
					<li class="sidebar-item">
						<a class="sidebar-link" href="{{ route('sectors.index') }}">
                            <i class="align-middle" data-feather="grid"></i> <span class="align-middle">Secteurs</span>
                        </a>
					</li>
				</ul>
			</div>
		</nav>

		<div class="main">
			<nav class="navbar navbar-expand navbar-light navbar-bg">
				<a class="sidebar-toggle js-sidebar-toggle">
                  <i class="hamburger align-self-center"></i>
                </a>
			</nav>


			<main class="content">
				<div class="container-fluid p-0">

					<h1 class="h3 mb-3">Ajouter un nouveau secteur</h1>

					<div class="row">
						<div class="col-12 col-xl-6">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title">Formulaire de création</h5>
								</div>
								<div class="card-body">
                                    
									<form action="{{ route('sectors.store') }}" method="POST">
                                        @csrf
                                        <div class="mb-3">
                                            <label class="form-label">Nom du secteur</label>
                                            <input type="text" name="name" class="form-control" placeholder="Nom du secteur" required>
                                        </div>
            
                                        <div class="mb-3">
                                            <label class="form-label">Description</label>
                                            <textarea name="description" class="form-control" rows="5" placeholder="Description..."></textarea>
                                        </div>
										
                                        <button type="submit" class="btn btn-primary">Ajouter</button>
                                        <a href="{{ route('sectors.index') }}" class="btn btn-secondary">Annuler</a>
                                    </form>

								</div>
							</div>
						</div>
					</div>

				</div>
			</main>

			<footer class="footer">
				<div class="container-fluid">
					<div class="row text-muted">
						<div class="col-6 text-start">
							<p class="mb-0"><strong>AdminKit</strong> &copy;</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</div>

	<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>