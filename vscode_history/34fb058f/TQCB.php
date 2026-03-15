<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stripping Dashboard - Poussage</title>
    <!-- عيطنا لـ CSS اللي حطيتي فـ public -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <aside class="sidebar">
        <div class="sidebar-logo"><h2>OCP STRIPPING</h2></div>
        <nav class="sidebar-nav">
            <ul>
                <li><i class="fa-solid fa-gauge"></i> Dashboard</li>
                <li class="active"><i class="fa-solid fa-angles-right"></i> Mode Poussage</li>
                <li><i class="fa-solid fa-box-open"></i> Mode Casement</li>
                <li><i class="fa-solid fa-truck-moving"></i> Mode Transport</li>
                <li><i class="fa-solid fa-file-invoice"></i> Rapports</li>
            </ul>
        </nav>
    </aside>

    <main class="main-body">
        <header class="main-header">
            <div class="header-title"><h1>Gestion Décapage : <span>Mode Poussage</span></h1></div>
            <div class="header-user"><span>{{ auth()->user()->name ?? 'Admin Site' }}</span><i class="fa-solid fa-circle-user" style="font-size: 1.5rem; color: #10b981;"></i></div>
        </header>

        @if(session('success'))
            <div style="background: #d1f7e6; color: #065f46; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                {{ session('success') }}
            </div>
        @endif

        <!-- فورمير مربوط بالداتابيز -->
        <form action="{{ route('poussage.store') }}" method="POST">
            @csrf
            <section class="form-grid">
                <div class="form-card">
                    <h3><i class="fa-solid fa-map-location-dot"></i> Chantier & Localisation</h3>
                    <div class="row">
                        <div class="field">
                            <label>Date</label>
                            <input type="date" name="date_operation" value="{{ date('Y-m-d') }}" required>
                        </div>
                        <div class="field">
                            <label>Chantier (Zone)</label>
                            <select name="chantier_id" required>
                                @foreach($chantiers as $c)
                                    <option value="{{ $c->id }}">{{ $c->nom_chantier }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="field"><label>Tranchée</label><input type="text" name="tranchee" placeholder="N° Tranchée"></div>
                        <div class="field"><label>Niveau (m)</label><input type="number" step="0.01" name="niveau" placeholder="Ex: 12.5"></div>
                    </div>
                </div>

                <div class="form-card">
                    <h3><i class="fa-solid fa-hard-hat"></i> Ressources & Engin</h3>
                    <div class="row">
                        <div class="field">
                            <label>Machine (Engin)</label>
                            <select name="engin_id" required>
                                @foreach($engins as $e)
                                    <option value="{{ $e->id }}">{{ $e->code_parc }} ({{ $e->type_engin }})</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="field">
                            <label>Conducteur</label>
                            <select name="personnel_id" required>
                                @foreach($personnels as $p)
                                    <option value="{{ $p->id }}">{{ $p->nom_prenom }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-card">
                    <h3><i class="fa-solid fa-clock"></i> Temps de Travail</h3>
                    <div class="row">
                        <div class="field">
                            <label>Compteur Début</label>
                            <input type="number" step="0.01" name="compteur_debut" id="debut" oninput="calculer()">
                        </div>
                        <div class="field">
                            <label>Compteur Fin</label>
                            <input type="number" step="0.01" name="compteur_fin" id="fin" oninput="calculer()">
                        </div>
                    </div>
                    <div class="row">
                        <div class="field">
                            <label>Volume Réalisé (m³)</label>
                            <input type="number" name="volume_decapé" id="vol" oninput="calculer()" required>
                        </div>
                    </div>
                </div>

                <!-- Résultats Automatiques (يدار بالـ JavaScript) -->
                <div class="form-card highlight">
                    <h3><i class="fa-solid fa-calculator"></i> Résultats Automatiques</h3>
                    <div class="row">
                        <div class="field">
                            <label>Durée Totale</label>
                            <div class="static-val" id="res_duree">0.00 h</div>
                        </div>
                        <div class="field">
                            <label>Rendement</label>
                            <div class="static-val" id="res_rendement">0 m³/h</div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="form-footer">
                <button type="submit" class="btn-primary">Enregistrer la Saisie de Poussage</button>
            </div>
        </form>

        <section class="report-section">
            <h3>Historique récent des saisies</h3>
            <div class="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th><th>Conducteur</th><th>Machine</th><th>Volume</th><th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($rapports as $r)
                        <tr>
                            <td>{{ $r->date_operation }}</td>
                            <td>{{ $r->personnel->nom_prenom }}</td>
                            <td>{{ $r->engin->code_parc }}</td>
                            <td>{{ number_format($r->volume_decapé) }} m³</td>
                            <td><span class="badge ok">Validé</span></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- Script JavaScript للحساب التلقائي -->
    <script>
        function calculer() {
            let debut = parseFloat(document.getElementById('debut').value) || 0;
            let fin = parseFloat(document.getElementById('fin').value) || 0;
            let vol = parseFloat(document.getElementById('vol').value) || 0;
            
            let duree = fin - debut;
            if(duree > 0) {
                document.getElementById('res_duree').innerText = duree.toFixed(2) + " h";
                let rend = vol / duree;
                document.getElementById('res_rendement').innerText = rend.toFixed(0) + " m³/h";
            } else {
                document.getElementById('res_duree').innerText = "0.00 h";
                document.getElementById('res_rendement').innerText = "0 m³/h";
            }
        }
    </script>
</body>
</html>