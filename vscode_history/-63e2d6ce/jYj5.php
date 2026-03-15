<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="Responsive Admin &amp; Dashboard Template based on Bootstrap 5">
	<meta name="author" content="AdminKit">
	<meta name="keywords" content="adminkit, bootstrap, bootstrap 5, admin, dashboard, template, responsive, css, sass, html, theme, front-end, ui kit, web">

	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link rel="shortcut icon" href="img/icons/icon-48x48.png" />

	<link rel="canonical" href="https://demo-basic.adminkit.io/" />

	<title>AdminKit Demo - Bootstrap 5 Admin Template</title>

	<link href="/css/app.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
	<style>
		/* Barre latérale (Sidebar) - Reste Noire avec texte Blanc éclatant */
		#sidebar, .sidebar-content {
			background: #222e3c !important;
		}
		
		.sidebar-brand, .sidebar-brand span, .sidebar-link, .sidebar-header, .sidebar-item i {
			color: #ffffff !important;
			opacity: 1 !important;
		}
		
		.sidebar-link:hover {
			background: rgba(255, 255, 255, .1) !important;
		}

		.sidebar-item.active .sidebar-link {
			background: rgba(255, 255, 255, .2) !important;
			color: #ffffff !important;
		}

		/* Zone Principale (Main) - Fond Blanc et texte NOIR pur */
		body, .wrapper, .main, .content {
			background: #ffffff !important;
			background-color: #ffffff !important;
			color: #000000 !important;
		}

		/* Titres et Textes en NOIR pour être bien visibles */
		h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, p, td, th, label, div {
			color: #000000 !important;
		}

		.table {
			background-color: #ffffff !important;
			color: #000000 !important;
		}

		.table-dark th {
			background-color: #333 !important;
			color: #ffffff !important;
		}
	</style>
</head>

