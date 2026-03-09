import { useCallback, useEffect, useMemo, useState } from "react";
import "../style/ReportsSection.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export default function ReportsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    machine: "",
    tranchee: "",
    etat: "",
  });

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/api/poussages`, {
        headers: { Accept: "application/json" },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Impossible de charger les rapports.");
      }

      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setError(err.message || "Erreur reseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
    window.addEventListener("poussage-saved", loadReports);

    return () => {
      window.removeEventListener("poussage-saved", loadReports);
    };
  }, [loadReports]);

  const machineOptions = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.machine?.name || row.equipement).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [rows]);

  const trancheeOptions = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.tranchee).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      machine: "",
      tranchee: "",
      etat: "",
    });
    setSearchTerm("");
  };

  const filteredRows = useMemo(() => {
    const advancedFiltered = rows.filter((row) => {
      const operationDate = row.operation_date ? String(row.operation_date).slice(0, 10) : "";
      const machineName = row.machine?.name || row.equipement || "";
      const etatLabel = row.etat_machine === "en_arret" ? "en_arret" : "en_marche";

      if (filters.dateFrom && (!operationDate || operationDate < filters.dateFrom)) return false;
      if (filters.dateTo && (!operationDate || operationDate > filters.dateTo)) return false;
      if (filters.machine && machineName !== filters.machine) return false;
      if (filters.tranchee && row.tranchee !== filters.tranchee) return false;
      if (filters.etat && etatLabel !== filters.etat) return false;
      return true;
    });

    const term = searchTerm.trim().toLowerCase();
    if (!term) return advancedFiltered;

    return advancedFiltered.filter((row) => {
      const searchBlob = [
        formatDate(row.operation_date),
        row.panneau,
        row.tranchee,
        row.niveau,
        row.saute,
        row.profondeur,
        row.machine?.name || row.equipement,
        row.conducteur,
        row.matricule,
        row.compteur_debut,
        row.compteur_fin,
        row.etat_machine === "en_arret" ? "en arret" : "en marche",
        row.type_arret,
        row.arret_heure_debut,
        row.arret_heure_fin,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchBlob.includes(term);
    });
  }, [rows, searchTerm, filters]);

  const exportToExcel = () => {
    const headers = [
      "Date",
      "Panneau",
      "Tranchee",
      "Niveau",
      "Volume Saute",
      "Profondeur",
      "Machine",
      "Conducteur",
      "Matricule",
      "Compteur Debut",
      "Compteur Fin",
      "Etat",
      "Type Arret",
      "Heure Debut Arret",
      "Heure Fin Arret",
    ];

    const lines = filteredRows.map((row) => [
      formatDate(row.operation_date),
      row.panneau || "",
      row.tranchee || "",
      row.niveau || "",
      row.saute || "",
      row.profondeur || "",
      row.machine?.name || row.equipement || "",
      row.conducteur || "",
      row.matricule || "",
      row.compteur_debut ?? "",
      row.compteur_fin ?? "",
      row.etat_machine === "en_arret" ? "En arret" : "En marche",
      row.type_arret || "",
      row.arret_heure_debut || "",
      row.arret_heure_fin || "",
    ]);

    const csvRows = [headers, ...lines].map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rapports_filtres.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHtml = filteredRows
      .map(
        (row) => `
          <tr>
            <td>${formatDate(row.operation_date)}</td>
            <td>${row.panneau || ""}</td>
            <td>${row.tranchee || ""}</td>
            <td>${row.niveau || ""}</td>
            <td>${row.saute || ""}</td>
            <td>${row.profondeur || ""}</td>
            <td>${row.machine?.name || row.equipement || ""}</td>
            <td>${row.conducteur || ""}</td>
            <td>${row.matricule || ""}</td>
            <td>${row.compteur_debut ?? ""} - ${row.compteur_fin ?? ""}</td>
            <td>${row.etat_machine === "en_arret" ? "En arret" : "En marche"}</td>
            <td>${row.etat_machine === "en_arret" ? `${row.type_arret || "-"} (${row.arret_heure_debut || "-"} - ${row.arret_heure_fin || "-"})` : "-"}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Rapports Filtres</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; }
            h1 { margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Rapports Filtres</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Panneau</th><th>Tranchee</th><th>Niveau</th><th>Saute</th><th>Profondeur</th>
                <th>Machine</th><th>Conducteur</th><th>Matricule</th><th>Compteur</th><th>Etat</th><th>Arret</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const stats = useMemo(() => {
    const totalRapports = rows.length;
    const machines = new Set(rows.map((row) => row.machine?.name || row.equipement).filter(Boolean));
    const totalVolume = rows.reduce((sum, row) => sum + Number(row.saute || 0), 0);
    const rendements = rows
      .map((row) => {
        const debut = Number(row.compteur_debut || 0);
        const fin = Number(row.compteur_fin || 0);
        const heures = fin - debut;
        const volume = Number(row.saute || 0);
        if (heures <= 0) return null;
        return volume / heures;
      })
      .filter((value) => value !== null);
    const rendementMoyen = rendements.length
      ? rendements.reduce((sum, value) => sum + value, 0) / rendements.length
      : 0;
    const totalArrets = rows.filter((row) => row.etat_machine === "en_arret").length;

    return {
      totalRapports,
      totalMachines: machines.size,
      totalVolume: totalVolume.toFixed(2),
      rendementMoyen: rendementMoyen.toFixed(2),
      totalArrets,
    };
  }, [rows]);

  return (
    <section id="reports" className="reports-section py-5">
      <div className="container">
        <div className="reports-layout">
          <div className="reports-card">
            <div className="reports-header">
              <div>
                <h2>Rapports Poussage</h2>
                <p>Historique des enregistrements deja crees.</p>
              </div>
              <button type="button" className="reports-refresh" onClick={loadReports} disabled={loading}>
                {loading ? "Chargement..." : "Actualiser"}
              </button>
            </div>

            <div className="reports-search">
              <input
                type="text"
                placeholder="Rechercher (date, panneau, machine, conducteur...)"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <span>{filteredRows.length} resultat(s)</span>
            </div>

            <div className="reports-filters">
              <label>
                Date debut
                <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
              </label>
              <label>
                Date fin
                <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
              </label>
              <label>
                Machine
                <select name="machine" value={filters.machine} onChange={handleFilterChange}>
                  <option value="">Toutes</option>
                  {machineOptions.map((machine) => (
                    <option key={machine} value={machine}>
                      {machine}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tranchee
                <select name="tranchee" value={filters.tranchee} onChange={handleFilterChange}>
                  <option value="">Toutes</option>
                  {trancheeOptions.map((tranchee) => (
                    <option key={tranchee} value={tranchee}>
                      {tranchee}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Etat
                <select name="etat" value={filters.etat} onChange={handleFilterChange}>
                  <option value="">Tous</option>
                  <option value="en_marche">En marche</option>
                  <option value="en_arret">En arret</option>
                </select>
              </label>
            </div>

            <div className="reports-actions">
              <button type="button" className="reports-secondary" onClick={resetFilters}>
                Reinitialiser filtres
              </button>
              <button type="button" className="reports-export" onClick={exportToExcel}>
                Export Excel
              </button>
              <button type="button" className="reports-export" onClick={exportToPdf}>
                Export PDF
              </button>
            </div>

            {error ? <p className="reports-state reports-error">{error}</p> : null}

            {!error && (
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Panneau</th>
                      <th>Tranchee</th>
                      <th>Niveau</th>
                      <th>Saute</th>
                      <th>Profondeur</th>
                      <th>Equipement</th>
                      <th>Conducteur</th>
                      <th>Matricule</th>
                      <th>Compteur</th>
                      <th>Etat</th>
                      <th>Arret</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan="12" className="reports-empty">
                          {rows.length === 0 ? "Aucune donnee enregistree." : "Aucun resultat pour cette recherche."}
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row) => (
                        <tr key={row.id}>
                          <td>{formatDate(row.operation_date)}</td>
                          <td>{row.panneau}</td>
                          <td>{row.tranchee}</td>
                          <td>{row.niveau}</td>
                          <td>{row.saute}</td>
                          <td>{row.profondeur}</td>
                          <td>{row.machine?.name || row.equipement}</td>
                          <td>{row.conducteur}</td>
                          <td>{row.matricule}</td>
                          <td>{row.compteur_debut} - {row.compteur_fin}</td>
                          <td>{row.etat_machine === "en_arret" ? "En arret" : "En marche"}</td>
                          <td>
                            {row.etat_machine === "en_arret"
                              ? `${row.type_arret || "-"} (${row.arret_heure_debut || "-"} - ${row.arret_heure_fin || "-"})`
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside id="statistics" className="stats-card">
            <h3>Statistiques</h3>
            <p>Resume global des rapports enregistres.</p>

            <div className="stats-list">
              <div className="stats-item">
                <span>Total Rapports</span>
                <strong>{stats.totalRapports}</strong>
              </div>
              <div className="stats-item">
                <span>Machines Utilisees</span>
                <strong>{stats.totalMachines}</strong>
              </div>
              <div className="stats-item">
                <span>Volume Total Saute</span>
                <strong>{stats.totalVolume} m3</strong>
              </div>
              <div className="stats-item">
                <span>Rendement Moyen</span>
                <strong>{stats.rendementMoyen} t/h</strong>
              </div>
              <div className="stats-item">
                <span>Total Arrets</span>
                <strong>{stats.totalArrets}</strong>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}

