import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCasement, fetchCasements } from "../../features/casementSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
padding:5px 12px;
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

.btn-del{
background:#fef2f2;
color:#dc2626;
border:1.5px solid #fecaca;
padding:5px 12px;
border-radius:8px;
font-weight:600;
font-size:12px;
cursor:pointer;
transition:0.2s;
white-space:nowrap;
}
.btn-del:hover{
background:#fee2e2;
border-color:#ef4444;
}

.btn-pdf{
background:#1d4ed8;
color:white;
border:none;
padding:8px 16px;
border-radius:10px;
font-weight:600;
cursor:pointer;
transition:0.2s;
display:inline-flex;
align-items:center;
gap:6px;
}
.btn-pdf:hover{ background:#1e40af; }

.actions-cell{
display:flex;
gap:6px;
align-items:center;
}

/* Badge état machine */
.badge-marche{
display:inline-flex;align-items:center;gap:4px;
background:#dcfce7;color:#15803d;border:1px solid #bbf7d0;
padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;
}
.badge-arret{
display:inline-flex;align-items:center;gap:4px;
background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;
padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;
}

/* Modal confirmation suppression */
.modal-overlay{
position:fixed;inset:0;z-index:9999;
background:rgba(0,0,0,0.4);backdrop-filter:blur(3px);
display:flex;align-items:center;justify-content:center;
}
.modal-box{
background:#fff;border-radius:20px;padding:32px 36px;
max-width:420px;width:90%;
box-shadow:0 24px 80px rgba(0,0,0,0.2);
animation:modalIn .3s cubic-bezier(0.16,1,0.3,1);
text-align:center;
}
@keyframes modalIn{
  from{opacity:0;transform:scale(0.93) translateY(12px)}
  to  {opacity:1;transform:scale(1) translateY(0)}
}
.modal-icon{
width:56px;height:56px;border-radius:16px;
background:#fef2f2;color:#dc2626;
display:flex;align-items:center;justify-content:center;
margin:0 auto 16px;
}
.modal-title{font-size:17px;font-weight:800;color:#111827;margin-bottom:8px;}
.modal-msg  {font-size:13px;color:#6b7280;line-height:1.6;margin-bottom:24px;}
.modal-btns {display:flex;gap:10px;justify-content:center;}
.modal-cancel{
padding:10px 24px;border-radius:10px;border:1.5px solid #e5e7eb;
background:#f9fafb;color:#374151;font-weight:600;font-size:14px;
cursor:pointer;transition:all .18s;
}
.modal-cancel:hover{background:#f3f4f6;}
.modal-confirm{
padding:10px 28px;border-radius:10px;border:none;
background:linear-gradient(135deg,#dc2626,#ef4444);
color:#fff;font-weight:700;font-size:14px;cursor:pointer;
transition:all .18s;box-shadow:0 4px 14px rgba(220,38,38,0.3);
}
.modal-confirm:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(220,38,38,0.4);}
`

/* ══════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */

function HistoriqueCasement() {

  const casements  = useSelector((state) => state.casement?.list    ?? []);
  const loading    = useSelector((state) => state.casement?.loading  ?? false);
  const storeError = useSelector((state) => state.casement?.error    ?? null);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  /* ① Charger depuis la BDD au montage — données survivent au refresh */
  useEffect(() => {
    dispatch(fetchCasements());
  }, [dispatch]);

  /* État local */
  // id = id réel BDD (pas l'index du tableau)
  const [confirmDlg, setConfirmDlg] = useState({
    open: false, id: null, label: "", deleting: false,
  });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ② Modifier — transmet editId pour que le formulaire fasse PUT */
  const handleEdit = useCallback((c) => {
    navigate("/operations/casement/gestion", {
      state: {
        editData:  c,
        editIndex: casements.indexOf(c),
        editId:    c.id,   // ← sans ça, le formulaire faisait POST au lieu de PUT
      },
    });
  }, [casements, navigate]);

  /* ③ Supprimer — DELETE /api/casements/{id} avec l'id BDD */
  const askDelete = useCallback((c) => {
    const label = [c.date, c.panneau, c.tranchee].filter(Boolean).join(" · ");
    setConfirmDlg({ open: true, id: c.id, label, deleting: false });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!confirmDlg.id) return;
    setConfirmDlg(prev => ({ ...prev, deleting: true }));
    try {
      await dispatch(deleteCasement(confirmDlg.id)).unwrap();
      showToast("Opération supprimée de la base de données.");
    } catch (err) {
      showToast(err?.message ?? "Erreur lors de la suppression.", "error");
    } finally {
      setConfirmDlg({ open: false, id: null, label: "", deleting: false });
    }
  }, [confirmDlg.id, dispatch, showToast]);

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
    const data = filteredCasements.map(c => {
      const htp  = parseFloat(c.htp || 0);
      const oee  = htp > 0 ? ((htp / 24) * 100).toFixed(2) : 0;
      const tu   = htp > 0 ? (((htp / 24) * 100 / 24) * 100).toFixed(2) : 0;
      const sommeArrets = Object.values(c.arretsEquipements || {}).reduce((s, a) => {
        if (!a?.debut || !a?.fin) return s;
        const [dh, dm] = a.debut.split(":").map(Number);
        const [fh, fm] = a.fin.split(":").map(Number);
        const min = fh * 60 + fm - (dh * 60 + dm);
        return s + (min > 0 ? min / 60 : 0);
      }, 0);
      const tuVal = parseFloat(tu);
      const td = tuVal > 0 ? (Math.max(0, tuVal - sommeArrets) / 24 * 100).toFixed(2) : 0;
      return {
        Date:               c.date,
        Panneau:            c.panneau,
        Tranchee:           c.tranchee,
        Profondeur:         c.profondeur,
        Poste:              c.poste,
        Equipements:        c.equipements?.join(", "),
        Conducteur:         c.conducteur,
        Matricule:          c.matricule,
        "Volume Saute (m²)": c.volume_saute,
        "Volume Decape (m²)": c.volume_decaper || 0,
        "Heures Marche":    c.temps,
        "Rendement (m²/h)": c.temps > 0 ? (c.volume_saute / c.temps).toFixed(2) : 0,
        "HTP (h)":          c.htp || 0,
        "OEE (%)":          oee,
        "Tu (%)":           tu,
        "TD (%)":           td,
        "Etat Machine":     c.etatMachine === "arret" ? "En arrêt" : "En marche",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historique");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "historique_casement.xlsx");
  };

  // ── Export PDF ──
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // En-tête
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 297, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Historique des Opérations — Casement", 14, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Exporté le ${new Date().toLocaleDateString("fr-MA")}  |  ${filteredCasements.length} opération(s)`, 200, 14);

    autoTable(doc, {
      startY: 28,
      head: [[
        "Date", "Panneau", "Tranchée", "Profondeur", "Poste",
        "Équipements", "Conducteur", "Matricule",
        "Volume (m²)", "Heures", "Rendement", "HTP", "OEE%", "Tu%", "TD%", "État"
      ]],
      body: filteredCasements.map(c => {
        const htp  = parseFloat(c.htp || 0);
        const oee  = htp > 0 ? ((htp / 24) * 100).toFixed(1) : "—";
        const tu   = htp > 0 ? (((htp / 24) * 100 / 24) * 100).toFixed(1) : "—";
        // Somme arrêts équipements
        const sommeArrets = Object.values(c.arretsEquipements || {}).reduce((s, a) => {
          if (!a?.debut || !a?.fin) return s;
          const [dh, dm] = a.debut.split(":").map(Number);
          const [fh, fm] = a.fin.split(":").map(Number);
          const min = fh * 60 + fm - (dh * 60 + dm);
          return s + (min > 0 ? min / 60 : 0);
        }, 0);
        const tuVal = htp > 0 ? (htp / 24) * 100 / 24 * 100 : 0;
        const td = tuVal > 0 ? (Math.max(0, tuVal - sommeArrets) / 24 * 100).toFixed(1) : "—";
        const rend = c.temps > 0 ? (c.volume_saute / c.temps).toFixed(2) : "—";
        return [
          c.date || "", c.panneau || "", c.tranchee || "", c.profondeur || "", c.poste || "",
          c.equipements?.join(", ") || "",
          c.conducteur || "", c.matricule || "",
          c.volume_saute || "", c.temps || "", rend,
          htp || "—", oee, tu, td,
          c.etatMachine === "arret" ? "En arrêt" : "En marche",
        ];
      }),
      styles:       { fontSize: 8, cellPadding: 3, font: "helvetica" },
      headStyles:   { fillColor: [21, 128, 61], textColor: 255, fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: { 0: { cellWidth: 20 }, 5: { cellWidth: 28 }, 10: { cellWidth: 18 } },
      margin: { left: 14, right: 14 },
    });

    // Pied de page
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Page ${i} / ${pages}`, 14, doc.internal.pageSize.height - 8);
      doc.text("Casement — Rapport Historique", 230, doc.internal.pageSize.height - 8);
    }

    doc.save("historique_casement.pdf");
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

{/* Toast */}
{toast && (
  <div style={{
    position:"fixed", bottom:24, right:24, zIndex:9998,
    background: toast.type === "error" ? "#b91c1c" : "#14532d",
    color:"#fff", borderRadius:12, padding:"14px 20px",
    fontSize:13, fontWeight:600,
    boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
    display:"flex", alignItems:"center", gap:8,
    animation:"modalIn .35s cubic-bezier(0.16,1,0.3,1)",
  }}>
    {toast.type === "error" ? "❌" : "✅"} {toast.msg}
  </div>
)}

{/* ── MODAL CONFIRMATION SUPPRESSION ── */}
{confirmDlg.open && (
  <div className="modal-overlay" onClick={() => !confirmDlg.deleting && setConfirmDlg({ open:false, id:null, label:"", deleting:false })}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </div>
      <div className="modal-title">Supprimer cette opération ?</div>
      <div className="modal-msg">
        <strong>{confirmDlg.label}</strong>
        <br/>Cette action supprimera définitivement l'enregistrement de la base de données.
      </div>
      <div className="modal-btns">
        <button
          className="modal-cancel"
          onClick={() => setConfirmDlg({ open:false, id:null, label:"", deleting:false })}
          disabled={confirmDlg.deleting}
        >
          Annuler
        </button>
        <button
          className="modal-confirm"
          onClick={confirmDelete}
          disabled={confirmDlg.deleting}
        >
          {confirmDlg.deleting ? "Suppression…" : "Supprimer"}
        </button>
      </div>
    </div>
  </div>
)}

<div className="casement-root">

  {/* ── HEADER ── */}
  <div className="casement-header">
    <div>
      <div className="casement-title">Historique Casement</div>
      <div style={{fontSize:13, color:"#6b7280", marginTop:3}}>
        {casements.length} opération(s) enregistrée(s) au total
      </div>
    </div>
    <button
      className="btn-excel"
      onClick={() => dispatch(fetchCasements())}
      disabled={loading}
      style={{display:"flex", alignItems:"center", gap:6}}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-5"/>
      </svg>
      {loading ? "Chargement…" : "Rafraîchir"}
    </button>
  </div>

  {/* Erreur API */}
  {storeError && (
    <div style={{
      background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12,
      padding:"14px 20px", color:"#b91c1c", fontSize:13,
      display:"flex", alignItems:"center", gap:10, marginBottom:16,
    }}>
      ⚠️ Erreur API : <strong>{storeError}</strong>
      &nbsp;—&nbsp;
      <span style={{textDecoration:"underline", cursor:"pointer"}} onClick={() => dispatch(fetchCasements())}>
        Réessayer
      </span>
    </div>
  )}

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

      <div style={{display:"flex", gap:8}}>
        <button className="btn-pdf" onClick={exportPDF}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Télécharger PDF
        </button>
        <button className="btn-excel" onClick={exportExcel}>
          Télécharger Excel
        </button>
      </div>

    </div>

    <div className="table-wrap">

      <table className="mine-table">

        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Panneau</th>
            <th>Tranchée</th>
            <th>Profondeur</th>
            <th>Poste</th>
            <th>Équipements</th>
            <th>Conducteur</th>
            <th>Matricule</th>
            <th>Vol. Sauté (m²)</th>
            <th>Vol. Décapé (m²)</th>
            <th>Heures</th>
            <th>Rendement</th>
            <th>HTP</th>
            <th>OEE</th>
            <th>Tu</th>
            <th>TD</th>
            <th>État Machine</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredCasements.length > 0 ? (

            filteredCasements.map((c, i) => {
              const htp     = parseFloat(c.htp || 0);
              const oee     = c.oee ? `${c.oee}%` : "—";
              const tu      = c.tu  ? `${c.tu}%`  : "—";
              const td      = c.td  ? `${c.td}%`  : "—";
              const rend    = c.temps > 0 ? (c.volume_saute / c.temps).toFixed(2) : "—";

              return (
              <tr key={c.id ?? i}>
                <td style={{color:"#9ca3af",fontWeight:700,fontSize:11}}>{i + 1}</td>
                <td>{c.date || "—"}</td>
                <td>{c.panneau || "—"}</td>
                <td>{c.tranchee || "—"}</td>
                <td>{c.profondeur || "—"}</td>
                <td>{c.poste || "—"}</td>
                <td style={{fontSize:11}}>{(c.equipements ?? []).join(", ") || "—"}</td>
                <td>{c.conducteur || "—"}</td>
                <td style={{fontSize:11}}>{c.matricule || "—"}</td>
                <td><strong style={{color:"#14532d"}}>{c.volume_saute || "—"}</strong></td>
                <td><strong style={{color:"#0891b2"}}>{c.volume_decaper ? Number(c.volume_decaper).toLocaleString() : "—"}</strong></td>
                <td>{c.temps ? `${c.temps} h` : "—"}</td>
                <td><strong>{rend}</strong>{rend !== "—" ? " m²/h" : ""}</td>
                <td style={{fontWeight:700,color:"#15803d"}}>{htp > 0 ? `${htp} h` : "—"}</td>
                <td style={{fontWeight:700,color:"#1d4ed8"}}>{oee}</td>
                <td style={{fontWeight:700,color:"#b45309"}}>{tu}</td>
                <td style={{fontWeight:700,color:"#6d28d9"}}>{td}</td>
                <td>
                  <span className={c.etatMachine === "arret" ? "badge-arret" : "badge-marche"}>
                    {c.etatMachine === "arret" ? "En arrêt" : "En marche"}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(c)}>
                      ✏️ Modifier
                    </button>
                    <button className="btn-del" onClick={() => askDelete(c)}>
                      🗑️ Supprimer
                    </button>
                  </div>
                </td>
              </tr>
              );
            })

          ) : (

            <tr>
              <td colSpan="19" className="empty-row">
                {loading
                  ? "⏳ Chargement depuis la base de données…"
                  : hasActiveFilters
                    ? "Aucun résultat pour ces filtres."
                    : "Aucune opération enregistrée. Ajoutez une opération depuis la page Gestion."}
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