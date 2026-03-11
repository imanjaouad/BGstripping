import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import image from "../../images/image3.webp";
import "../../components/animations.css";

function Historique() {
  const poussages = useSelector((state) => state.poussage?.list || []);

  // Filter state
  const [filterPanneau, setFilterPanneau] = useState("");
  const [filterTranchee, setFilterTranchee] = useState("");
  const [filterDateDebut, setFilterDateDebut] = useState("");
  const [filterDateFin, setFilterDateFin] = useState("");

  // Unique values for dropdowns
  const uniquePanneaux = useMemo(
    () => [...new Set(poussages.map((p) => p.panneau).filter(Boolean))],
    [poussages]
  );

  const uniqueTranchees = useMemo(
    () => [...new Set(poussages.map((p) => p.tranchee).filter(Boolean))],
    [poussages]
  );

  // Filtered data
  const filteredPoussages = useMemo(() => {
    return poussages.filter((p) => {
      const matchPanneau = filterPanneau ? p.panneau === filterPanneau : true;
      const matchTranchee = filterTranchee ? p.tranchee === filterTranchee : true;

      let matchDate = true;
      if (filterDateDebut || filterDateFin) {
        const recordDate = new Date(p.date);
        if (filterDateDebut && new Date(filterDateDebut) > recordDate) matchDate = false;
        if (filterDateFin && new Date(filterDateFin) < recordDate) matchDate = false;
      }

      return matchPanneau && matchTranchee && matchDate;
    });
  }, [poussages, filterPanneau, filterTranchee, filterDateDebut, filterDateFin]);

  const resetFilters = () => {
    setFilterPanneau("");
    setFilterTranchee("");
    setFilterDateDebut("");
    setFilterDateFin("");
  };

  const exportExcel = () => {
    const data = filteredPoussages.map((p) => ({
      Date: p.date,
      Panneau: p.panneau,
      Tranchee: p.tranchee,
      Profendeur: p.profendeur,
      Equipements: p.equipements?.join(", "),
      Conducteur: p.conducteur,
      Matricule: p.matricule,
      Volume: p.volume_soté,
     
      Temps: p.temps,
      Rendement: p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "historique_poussage.xlsx");
  };

  const hasActiveFilters = filterPanneau || filterTranchee || filterDateDebut || filterDateFin;

  return (
    <div className="historique-page">

      {/* HEADER */}
      <div className="page-header">
        <h2 className="page-title">
          Historique <span>Décapage</span>
        </h2>
        <img src={image} alt="logo" className="page-logo" />
      </div>

      {/* FILTER CARD */}
      <div className="table-card mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="table-card-title">Filtres</h3>
          {hasActiveFilters && (
            <button className="btn-reset" onClick={resetFilters}>
              Réinitialiser
            </button>
          )}
        </div>

        <div className="filter-grid">

          {/* Panneau */}
          <div className="filter-group">
            <label className="filter-label">Panneau</label>
            <select
              className="filter-select"
              value={filterPanneau}
              onChange={(e) => setFilterPanneau(e.target.value)}
            >
              <option value="">Tous les panneaux</option>
              {uniquePanneaux.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Tranchée */}
          <div className="filter-group">
            <label className="filter-label">Tranchée</label>
            <select
              className="filter-select"
              value={filterTranchee}
              onChange={(e) => setFilterTranchee(e.target.value)}
            >
              <option value="">Toutes les tranchées</option>
              {uniqueTranchees.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Date début */}
          <div className="filter-group">
            <label className="filter-label">Date </label>
            <input
              type="date"
              className="filter-input"
              value={filterDateDebut}
              onChange={(e) => setFilterDateDebut(e.target.value)}
            />
          </div>

          {/* Date fin */}
          <div className="filter-group">
            <label className="filter-label">Date fin</label>
            <input
              type="date"
              className="filter-input"
              value={filterDateFin}
              onChange={(e) => setFilterDateFin(e.target.value)}
            />
          </div>

        </div>

        {/* Result count */}
        <div className="filter-result-info">
          {filteredPoussages.length} résultat{filteredPoussages.length !== 1 ? "s" : ""} trouvé{filteredPoussages.length !== 1 ? "s" : ""}
          {hasActiveFilters && ` (sur ${poussages.length} total)`}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="table-card-title">Liste Historique</h3>
          <button className="btn-excel" onClick={exportExcel}>
            Télécharger Excel
          </button>
        </div>

        {/* TABLE */}
        <table className="mine-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Panneau</th>
              <th>Tranchée</th>
              <th>Profendeur</th>
              <th>Équipements</th>
              <th>Conducteur</th>
              <th>Matricule</th>
              <th>Volume</th>
           
              <th>Heures</th>
              <th>Rendement</th>
            </tr>
          </thead>

          <tbody>
            {filteredPoussages.length > 0 ? (
              filteredPoussages.map((p, index) => (
                <tr key={index}>
                  <td>{p.date}</td>
                  <td>{p.panneau}</td>
                  <td>{p.tranchee}</td>
                  <td>{p.profendeur}</td>
                  <td>{p.equipements?.join(", ")}</td>
                  <td>{p.conducteur}</td>
                  <td>{p.matricule}</td>
                  <td>{p.volume_soté}</td>
            
                  <td>{p.temps}</td>
                  <td>
                    {p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : 0} t/h
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", padding: "2rem", opacity: 0.5 }}>
                  Aucun résultat trouvé pour les filtres sélectionnés.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Inline styles for filter UI — merge into your CSS file if preferred */}
      <style>{`
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .filter-label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.65;
        }

        .filter-select,
        .filter-input {
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          color: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }

        .filter-select:focus,
        .filter-input:focus {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.12);
        }

        .filter-result-info {
          margin-top: 1rem;
          font-size: 0.85rem;
          opacity: 0.6;
          font-style: italic;
        }

        .btn-reset {
          padding: 0.4rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 100, 100, 0.5);
          background: rgba(255, 80, 80, 0.1);
          color: #ff6b6b;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .btn-reset:hover {
          background: rgba(255, 80, 80, 0.2);
          border-color: rgba(255, 100, 100, 0.8);
        }
      `}</style>

    </div>
  );
}

export default Historique;