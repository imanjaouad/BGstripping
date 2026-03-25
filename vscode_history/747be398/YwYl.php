<!DOCTYPE html>
<html lang="fr">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Modifier le secteur - AdminKit</title>

    {{-- Utilisation de asset() pour que le CSS charge correctement --}}
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</head>

<body>
	<div class="wrapper">
        {{-- MENU GAUCHE (SIDEBAR) --}}
		<nav id="sidebar" class="sidebar js-sidebar">
			<div class="sidebar-content js-simplebar">
				<a class="sidebar-brand" href="/">
                  <span class="align-middle">AdminKit</span>
                </a>
				<ul class="sidebar-nav">
					<li class="sidebar-header">Menu</li>
					<li class="sidebar-item">
						<a class="sidebar-link" href="/"> {{-- Lien vers le Dashboard --}}
                            <i class="align-middle" data-feather="grid"></i> <span class="align-middle">Secteurs</span>
                        </a>
					</li>
				</ul>
			</div>
		</nav>

		<div class="main">
            {{-- BARRE DU HAUT (NAVBAR) --}}
			<nav class="navbar navbar-expand navbar-light navbar-bg">
				<a class="sidebar-toggle js-sidebar-toggle">
                  <i class="hamburger align-self-center"></i>
                </a>
			</nav>

            {{-- CONTENU PRINCIPAL --}}
			<main class="content">
				<div class="container-fluid p-0">

					<h1 class="h3 mb-3">Modifier le secteur</h1>

					<div class="row">
						<div class="col-12 col-xl-6">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title">Formulaire de modification</h5>
                                    <h6 class="card-subtitle text-muted">Modification de : {{ $sector->name }}</h6>
								</div>
								<div class="card-body">
                                    
                                    {{-- FORMULAIRE DE MODIFICATION --}}
                                    {{-- 1. Action vers la route update --}}
									<form action="{{ route('sectors.update', $sector->id) }}" method="POST">
                                        @csrf
                                        @method('PUT') {{-- 2. Obligatoire pour modifier --}}

                                        <div class="mb-3">
                                            <label class="form-label">Nom du secteur</label>
                                            {{-- 3. On affiche l'ancien nom dans value="" --}}
                                            <input type="text" name="name" class="form-control" value="{{ $sector->name }}" required>
                                        </div>
            
                                        <div class="mb-3">
                                            <label class="form-label">Description</label>
                                            {{-- 4. On affiche l'ancienne description entre les balises --}}
                                            <textarea name="description" class="form-control" rows="5">{{ $sector->description }}</textarea>
                                        </div>
            
                                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                                        
                                        {{-- Bouton Annuler qui ramène au Dashboard --}}
                                        <a href="/" class="btn btn-secondary">Annuler</a>
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