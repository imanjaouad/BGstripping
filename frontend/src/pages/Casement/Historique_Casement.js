import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ══════════════════════════════════════════════════════════════════════════
   HistoriqueCasement
   ──────────────────────────────────────────────────────────────────────────
   Page d'historique des opérations de décapage par Casement.

   Responsabilités :
     1. Lire la liste des opérations depuis le store Redux (state.casement.list)
     2. Permettre le filtrage par Panneau, Tranchée, Poste et plage de dates
     3. Afficher les résultats dans un tableau
     4. Exporter les données filtrées vers un fichier Excel (.xlsx)

   Changements appliqués :
     ✅ Supprimé  : filtres type_roche, granulometrie, nombreCoups (champs supprimés)
     ✅ Remplacé  : filtre "Type Roche" → filtre "Poste"
     ✅ Remplacé  : colonnes niveau, type_roche, granulometrie, nombreCoups, volume_casse
                    → profondeur, poste, volume_saute (alignés sur le nouveau formulaire)
     ✅ Corrigé   : export Excel mis à jour avec les nouveaux noms de champs
     ✅ Conservé  : CSS inline identique à l'original (const CSS)
══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   STYLES — CSS inline injecté via <style>{CSS}</style>
   Conservé tel quel pour garder le même rendu visuel que l'original.
══════════════════════════════════════════════════════════════════════════ */

const CSS = `

@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800&display=swap');

.casement-root{
font-family:'Epilogue',sans-serif;
background:#f8faf9;
min-height:100vh;
padding:25px;
}

.casement-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.casement-title{
font-size:26px;
font-weight:800;
color:#14532d;
}

.casement-card{
background:white;
border-radius:16px;
padding:22px;
border:1px solid #bbf7d0;
box-shadow:0 6px 24px rgba(0,0,0,0.05);
margin-bottom:20px;
}

.casement-card-title{
font-size:15px;
font-weight:700;
margin-bottom:15px;
color:#14532d;
}

.filter-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
gap:16px;
}

.filter-group{
display:flex;
flex-direction:column;
gap:4px;
}

.filter-label{
font-size:11px;
letter-spacing:.08em;
text-transform:uppercase;
color:#6b7280;
font-weight:600;
}

.filter-select,
.filter-input{
padding:9px 12px;
border-radius:10px;
border:1px solid #bbf7d0;
background:white;
font-size:13px;
outline:none;
transition:0.2s;
}

.filter-select:focus,
.filter-input:focus{
border-color:#16a34a;
}

.filter-info{
margin-top:10px;
font-size:12px;
color:#6b7280;
}

.btn-reset{
padding:6px 12px;
border-radius:8px;
border:1px solid #ef4444;
background:#fee2e2;
color:#b91c1c;
font-size:12px;
cursor:pointer;
}

.btn-reset:hover{
background:#fecaca;
}

.btn-excel{
background:#16a34a;
color:white;
border:none;
padding:8px 16px;
border-radius:10px;
font-weight:600;
cursor:pointer;
transition:0.2s;
}

.btn-excel:hover{
background:#15803d;
}

.table-wrap{
overflow:auto;
border-radius:14px;
border:1px solid #bbf7d0;
}

.mine-table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.mine-table thead{
background:#15803d;
color:white;
}

.mine-table th{
padding:12px;
font-size:11px;
text-transform:uppercase;
}

.mine-table td{
padding:10px;
border-bottom:1px solid #f0fdf4;
}

.mine-table tr:hover{
background: #f0fdf4;

}

.empty-row{
text-align:center;
padding:30px;
opacity:0.6;
}

.btn-edit{
background:#f0fdf4;
color:#15803d;
border:1.5px solid #bbf7d0;
padding:5px 14px;
border-radius:8px;
font-weight:600;
font-size:12px;
cursor:pointer;
transition:0.2s;
white-space:nowrap;
}

.btn-edit:hover{
background:#dcfce7;
border-color:#16a34a;
}

`;

/* ══════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */

