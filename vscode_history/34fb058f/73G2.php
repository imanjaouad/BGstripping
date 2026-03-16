<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCP Stripping - Mode Poussage</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS INTEGRÉ */
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Roboto, sans-serif; }
        :root {
            --primary-green: #10b981; --dark-sidebar: #1f2937; --bg-light: #f3f4f6;
            --white: #ffffff; --text-dark: #111827; --text-gray: #6b7280;
            --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        body { background-color: var(--bg-light); display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background-color: var(--dark-sidebar); color: white; position: fixed; height: 100%; }
        .sidebar-logo { padding: 30px 20px; text-align: center; background: #111827; }
        .sidebar-logo h2 { font-size: 1.2rem; letter-spacing: 2px; color: var(--primary-green); }
        .sidebar-nav ul { list-style: none; margin-top: 20px; }
        .sidebar-nav li { padding: 15px 25px; color: #9ca3af; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
        .sidebar-nav li i { margin-right: 15px; width: 20px; }
        .sidebar-nav li:hover, .sidebar-nav li.active { background-color: #374151; color: var(--primary-green); border-left: 4px solid var(--primary-green); }
        .main-body { flex: 1; margin-left: 260px; padding: 30px; }
        .main-header { display: flex; justify-content: space-between; align-items: center; background: var(--white); padding: 20px; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 30px; }
        .header-title h1 { font-size: 1.3rem; color: var(--text-dark); }
        .header-title span { color: var(--primary-green); }
        .header-user { display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-card { background: var(--white); padding: 20px; border-radius: 12px; box-shadow: var(--shadow); }
        .form-card h3 { margin-bottom: 15px; font-size: 1rem; color: var(--text-dark); display: flex; align-items: center; gap: 10px; }
        .form-card.highlight { background: #ecfdf5; border: 1px dashed var(--primary-green); }
        .row { display: flex; gap: 15px; margin-bottom: 15px; }
        .field { flex: 1; display: flex; flex-direction: column; }
        .field label { font-size: 0.8rem; font-weight: 600; color: var(--text-gray); margin-bottom: 5px; }
        .field input, .field select { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; background: white; }
        .readonly-field { background: #f9fafb !important; font-weight: bold; color: var(--text-dark); }
        .static-val { background: white; padding: 10px; border-radius: 6px; text-align: center; font-weight: bold; color: var(--primary-green); border: 1px solid #a7f3d0; }
        .form-footer { margin-top: 20px; text-align: right; }
        .btn-primary { background: var(--primary-green); color: white; padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .report-section { margin-top: 40px; background: white; padding: 20px; border-radius: 12px; box-shadow: var(--shadow); }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { text-align: left; background: #f9fafb; padding: 12px; font-size: 0.8rem; color: var(--text-gray); text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; background: #d1f7e6; color: #065f46; font-weight: bold; }
    </style>
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
            <div class="header-user"><span>Admin Site</span><i class="fa-solid fa-circle-user" style="font-size: 1.5rem; color: #10b981;"></i></div>
        </header>

        @if(session('success'))
            <div style="background: #d1f7e6; color: #065f46; padding: 15px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #a7f3d0;">
                <i class="fa-solid fa-check-circle"></i> {{ session('success') }}
            </div>
        @endif

        <form action="{{ route('poussage.store') }}" method="POST">
            @csrf
            <section class="form-grid">
                
                <!-- 1. Localisation -->
                <div class="form-card">
                    <h3><i class="fa-solid fa-map-location-dot"></i> Chantier & Localisation</h3>
                    <div class="row">
                        <div class="field"><label>Date</label><input type="date" name="date_operation" value="{{ date('Y-m-d') }}" required></div>
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
                        <div class="field"><label>Tranchée</label><input type="text" name="tranchee" placeholder="Ex: TR-45"></div>
                        <div class="field"><label>Niveau (m)</label><input type="number" step="0.01" name="niveau" placeholder="Ex: 12.5"></div>
                    </div>
                </div>

                <!-- 2. Ressources (Auto-fill) -->
                <div class="form-card">
                    <h3><i class="fa-solid fa-hard-hat"></i> Ressources & Engin</h3>
                    <div class="row">
                        <div class="field">
                            <label>Machine (Code)</label>
                            <select name="engin_id" id="engin_select" onchange="updateEnginInfo()" required>
                                <option value="">-- Choisir --</option>
                                @foreach($engins as $e)
                                    <option value="{{ $e->id }}" data-type="{{ $e->type_engin }}">{{ $e->code_parc }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="field"><label>Équipement</label><input type="text" id="engin_type" class="readonly-field" readonly placeholder="Auto"></div>
                    </div>
                    <div class="row">
                        <div class="field">
                            <label>Conducteur</label>
                            <select name="personnel_id" id="personnel_select" onchange="updatePersonnelInfo()" required>
                                <option value="">-- Choisir --</option>
                                @foreach($personnels as $p)
                                    <option value="{{ $p->id }}" data-matricule="{{ $p->matricule }}">{{ $p->nom_prenom }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="field"><label>Matricule</label><input type="text" id="personnel_matricule" class="readonly-field" readonly placeholder="Auto"></div>
                    </div>
                </div>

                <!-- 3. État Machine (Arrêt Logic) -->
                <div class="form-card">
                    <h3><i class="fa-solid fa-stethoscopes"></i> État de la Machine</h3>
                    <div class="row">
                        <div class="field">
                            <label>Statut</label>
                            <select name="statut_machine" id="statut_machine" onchange="toggleArretSection()">
                                <option value="marche">🟢 En Marche</option>
                                <option value="arret">🔴 À l'arrêt</option>
                            </select>
                        </div>
                    </div>
                    <div id="section_arret" style="display: none; border-top: 1px dashed #ddd; padding-top: 15px; margin-top: 10px;">
                        <div class="row">
                            <div class="field">
                                <label>Type d'Arrêt</label>
                                <select name="type_arret_id">
                                    <option value="">-- Motif --</option>
                                    @foreach($typeArrets as $ta)
                                        <option value="{{ $ta->id }}">{{ $ta->libelle_arret }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="field"><label>Début Arrêt</label><input type="time" name="heure_debut_arret"></div>
                            <div class="field"><label>Fin Arrêt</label><input type="time" name="heure_fin_arret"></div>
                        </div>
                    </div>
                </div>

                <!-- 4. Temps & Calculs -->
                <div class="form-card highlight">
                    <h3><i class="fa-solid fa-calculator"></i> Temps & Résultats</h3>
                    <div class="row">
                        <div class="field"><label>Compteur Début</label><input type="number" step="0.01" id="debut" name="compteur_debut" oninput="calculer()"></div>
                        <div class="field"><label>Compteur Fin</label><input type="number" step="0.01" id="fin" name="compteur_fin" oninput="calculer()"></div>
                    </div>
                    <div class="row">
                        <div class="field"><label>Volume (m³)</label><input type="number" id="vol" name="volume_decapé" oninput="calculer()" required></div>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="field"><label>Durée</label><div class="static-val" id="res_duree">0.00 h</div></div>
                        <div class="field"><label>Rendement</label><div class="static-val" id="res_rendement">0 m³/h</div></div>
                    </div>
                </div>

            </section>

            <div class="form-footer">
                <button type="submit" class="btn-primary">Enregistrer la Saisie</button>
            </div>
        </form>

        <section class="report-section">
            <h3>Historique Récent</h3>
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
                        <td>{{ $r->personnel->nom_prenom }} ({{ $r->personnel->matricule }})</td>
                        <td>{{ $r->engin->code_parc }}</td>
                        <td>{{ number_format($r->volume_decapé) }} m³</td>
                        <td><span class="badge">Validé</span></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </section>
    </main>

    <script>
        function updateEnginInfo() {
            let s = document.getElementById('engin_select');
            document.getElementById('engin_type').value = s.options[s.selectedIndex].getAttribute('data-type') || "";
        }
        function updatePersonnelInfo() {
            let s = document.getElementById('personnel_select');
            document.getElementById('personnel_matricule').value = s.options[s.selectedIndex].getAttribute('data-matricule') || "";
        }
        function toggleArretSection() {
            document.getElementById('section_arret').style.display = document.getElementById('statut_machine').value === 'arret' ? 'block' : 'none';
        }
        function calculer() {
            let d = parseFloat(document.getElementById('debut').value) || 0;
            let f = parseFloat(document.getElementById('fin').value) || 0;
            let v = parseFloat(document.getElementById('vol').value) || 0;
            let dur = f - d;
            if(dur > 0) {
                document.getElementById('res_duree').innerText = dur.toFixed(2) + " h";
                document.getElementById('res_rendement').innerText = Math.round(v/dur) + " m³/h";
            } else {
                document.getElementById('res_duree').innerText = "0.00 h";
                document.getElementById('res_rendement').innerText = "0 m³/h";
            }
        }
    </script>
</body>
</html>