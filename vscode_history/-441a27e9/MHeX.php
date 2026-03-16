@php use Carbon\Carbon; @endphp
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BG STRIPPING - Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #27ae60;
            --primary-dark: #219150;
            --primary-light: #eafaf1;
            --warning: #f39c12;
            --danger: #e74c3c;
            --info: #3498db;
            --purple: #8e44ad;
            --bg-gray: #f4f7f6;
            --shadow: 0 4px 15px rgba(0,0,0,0.06);
            --radius: 12px;
        }

        * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; }
        body { background:var(--bg-gray); display:flex; min-height:100vh; }

        /* ===== SIDEBAR ===== */
        .sidebar { width:250px; background:var(--primary); color:white; position:fixed; height:100vh; z-index:100; display:flex; flex-direction:column; }
        .sidebar-header { padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; }
        .sidebar-logo {
            width: 160px;
            max-width: 100%;
            height: auto;
            display: block;
        }
        .sidebar-nav { padding-top:1.5rem; flex:1; }
        .sidebar-nav ul { list-style:none; }
        .sidebar-nav a { text-decoration:none; color:rgba(255,255,255,0.8); display:block; }
        .sidebar-nav li { padding:13px 25px; display:flex; align-items:center; gap:14px; transition:0.25s; border-left:4px solid transparent; font-size:0.95rem; }
        .sidebar-nav li:hover { background:rgba(255,255,255,0.12); color:white; }
        .sidebar-nav li.active { background:rgba(255,255,255,0.18); color:white; border-left-color:white; font-weight:600; }

        /* ===== MAIN ===== */
        .main-content { margin-left:250px; flex:1; padding:30px; }

        /* ===== PAGE HEADER ===== */
        .page-header {
            background:white; padding:18px 28px; border-radius:var(--radius);
            box-shadow:var(--shadow); margin-bottom:25px;
            display:flex; justify-content:space-between; align-items:center;
        }
        .page-title { color:var(--primary); font-size:1.4rem; font-weight:700; display:flex; align-items:center; gap:10px; }
        .header-right { display:flex; align-items:center; gap:20px; }
        .header-date { font-size:0.88rem; color:#888; font-weight:600; display:flex; align-items:center; gap:8px; background:#f8f9fa; padding:7px 14px; border-radius:20px; }

        /* ===== PROFILE DROPDOWN ===== */
        .user-profile-header { position:relative; padding-left:18px; border-left:1px solid #eee; }
        .user-trigger { display:flex; align-items:center; gap:10px; cursor:pointer; padding:6px 12px; border-radius:8px; transition:0.3s; }
        .user-trigger:hover { background:#f0fdf4; }
        .user-avatar-header {
            width:36px; height:36px; border-radius:50%;
            background:linear-gradient(135deg, var(--primary), #2ecc71);
            color:white; display:flex; align-items:center; justify-content:center;
            font-weight:800; font-size:0.9rem;
        }
        .user-name-header { font-size:0.9rem; font-weight:700; color:#333; }
        .user-trigger i.fa-chevron-down { font-size:0.7rem; color:#aaa; transition:0.3s; }
        .user-trigger.active i.fa-chevron-down { transform:rotate(180deg); }

        .profile-dropdown {
            position:absolute; top:calc(100% + 10px); right:0; width:230px;
            background:white; border-radius:12px; box-shadow:0 12px 30px rgba(0,0,0,0.12);
            border:1px solid #e8f5f0; padding:8px; display:none; z-index:1000;
            animation:fadeDown 0.25s ease;
        }
        .profile-dropdown.show { display:block; }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .dropdown-header { padding:12px 14px; border-bottom:1px solid #f0f0f0; margin-bottom:5px; }
        .dropdown-header-name { font-weight:700; color:#333; display:block; font-size:0.92rem; }
        .dropdown-header-email { font-size:0.75rem; color:#888; }
        .dropdown-item { display:flex; align-items:center; gap:12px; padding:11px 14px; color:#555; text-decoration:none; font-size:0.88rem; font-weight:500; border-radius:8px; transition:0.2s; }
        .dropdown-item:hover { background:var(--primary-light); color:var(--primary); }
        .dropdown-item i { width:16px; }
        .dropdown-divider { height:1px; background:#f0f0f0; margin:6px 0; }
        .dropdown-item.logout { color:var(--danger); }
        .dropdown-item.logout:hover { background:#fee2e2; color:#991b1b; }

        /* ===== KPI CARDS ===== */
        .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:25px; }
        .kpi-card {
            background:white; padding:22px; border-radius:var(--radius); box-shadow:var(--shadow);
            display:flex; align-items:center; gap:18px; border-top:4px solid var(--primary); transition:0.3s;
        }
        .kpi-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.1); }
        .kpi-icon { width:50px; height:50px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; color:white; flex-shrink:0; }
        .kpi-green  { border-top-color:var(--primary); }
        .kpi-green  .kpi-icon { background:linear-gradient(135deg, var(--primary), #2ecc71); }
        .kpi-blue   { border-top-color:var(--info); }
        .kpi-blue   .kpi-icon { background:linear-gradient(135deg, var(--info), #5dade2); }
        .kpi-orange { border-top-color:var(--warning); }
        .kpi-orange .kpi-icon { background:linear-gradient(135deg, var(--warning), #f1c40f); }
        .kpi-purple { border-top-color:var(--purple); }
        .kpi-purple .kpi-icon { background:linear-gradient(135deg, var(--purple), #a569bd); }
        .kpi-label { font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:600; letter-spacing:0.4px; margin-bottom:4px; }
        .kpi-value { font-size:1.45rem; font-weight:800; color:#333; }

        /* ===== CONTENT GRID ===== */
        .content-grid { display:grid; grid-template-columns:2fr 1fr; gap:22px; }

        /* ===== CARDS ===== */
        .card { background:white; border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; margin-bottom:22px; }
        .card-header {
            background:linear-gradient(135deg, var(--primary), var(--primary-dark));
            color:white; padding:16px 22px; font-weight:700; font-size:0.95rem;
            display:flex; align-items:center; gap:10px;
        }
        .card-body { padding:5px 0; }

        /* ===== ACTIVITY LIST ===== */
        .activity-item {
            display:flex; align-items:center; justify-content:space-between;
            padding:14px 22px; border-bottom:1px solid #f8f9fa; transition:0.2s;
        }
        .activity-item:last-child { border-bottom:none; }
        .activity-item:hover { background:#f9fffe; }
        .act-icon { width:38px; height:38px; border-radius:10px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0; margin-right:14px; }
        .act-info { flex:1; }
        .act-title { font-weight:700; font-size:0.92rem; color:#333; margin-bottom:3px; }
        .act-subtitle { color:#888; font-size:0.8rem; }
        .act-volume { color:var(--primary); font-weight:800; font-size:0.95rem; text-align:right; }
        .act-time { color:#aaa; font-size:0.75rem; margin-top:2px; text-align:right; }
        .empty-state { text-align:center; padding:40px 20px; color:#bbb; }
        .empty-state i { font-size:2rem; display:block; margin-bottom:10px; }

        /* ===== FLEET LIST ===== */
        .fleet-item {
            display:flex; align-items:center; justify-content:space-between;
            padding:13px 22px; border-bottom:1px solid #f8f9fa; transition:0.2s;
        }
        .fleet-item:last-child { border-bottom:none; }
        .fleet-item:hover { background:#f9fffe; }
        .fleet-icon { width:34px; height:34px; border-radius:8px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; margin-right:12px; color:#555; font-size:0.9rem; }
        .fleet-name { font-weight:700; font-size:0.9rem; color:#333; }
        .fleet-driver { font-size:0.78rem; color:#888; margin-top:2px; }

        /* Status badges */
        .status-badge { padding:5px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; display:inline-flex; align-items:center; gap:5px; }
        .status-marche { background:#d1fae5; color:#065f46; }
        .status-arret  { background:#fee2e2; color:#991b1b; }
        .status-inconnu { background:#f1f5f9; color:#64748b; }

        /* Card footer link */
        .card-footer { padding:14px 22px; border-top:1px solid #f0f0f0; text-align:center; }
        .card-footer a { color:var(--primary); font-size:0.88rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
        .card-footer a:hover { text-decoration:underline; }

        /* ===== INFO CARD ===== */
        .info-card {
            background:linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius:var(--radius); box-shadow:var(--shadow); padding:24px; color:white;
        }
        .info-card h3 { font-size:1rem; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .info-card p { font-size:0.85rem; line-height:1.7; opacity:0.9; }
        .info-card .info-stat { margin-top:15px; display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.12); border-radius:8px; padding:12px; }
        .info-card .info-stat i { font-size:1.2rem; }
    </style>
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">
        <img src="{{ asset('images/ChatGPT_Image_3_mars_2026__12_36_56-removebg-preview (1).png') }}" alt="BG STRIPPING" class="sidebar-logo">
    </div>
    <nav class="sidebar-nav">
        <ul>
            <a href="{{ route('dashboard') }}"><li class="active"><i class="fa-solid fa-house"></i> Dashboard</li></a>
            <a href="{{ route('poussage') }}"><li><i class="fa-solid fa-truck-fast"></i> Mode Poussage</li></a>
            <a href="{{ route('statistiques.index') }}"><li><i class="fa-solid fa-chart-line"></i> Statistiques</li></a>
            <a href="{{ route('rapports.index') }}"><li><i class="fa-solid fa-file-invoice"></i> Rapports</li></a>
            <a href="{{ route('personnel.index') }}"><li><i class="fa-solid fa-gears"></i> Paramètres</li></a>
        </ul>
    </nav>
</div>

<main class="main-content">

    {{-- ===== HEADER ===== --}}
    <header class="page-header">
        <h1 class="page-title"><i class="fa-solid fa-house"></i> Tableau de Bord</h1>

        <div class="header-right">
            <div class="header-date">
                <i class="fa-regular fa-clock"></i> {{ date('H:i') }} | {{ date('d/m/Y') }}
            </div>

            <div class="user-profile-header" id="userDropdownContainer">
                <div class="user-trigger" id="userTrigger">
                    <div class="user-avatar-header">{{ strtoupper(substr(Auth::user()->name ?? 'U', 0, 1)) }}</div>
                    <div class="user-name-header">{{ Auth::user()->name ?? 'Utilisateur' }}</div>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>

                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-header">
                        <span class="dropdown-header-name">{{ Auth::user()->name ?? 'Utilisateur' }}</span>
                        <span class="dropdown-header-email">{{ Auth::user()->email ?? '' }}</span>
                    </div>
                    <a href="{{ route('profile.show') }}" class="dropdown-item">
                        <i class="fa-regular fa-user"></i> Mon Compte
                    </a>
                    <a href="{{ route('personnel.index') }}" class="dropdown-item">
                        <i class="fa-solid fa-gears"></i> Paramètres
                    </a>
                    <div class="dropdown-divider"></div>
                    <form action="{{ route('logout') }}" method="POST" style="margin:0;">
                        @csrf
                        <button type="submit" class="dropdown-item logout" style="width:100%; border:none; background:none; cursor:pointer; text-align:left;">
                            <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </header>

    {{-- ===== KPI CARDS ===== --}}
    <div class="kpi-grid">
        <div class="kpi-card kpi-green">
            <div class="kpi-icon"><i class="fa-solid fa-bolt"></i></div>
            <div>
                <div class="kpi-label">Vol. Sauté Aujourd'hui</div>
                <div class="kpi-value">{{ number_format($recentActivity-> heuresmarche->()->sum(volume_saute')) }} m³</div>
            </div>
        </div>
        <div class="kpi-card kpi-blue">
            <div class="kpi-icon"><i class="fa-solid fa-file-circle-check"></i></div>
            <div>
                <div class="kpi-label">Rapports du Jour</div>
                <div class="kpi-value">{{ $recentActivity->count() }}</div>
            </div>
        </div>
        <div class="kpi-card kpi-orange">
            <div class="kpi-icon"><i class="fa-solid fa-tractor"></i></div>
            <div>
                <div class="kpi-label">Machines Actives</div>
                <div class="kpi-value">{{ collect($machinesStatus)->where('statut', 'marche')->count() }} / {{ count($machinesStatus) }}</div>
            </div>
        </div>
        <div class="kpi-card kpi-purple">
            <div class="kpi-icon"><i class="fa-solid fa-gauge"></i></div>
            <div>
                <div class="kpi-label">Rendement Moyen</div>
                @php
                    $totalVol = $recentActivity->sum('volume_saute');
                    $totalHm  = $recentActivity->sum('hm_total');
                    $rend = $totalHm > 0 ? $totalVol / $totalHm : 0;
                @endphp
                <div class="kpi-value">{{ number_format($rend, 1) }} m³/h</div>
            </div>
        </div>
    </div>

    {{-- ===== CONTENT GRID ===== --}}
    <div class="content-grid">

        {{-- Activité récente --}}
        <div>
            <div class="card">
                <div class="card-header">
                    <i class="fa-solid fa-bolt"></i> Activité Récente de Production
                </div>
                <div class="card-body">
                    @forelse($recentActivity as $activity)
                    <div class="activity-item">
                        <div class="act-icon"><i class="fa-solid fa-truck-fast"></i></div>
                        <div class="act-info">
                            <div class="act-title">
                                {{ $activity->engin?->code_parc ?? 'Machine inconnue' }}
                                — {{ $activity->nom_conducteur ?? '-' }}
                            </div>
                            <div class="act-subtitle">
                                <i class="fa-solid fa-location-dot" style="color:var(--primary)"></i>
                                {{ $activity->chantier?->nom_chantier ?? '-' }}
                                @if($activity->tranchee) · {{ $activity->tranchee }} @endif
                            </div>
                        </div>
                        <div>
                            <div class="act-volume">+{{ number_format($activity->volume_saute) }} m³</div>
                            <div class="act-time">{{ Carbon::parse($activity->created_at)->diffForHumans() }}</div>
                        </div>
                    </div>
                    @empty
                    <div class="empty-state">
                        <i class="fa-solid fa-inbox"></i>
                        Aucune activité enregistrée aujourd'hui
                    </div>
                    @endforelse
                </div>
                <div class="card-footer">
                    <a href="{{ route('rapports.index') }}">
                        Voir tous les rapports <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>

        {{-- Right Column --}}
        <div>
            {{-- État du Parc --}}
            <div class="card">
                <div class="card-header">
                    <i class="fa-solid fa-list-check"></i> État du Parc Machines
                </div>
                <div class="card-body">
                    @foreach($machinesStatus as $machine)
                    <div class="fleet-item">
                        <div class="fleet-icon">
                            <i class="fa-solid fa-truck-monster"></i>
                        </div>
                        <div style="flex:1">
                            <div class="fleet-name">{{ $machine['engin']->code_parc ?? ($machine['name'] ?? 'Machine') }}</div>
                            <div class="fleet-driver">
                                {{ $machine['conducteur'] ?? 'Non assigné' }}
                                @if($machine['tranchee'] ?? false) · {{ $machine['tranchee'] }} @endif
                            </div>
                        </div>
                        @php $statut = $machine['statut'] ?? 'inconnu'; @endphp
                        <span class="status-badge status-{{ $statut }}">
                            @if($statut === 'marche') <i class="fa-solid fa-circle-check"></i> MARCHE
                            @elseif($statut === 'arret') <i class="fa-solid fa-circle-stop"></i> ARRÊT
                            @else <i class="fa-solid fa-circle-minus"></i> N/A
                            @endif
                        </span>
                    </div>
                    @endforeach
                </div>
                <div class="card-footer">
                    <a href="{{ route('poussage') }}">
                        Nouveau rapport <i class="fa-solid fa-plus"></i>
                    </a>
                </div>
            </div>

            {{-- Info Card --}}
            <div class="info-card">
                <h3><i class="fa-solid fa-satellite-dish"></i> Synchronisation</h3>
                <p>Toutes les données sont synchronisées en temps réel avec les rapports terrain.</p>
                <div class="info-stat">
                    <i class="fa-solid fa-circle-check"></i>
                    <span style="font-size:0.85rem; font-weight:600;">Dernière mise à jour : il y a quelques instants</span>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const trigger  = document.getElementById('userTrigger');
        const dropdown = document.getElementById('profileDropdown');

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            trigger.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
            }
        });
    });
</script>
</body>
</html>