function HistoriqueCasement() {

  const casements = useSelector((state) => state.casement?.list || []);
  const navigate  = useNavigate();

  const handleEdit = (c, filteredIndex) => {
    // Retrouver l'index réel dans la liste Redux (pas l'index filtré)
    const realIndex = casements.indexOf(c);
    navigate("/operations/casement/gestion", {
      state: { editData: c, editIndex: realIndex },
    });
  };

  const [filterPanneau,   setFilterPanneau]   = useState("");
  const [filterTranchee,  setFilterTranchee]  = useState("");
  const [filterPoste,     setFilterPoste]     = useState("");
  const [filterDateDebut, setFilterDateDebut] = useState("");
  const [filterDateFin,   setFilterDateFin]   = useState("");

  const uniquePanneaux = useMemo(
    () => [...new Set(casements.map(c => c.panneau).filter(Boolean))],
    [casements]
  );

  const uniqueTranchees = useMemo(
    () => [...new Set(casements.map(c => c.tranchee).filter(Boolean))],
    [casements]
  );

  const uniquePostes = useMemo(
    () => [...new Set(casements.map(c => c.poste).filter(Boolean))],
    [casements]
  );

  const filteredCasements = useMemo(() => {
    return casements.filter(c => {
      const matchPanneau  = filterPanneau  ? c.panneau  === filterPanneau  : true;
      const matchTranchee = filterTranchee ? c.tranchee === filterTranchee : true;
      const matchPoste    = filterPoste    ? c.poste    === filterPoste    : true;
      let matchDate = true;
      if (filterDateDebut || filterDateFin) {
        const recordDate = new Date(c.date);
        if (filterDateDebut && new Date(filterDateDebut) > recordDate) matchDate = false;
        if (filterDateFin   && new Date(filterDateFin)   < recordDate) matchDate = false;
      }
      return matchPanneau && matchTranchee && matchPoste && matchDate;
    });
  }, [casements, filterPanneau, filterTranchee, filterPoste, filterDateDebut, filterDateFin]);

  const resetFilters = () => {
    setFilterPanneau("");
    setFilterTranchee("");
    setFilterPoste("");
    setFilterDateDebut("");
    setFilterDateFin("");
  };

  const exportExcel = () => {

    const data = filteredCasements.map(c => ({

      Date:               c.date,
      Panneau:            c.panneau,
      Tranchee:           c.tranchee,
      Profondeur:         c.profondeur,                          // ex: Niveau
      Poste:              c.poste,                               // ex: TypeRoche
      Equipements:        c.equipements?.join(", "),
      Conducteur:         c.conducteur,
      Matricule:          c.matricule,
      "Volume Saute":     c.volume_saute,                        // ex: volume_casse
      Heures:             c.temps,
      Rendement:          c.temps > 0 ? (c.volume_saute / c.temps).toFixed(2) : 0,
      "Etat Machine":     c.etatMachine === "arret" ? "En arrêt" : "En marche",

    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historique");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "historique_casement.xlsx");

  };

  /* ────────────────────────────────────────────────────────────────────────
     HELPER — Vrai si au moins un filtre est actif.
     Contrôle l'affichage du bouton "Réinitialiser" et le texte "sur X total".
  ──────────────────────────────────────────────────────────────────────── */
  const hasActiveFilters =
    filterPanneau || filterTranchee || filterPoste || filterDateDebut || filterDateFin;

/* ══════════════════════════════════════════════════════════════════════════
   RENDU
══════════════════════════════════════════════════════════════════════════ */

return (

<>
<style>{CSS}</style>

<div className="casement-root">

  {/* ── HEADER ── */}

  <div className="casement-header">
    <div>
      <div className="casement-title">Historique Casement</div>
    </div>
  </div>

  {/* ── CARTE FILTRES ── */}

  <div className="casement-card">

    <div style={{display:"flex", justifyContent:"space-between", marginBottom:15}}>

      <div className="casement-card-title">Filtres</div>

      {/* Bouton Réinitialiser — visible uniquement si un filtre est actif */}
      {hasActiveFilters && (
        <button className="btn-reset" onClick={resetFilters}>
          Réinitialiser
        </button>
      )}

    </div>

    <div className="filter-grid">

      {/* Filtre Panneau */}
      <div className="filter-group">
        <label className="filter-label">Panneau</label>
        <select className="filter-select"
          value={filterPanneau}
          onChange={e => setFilterPanneau(e.target.value)}
        >
          <option value="">Tous</option>
          {uniquePanneaux.map(p =>
            <option key={p} value={p}>{p}</option>
          )}
        </select>
      </div>

      {/* Filtre Tranchée */}
      <div className="filter-group">
        <label className="filter-label">Tranchée</label>
        <select className="filter-select"
          value={filterTranchee}
          onChange={e => setFilterTranchee(e.target.value)}
        >
          <option value="">Toutes</option>
          {uniqueTranchees.map(t =>
            <option key={t} value={t}>{t}</option>
          )}
        </select>
      </div>

      {/* Filtre Poste (remplace Type Roche supprimé) */}
      <div className="filter-group">
        <label className="filter-label">Poste</label>
        <select className="filter-select"
          value={filterPoste}
          onChange={e => setFilterPoste(e.target.value)}
        >
          <option value="">Tous</option>
          {uniquePostes.map(p =>
            <option key={p} value={p}>{p}</option>
          )}
        </select>
      </div>

      {/* Filtre Date de début */}
      <div className="filter-group">
        <label className="filter-label">Date début</label>
        <input
          type="date"
          className="filter-input"
          value={filterDateDebut}
          onChange={e => setFilterDateDebut(e.target.value)}
        />
      </div>

      {/* Filtre Date de fin */}
      <div className="filter-group">
        <label className="filter-label">Date fin</label>
        <input
          type="date"
          className="filter-input"
          value={filterDateFin}
          onChange={e => setFilterDateFin(e.target.value)}
        />
      </div>

    </div>

    {/* Résumé : X résultat(s) sur Y total si filtres actifs */}
    <div className="filter-info">
      {filteredCasements.length} résultat(s)
      {hasActiveFilters && ` sur ${casements.length}`}
    </div>

  </div>

  {/* ── CARTE TABLEAU ── */}

  <div className="casement-card">

    <div style={{display:"flex", justifyContent:"space-between", marginBottom:15}}>

      <div className="casement-card-title">Liste Historique</div>

      {/* Export Excel — exporte uniquement les lignes filtrées */}
      <button className="btn-excel" onClick={exportExcel}>
        Télécharger Excel
      </button>

    </div>

    <div className="table-wrap">

      <table className="mine-table">

        <thead>
          <tr>
            <th>Date</th>
            <th>Panneau</th>
            <th>Tranchée</th>
            <th>Profondeur</th>
            <th>Poste</th>
            <th>Équipements</th>
            <th>Conducteur</th>
            <th>Matricule</th>
            <th>Volume Sauté</th>
            <th>Heures</th>
            <th>Rendement</th>
            <th>État Machine</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredCasements.length > 0 ? (

            filteredCasements.map((c, i) => (

              <tr key={i}>
                <td>{c.date}</td>
                <td>{c.panneau}</td>
                <td>{c.tranchee}</td>
                <td>{c.profondeur}</td>
                <td>{c.poste}</td>
                <td>{c.equipements?.join(", ")}</td>
                <td>{c.conducteur}</td>
                <td>{c.matricule}</td>
                <td>{c.volume_saute}</td>
                <td>{c.temps}</td>
                <td>{c.temps > 0 ? (c.volume_saute / c.temps).toFixed(2) : 0} t/h</td>
                <td>{c.etatMachine === "arret" ? "En arrêt" : "En marche"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(c, i)}>
                    ✏️ Modifier
                  </button>
                </td>
              </tr>

            ))

          ) : (

            /* Ligne affichée si aucun résultat ne correspond aux filtres */
            <tr>
              <td colSpan="13" className="empty-row">
                Aucun résultat trouvé
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>

</>

);

}

export default HistoriqueCasement;