import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCasements } from "../../features/casementSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import image from "../../images/image3.webp";

/* ───────── STYLE PREMIUM ───────── */

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
background:#f0fdf4;
}

.empty-row{
text-align:center;
padding:30px;
opacity:0.6;
}

`;

/* ───────── COMPONENT ───────── */

function HistoriqueCasement() {

  const dispatch = useDispatch();
  const casements = useSelector((state) => state.casement?.list || []);

  // Load data from API on mount
  useEffect(() => {
    dispatch(fetchCasements());
  }, [dispatch]);

  /* FILTERS */

  const [filterPanneau, setFilterPanneau] = useState("");
  const [filterTranchee, setFilterTranchee] = useState("");
  const [filterTypeRoche, setFilterTypeRoche] = useState("");
  const [filterDateDebut, setFilterDateDebut] = useState("");
  const [filterDateFin, setFilterDateFin] = useState("");

  /* UNIQUE VALUES */

  const uniquePanneaux = useMemo(
    () => [...new Set(casements.map(c => c.panneau).filter(Boolean))],
    [casements]
  );

  const uniqueTranchees = useMemo(
    () => [...new Set(casements.map(c => c.tranchee).filter(Boolean))],
    [casements]
  );

  const uniqueTypesRoche = useMemo(
    () => [...new Set(casements.map(c => c.type_roche).filter(Boolean))],
    [casements]
  );

  /* FILTER LOGIC */

  const filteredCasements = useMemo(() => {

    return casements.filter(c => {

      const matchPanneau = filterPanneau ? c.panneau === filterPanneau : true;
      const matchTranchee = filterTranchee ? c.tranchee === filterTranchee : true;
      const matchTypeRoche = filterTypeRoche ? c.type_roche === filterTypeRoche : true;

      let matchDate = true;

      if (filterDateDebut || filterDateFin) {

        const recordDate = new Date(c.date);

        if (filterDateDebut && new Date(filterDateDebut) > recordDate) matchDate = false;
        if (filterDateFin && new Date(filterDateFin) < recordDate) matchDate = false;

      }

      return matchPanneau && matchTranchee && matchTypeRoche && matchDate;

    });

  }, [casements, filterPanneau, filterTranchee, filterTypeRoche, filterDateDebut, filterDateFin]);

  /* RESET */

  const resetFilters = () => {
    setFilterPanneau("");
    setFilterTranchee("");
    setFilterTypeRoche("");
    setFilterDateDebut("");
    setFilterDateFin("");
  };

  /* EXPORT */

  const exportExcel = () => {

    const data = filteredCasements.map(c => ({

      Date: c.date,
      Panneau: c.panneau,
      Tranchee: c.tranchee,
      Niveau: c.niveau,
      TypeRoche: c.type_roche,
      Granulometrie: c.granulometrie,
      Coups: c.nombreCoups,
      Equipements: c.equipements?.join(", "),
      Conducteur: c.conducteur,
      Matricule: c.matricule,
      Volume: c.volume_casse,
      Heures: c.temps,
      Rendement: c.temps > 0 ? (c.volume_casse / c.temps).toFixed(2) : 0

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

  const hasActiveFilters =
    filterPanneau || filterTranchee || filterTypeRoche || filterDateDebut || filterDateFin;

  /* ───────── RENDER ───────── */

  return (

    <>
      <style>{CSS}</style>

      <div className="casement-root">

        {/* HEADER */}

        <div className="casement-header">

          <div>

            <div className="casement-title">
              Historique Casement
            </div>

            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {filteredCasements.length} opérations
            </div>

          </div>

          <img src={image} alt="logo" style={{ height: 40 }} />

        </div>

        {/* FILTER CARD */}

        <div className="casement-card">

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>

            <div className="casement-card-title">
              Filtres
            </div>

            {hasActiveFilters && (
              <button className="btn-reset" onClick={resetFilters}>
                Réinitialiser
              </button>
            )}

          </div>

          <div className="filter-grid">

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

            <div className="filter-group">
              <label className="filter-label">Type Roche</label>
              <select className="filter-select"
                value={filterTypeRoche}
                onChange={e => setFilterTypeRoche(e.target.value)}
              >
                <option value="">Tous</option>
                {uniqueTypesRoche.map(r =>
                  <option key={r} value={r}>{r}</option>
                )}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Date début</label>
              <input
                type="date"
                className="filter-input"
                value={filterDateDebut}
                onChange={e => setFilterDateDebut(e.target.value)}
              />
            </div>

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

          <div className="filter-info">
            {filteredCasements.length} résultat(s)
            {hasActiveFilters && ` sur ${casements.length}`}
          </div>

        </div>

        {/* TABLE */}

        <div className="casement-card">

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>

            <div className="casement-card-title">
              Liste Historique
            </div>

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
                  <th>Niveau</th>
                  <th>Type Roche</th>
                  <th>Granulo</th>
                  <th>Coups</th>
                  <th>Équipements</th>
                  <th>Conducteur</th>
                  <th>Matricule</th>
                  <th>Volume</th>
                  <th>Heures</th>
                  <th>Rendement</th>
                </tr>
              </thead>

              <tbody>

                {filteredCasements.length > 0 ? (

                  filteredCasements.map((c, i) => (

                    <tr key={i}>
                      <td>{c.date}</td>
                      <td>{c.panneau}</td>
                      <td>{c.tranchee}</td>
                      <td>{c.niveau}</td>
                      <td>{c.type_roche}</td>
                      <td>{c.granulometrie}</td>
                      <td>{c.nombreCoups}</td>
                      <td>{c.equipements?.join(", ")}</td>
                      <td>{c.conducteur}</td>
                      <td>{c.matricule}</td>
                      <td>{c.volume_casse}</td>
                      <td>{c.temps}</td>
                      <td>{c.temps > 0 ? (c.volume_casse / c.temps).toFixed(2) : 0} t/h</td>
                    </tr>

                  ))

                ) : (

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