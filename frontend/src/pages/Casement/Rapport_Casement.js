import React, { useMemo } from "react";
import { useSelector } from "react-redux";
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
margin-bottom:30px;
flex-wrap:wrap;
gap:15px;
}

.casement-title{
font-size:26px;
font-weight:800;
color:#14532d;
}

.casement-sub{
font-size:13px;
color:#6b7280;
}

.btn-export{
background:#166534;
color:white;
border:none;
padding:10px 18px;
border-radius:10px;
font-weight:700;
cursor:pointer;
transition:0.2s;
}

.btn-export:hover{
background:#15803d;
}

.kpi-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
gap:16px;
margin-bottom:30px;
}

.kpi-card{
background:white;
border-radius:16px;
padding:20px;
border:1px solid #bbf7d0;
box-shadow:0 6px 20px rgba(0,0,0,0.05);
transition:0.25s;
}

.kpi-card:hover{
transform:translateY(-4px);
box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

.kpi-label{
font-size:11px;
letter-spacing:.1em;
text-transform:uppercase;
color:#9ca3af;
margin-bottom:6px;
}

.kpi-value{
font-size:28px;
font-weight:800;
color:#15803d;
}

.section-title{
font-size:12px;
letter-spacing:.15em;
text-transform:uppercase;
font-weight:700;
color:#16a34a;
margin:30px 0 12px;
display:flex;
align-items:center;
gap:10px;
}

.section-title:after{
content:"";
flex:1;
height:1px;
background:#bbf7d0;
}

.card{
background:white;
border-radius:16px;
padding:22px;
border:1px solid #bbf7d0;
margin-bottom:20px;
}

.table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.table thead{
background:#15803d;
color:white;
}

.table th{
padding:12px;
font-size:11px;
text-transform:uppercase;
}

.table td{
padding:10px;
border-bottom:1px solid #f0fdf4;
}

.table tr:hover{
background:#f0fdf4;
}

.progress{
height:8px;
background:#f3f4f6;
border-radius:999px;
overflow:hidden;
}

.progress-bar{
height:100%;
background:#16a34a;
transition:width .8s;
}

.empty{
text-align:center;
padding:40px;
color:#9ca3af;
}

`;

/* ───────── COMPONENT ───────── */

function RapportCasement() {

  const casements = useSelector(state => state.casement?.list || []);

  /* KPI CALCUL */

  const totalVolume = useMemo(() => casements.reduce((s, c) => s + Number(c.volume_casse || 0), 0), [casements]);
  const totalTemps = useMemo(() => casements.reduce((s, c) => s + Number(c.temps || 0), 0), [casements]);
  const totalCoups = useMemo(() => casements.reduce((s, c) => s + Number(c.nombreCoups || 0), 0), [casements]);

  const rendement = totalTemps > 0 ? (totalVolume / totalTemps).toFixed(2) : 0;

  const nbMarche = useMemo(() => casements.filter(c => c.etatMachine === "En marche").length, [casements]);

  const txDispo = casements.length > 0 ? ((nbMarche / casements.length) * 100).toFixed(1) : 0;

  /* GROUP BY MONTH */

  const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const monthlyStats = useMemo(() => {

    const map = {};

    casements.forEach(c => {

      if (!c.date) return;

      const m = MONTHS[new Date(c.date).getMonth()];

      if (!map[m]) map[m] = { volume: 0, temps: 0, coups: 0, ops: 0 };

      map[m].volume += Number(c.volume_casse || 0);
      map[m].temps += Number(c.temps || 0);
      map[m].coups += Number(c.nombreCoups || 0);
      map[m].ops++;

    });

    return map;

  }, [casements]);

  /* GROUP BY ROCK */

  const rocheStats = useMemo(() => {

    const map = {};

    casements.forEach(c => {

      const r = c.type_roche || "Inconnu";

      if (!map[r]) map[r] = { volume: 0, ops: 0 };

      map[r].volume += Number(c.volume_casse || 0);
      map[r].ops++;

    });

    return map;

  }, [casements]);

  /* EXPORT EXCEL */

  const exportRapport = () => {

    const wb = XLSX.utils.book_new();

    const resume = [
      ["Rapport Casement ZD11"],
      [],
      ["Indicateur", "Valeur", "Unité"],
      ["Opérations", casements.length, "ops"],
      ["Volume Total", totalVolume, "t"],
      ["Heures Totales", totalTemps, "h"],
      ["Coups BRH", totalCoups, "coups"],
      ["Rendement", rendement, "t/h"],
      ["Disponibilité", txDispo, "%"]
    ];

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resume), "Résumé");

    const mensuel = [
      ["Mois", "Opérations", "Volume", "Coups", "Heures", "Rendement"],
      ...Object.entries(monthlyStats).map(([m, d]) => [
        m, d.ops, d.volume, d.coups, d.temps,
        d.temps > 0 ? (d.volume / d.temps).toFixed(2) : 0
      ])
    ];

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mensuel), "Mensuel");

    saveAs(
      new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      ),
      "rapport_casement_ZD11.xlsx"
    );

  };

  /* KPI LIST */

  const kpis = [

    { label: "Opérations", value: casements.length },
    { label: "Volume Total", value: totalVolume + " t" },
    { label: "Rendement Moyen", value: rendement + " t/h" },
    { label: "Coups BRH", value: totalCoups },
    { label: "Heures Totales", value: totalTemps + " h" },
    { label: "Disponibilité", value: txDispo + " %" }

  ];

  /* RENDER */

  return (

    <>
      <style>{CSS}</style>

      <div className="casement-root">

        {/* HEADER */}

        <div className="casement-header">

          <div>

            <div className="casement-title">
              Rapport Casement ZD11
            </div>

            <div className="casement-sub">
              Synthèse des opérations de casement
            </div>

          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

            <img src={image} alt="logo" style={{ height: 40 }} />

            <button className="btn-export" onClick={exportRapport}>
              Télécharger Excel
            </button>

          </div>

        </div>

        {/* KPI */}

        <div className="kpi-grid">

          {kpis.map((k, i) => (

            <div key={i} className="kpi-card">

              <div className="kpi-label">
                {k.label}
              </div>

              <div className="kpi-value">
                {k.value}
              </div>

            </div>

          ))}

        </div>

        {/* MONTHLY */}

        <div className="section-title">
          Rapport Mensuel
        </div>

        <div className="card">

          {Object.keys(monthlyStats).length > 0 ? (

            <table className="table">

              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Opérations</th>
                  <th>Volume</th>
                  <th>Coups</th>
                  <th>Heures</th>
                  <th>Rendement</th>
                </tr>
              </thead>

              <tbody>

                {Object.entries(monthlyStats).map(([m, d]) => (

                  <tr key={m}>
                    <td><b>{m}</b></td>
                    <td>{d.ops}</td>
                    <td><b>{d.volume}</b> t</td>
                    <td>{d.coups}</td>
                    <td>{d.temps}</td>
                    <td><b>{d.temps > 0 ? (d.volume / d.temps).toFixed(2) : 0}</b> t/h</td>
                  </tr>

                ))}

              </tbody>

            </table>

          ) : (

            <div className="empty">
              Aucune donnée disponible
            </div>

          )}

        </div>

        {/* ROCK */}

        <div className="section-title">
          Répartition Type Roche
        </div>

        <div className="card">

          {Object.entries(rocheStats).map(([r, d]) => {

            const pct = totalVolume > 0 ? ((d.volume / totalVolume) * 100).toFixed(1) : 0;

            return (

              <div key={r} style={{ marginBottom: 14 }}>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>

                  <div><b>{r}</b></div>
                  <div>{pct}%</div>

                </div>

                <div className="progress">
                  <div className="progress-bar" style={{ width: pct + "%" }} />
                </div>

              </div>

            );

          })}

        </div>

        {casements.length === 0 && (

          <div className="empty">

            <div style={{ fontSize: 50 }}>📋</div>
            <div>Aucune opération enregistrée</div>

          </div>

        )}

      </div>

    </>

  );

}

export default RapportCasement;