<body>
	<div class="wrapper">
		<nav id="sidebar" class="sidebar js-sidebar">
			<div class="sidebar-content js-simplebar">
				<a class="sidebar-brand" href="index.html">
          <span class="align-middle">AdminKit</span>
        </a>

				<ul class="sidebar-nav">
					<li class="sidebar-header">
						Pages
					</li>

					<li class="sidebar-item {{ Request::is('/') ? 'active' : '' }}">
						<a class="sidebar-link" href="/">
							<i class="align-middle" data-feather="sliders"></i> <span class="align-middle">Tableau de bord</span>
						</a>
					</li>

					<li class="sidebar-item {{ Request::is('schools*') ? 'active' : '' }}">
						<a class="sidebar-link" href="/schools">
							<i class="align-middle" data-feather="home"></i> <span class="align-middle">Ecoles</span>
						</a>
					</li>

					<li class="sidebar-item {{ Request::is('sectors*') ? 'active' : '' }}">
						<a class="sidebar-link" href="/sectors">
							<i class="align-middle" data-feather="grid"></i> <span class="align-middle">Secteurs</span>
						</a>
					</li>

					<li class="sidebar-item {{ Request::is('students*') ? 'active' : '' }}">
						<a class="sidebar-link" href="/students">
							<i class="align-middle" data-feather="users"></i> <span class="align-middle">Etudiants</span>
						</a>
					</li>

					<li class="sidebar-item">
						<a class="sidebar-link" href="/modules">
							<i class="align-middle" data-feather="user"></i> <span class="align-middle">Modules</span>
						</a>
					</li>

					<li class="sidebar-header">
						Outils & Composants
					</li>

					<li class="sidebar-item">
						<a class="sidebar-link" href="/not-found">
							<i class="align-middle" data-feather="square"></i> <span class="align-middle">Boutons</span>
						</a>
					</li>

					<li class="sidebar-item">
						<a class="sidebar-link" href="/not-found">
							<i class="align-middle" data-feather="check-square"></i> <span class="align-middle">Formulaires</span>
						</a>
					</li>

					<li class="sidebar-item">
						<a class="sidebar-link" href="/not-found">
							<i class="align-middle" data-feather="grid"></i> <span class="align-middle">Cartes</span>
						</a>
					</li>

					<li class="sidebar-header">
						Plugins & Addons
					</li>

					<li class="sidebar-item">
						<a class="sidebar-link" href="/not-found">
							<i class="align-middle" data-feather="bar-chart-2"></i> <span class="align-middle">Graphiques</span>
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

				<div class="navbar-collapse collapse">
					<ul class="navbar-nav navbar-align">
						<li class="nav-item dropdown">
							<a class="nav-icon dropdown-toggle" href="/not-found" id="alertsDropdown" data-bs-toggle="dropdown">
								<div class="position-relative">
									<i class="align-middle" data-feather="bell"></i>
									<span class="indicator">4</span>
								</div>
							</a>
							<div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="alertsDropdown">
								<div class="dropdown-menu-header">
									4 Nouvelles Notifications
								</div>
								<div class="list-group">
									<a href="/not-found" class="list-group-item">
										<div class="row g-0 align-items-center">
											<div class="col-2">
												<i class="text-danger" data-feather="alert-circle"></i>
											</div>
											<div class="col-10">
												<div class="text-dark">Mise à jour complétée</div>
												<div class="text-muted small mt-1">Le serveur a été redémarré.</div>
												<div class="text-muted small mt-1">Il y a 30m</div>
											</div>
										</div>
									</a>
								</div>
								<div class="dropdown-menu-footer">
									<a href="/not-found" class="text-muted">Voir toutes les notifications</a>
								</div>
							</div>
						</li>
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle d-none d-sm-inline-block" href="/not-found" data-bs-toggle="dropdown">
								<img src="/img/avatars/avatar.jpg" class="avatar img-fluid rounded me-1" alt="Admin User" onerror="this.src='https://ui-avatars.com/api/?name=Admin+User&background=222e3c&color=fff'"/> <span class="text-dark">Admin User</span>
							</a>
							<div class="dropdown-menu dropdown-menu-end">
								<a class="dropdown-item" href="/not-found"><i class="align-middle me-1" data-feather="user"></i> Profil</a>
								<a class="dropdown-item" href="/not-found"><i class="align-middle me-1" data-feather="settings"></i> Paramètres</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="/not-found">Se déconnecter</a>
							</div>
						</li>
					</ul>
				</div>
			</nav>

			<main class="content">
				<div class="container-fluid p-0">
					@yield('content')
				</div>
			</main>
		</div>
	</div>

	<script src="/js/app.js"></script>

	<script>
		document.addEventListener("DOMContentLoaded", function() {
			var ctx = document.getElementById("chartjs-dashboard-line").getContext("2d");
			var gradient = ctx.createLinearGradient(0, 0, 0, 225);
			gradient.addColorStop(0, "rgba(215, 227, 244, 1)");
			gradient.addColorStop(1, "rgba(215, 227, 244, 0)");
			// Line chart
			new Chart(document.getElementById("chartjs-dashboard-line"), {
				type: "line",
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					datasets: [{
						label: "Sales ($)",
						fill: true,
						backgroundColor: gradient,
						borderColor: window.theme.primary,
						data: [
							2115,
							1562,
							1584,
							1892,
							1587,
							1923,
							2566,
							2448,
							2805,
							3438,
							2917,
							3327
						]
					}]
				},
				options: {
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						intersect: false
					},
					hover: {
						intersect: true
					},
					plugins: {
						filler: {
							propagate: false
						}
					},
					scales: {
						xAxes: [{
							reverse: true,
							gridLines: {
								color: "rgba(0,0,0,0.0)"
							}
						}],
						yAxes: [{
							ticks: {
								stepSize: 1000
							},
							display: true,
							borderDash: [3, 3],
							gridLines: {
								color: "rgba(0,0,0,0.0)"
							}
						}]
					}
				}
			});
		});
	</script>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			// Pie chart
			new Chart(document.getElementById("chartjs-dashboard-pie"), {
				type: "pie",
				data: {
					labels: ["Chrome", "Firefox", "IE"],
					datasets: [{
						data: [4306, 3801, 1689],
						backgroundColor: [
							window.theme.primary,
							window.theme.warning,
							window.theme.danger
						],
						borderWidth: 5
					}]
				},
				options: {
					responsive: !window.MSInputMethodContext,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					cutoutPercentage: 75
				}
			});
		});
	</script>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			// Bar chart
			new Chart(document.getElementById("chartjs-dashboard-bar"), {
				type: "bar",
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					datasets: [{
						label: "This year",
						backgroundColor: window.theme.primary,
						borderColor: window.theme.primary,
						hoverBackgroundColor: window.theme.primary,
						hoverBorderColor: window.theme.primary,
						data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
						barPercentage: .75,
						categoryPercentage: .5
					}]
				},
				options: {
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							gridLines: {
								display: false
							},
							stacked: false,
							ticks: {
								stepSize: 20
							}
						}],
						xAxes: [{
							stacked: false,
							gridLines: {
								color: "transparent"
							}
						}]
					}
				}
			});
		});
	</script>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			var markers = [{
					coords: [31.230391, 121.473701],
					name: "Shanghai"
				},
				{
					coords: [28.704060, 77.102493],
					name: "Delhi"
				},
				{
					coords: [6.524379, 3.379206],
					name: "Lagos"
				},
				{
					coords: [35.689487, 139.691711],
					name: "Tokyo"
				},
				{
					coords: [23.129110, 113.264381],
					name: "Guangzhou"
				},
				{
					coords: [40.7127837, -74.0059413],
					name: "New York"
				},
				{
					coords: [34.052235, -118.243683],
					name: "Los Angeles"
				},
				{
					coords: [41.878113, -87.629799],
					name: "Chicago"
				},
				{
					coords: [51.507351, -0.127758],
					name: "London"
				},
				{
					coords: [40.416775, -3.703790],
					name: "Madrid "
				}
			];
			var map = new jsVectorMap({
				map: "world",
				selector: "#world_map",
				zoomButtons: true,
				markers: markers,
				markerStyle: {
					initial: {
						r: 9,
						strokeWidth: 7,
						stokeOpacity: .4,
						fill: window.theme.primary
					},
					hover: {
						fill: window.theme.primary,
						stroke: window.theme.primary
					}
				},
				zoomOnScroll: false
			});
			window.addEventListener("resize", () => {
				map.updateSize();
			});
		});
	</script>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			var date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
			var defaultDate = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
			document.getElementById("datetimepicker-dashboard").flatpickr({
				inline: true,
				prevArrow: "<span title=\"Previous month\">&laquo;</span>",
				nextArrow: "<span title=\"Next month\">&raquo;</span>",
				defaultDate: defaultDate
			});
		});
	</script>

</body>

</html>