import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCasement, updateCasement } from "../../features/casementSlice";
import image from "../../images/image3.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   CASEMENT ZD11 — DASHBOARD FORM (Light Mode Premium)
   FIXES v2:
   ✅ Removed erroneous <StatistiqueCasement/> import + render inside this page
   ✅ Cleaned up unused imports
   ✅ emptyForm factored out to avoid duplication
   ✅ reset() also clears editIndex
═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Epilogue:wght@400;500;600;700;800&display=swap');

  .lcsm-root {
    --ivory: #fafaf7; --ivory-warm: #f5f4ef; --ivory-deep: #ede9df; --paper: #ffffff;
    --ink: #111827; --ink-soft: #4b5563; --ink-faint: #9ca3af;
    --forest: #14532d; --forest-mid: #15803d; --forest-hi: #16a34a; --emerald: #10b981;
    --mist: #dcfce7; --fog: #f0fdf4; --border-g: #bbf7d0;
    --copper: #92400e; --copper-hi: #b45309; --blush: #fef3c7;
    --shadow-xs: 0 1px 3px rgba(20,83,45,0.06), 0 1px 2px rgba(20,83,45,0.04);
    --shadow-sm: 0 4px 16px rgba(20,83,45,0.08), 0 2px 6px rgba(20,83,45,0.05);
    --shadow-md: 0 8px 32px rgba(20,83,45,0.10), 0 3px 10px rgba(20,83,45,0.06);
    --shadow-xl: 0 32px 80px rgba(20,83,45,0.14), 0 12px 30px rgba(20,83,45,0.08);
    font-family: 'Epilogue', sans-serif; color: var(--ink); position: relative;
  }
  .lcsm-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 70% 50% at 100% 0%, rgba(220,252,231,0.5) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 0% 100%, rgba(187,247,208,0.3) 0%, transparent 55%);
  }
  .lcsm-dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(20,83,45,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%);
  }
  .lcsm-leaf { position: fixed; z-index: 0; pointer-events: none; opacity: 0.05; }
  .lcsm-leaf-1 { top: -60px; right: 60px; width: 280px; height: 280px; background: radial-gradient(ellipse 40% 80% at 50% 50%, #14532d, transparent); border-radius: 0 80% 0 80%; animation: lcsm-leafSway 12s ease-in-out infinite; }
  .lcsm-leaf-2 { bottom: 40px; left: -60px; width: 240px; height: 240px; background: radial-gradient(ellipse 40% 80% at 50% 50%, #15803d, transparent); border-radius: 80% 0 80% 0; animation: lcsm-leafSway 16s ease-in-out infinite reverse; }
  @keyframes lcsm-leafSway { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
  .lcsm-page { position: relative; z-index: 1; }
  .lcsm-header {
    display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 20px;
    padding-bottom: 24px; margin-bottom: 32px; border-bottom: 1.5px solid var(--border-g);
    position: relative; opacity: 0; animation: lcsm-riseIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s forwards;
  }
  .lcsm-header::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 80px; height: 3px; background: linear-gradient(90deg, var(--forest), var(--forest-hi), transparent); border-radius: 2px; }
  .lcsm-vol-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--forest-hi); display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .lcsm-vol-label::before { content: ''; width: 28px; height: 1.5px; background: linear-gradient(90deg, var(--forest-hi), transparent); }
  .lcsm-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 400; color: var(--forest); margin: 0; line-height: 1.05; }
  .lcsm-title em { font-style: italic; color: var(--forest-hi); position: relative; }
  .lcsm-title em::after { content: ''; position: absolute; bottom: 2px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--emerald), var(--forest-hi), transparent); border-radius: 1px; }
  .lcsm-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .lcsm-logo { height: 80px; border-radius: 12px; border: 1.5px solid var(--border-g); box-shadow: var(--shadow-sm); transition: transform 0.3s, box-shadow 0.3s; }
  .lcsm-logo:hover { transform: translateY(-2px) scale(1.02); box-shadow: var(--shadow-md); }
  .lcsm-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; background: var(--fog); border: 1.5px solid var(--border-g); font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--forest-hi); }
  .lcsm-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--emerald); animation: lcsm-pulse 2.5s ease infinite; }
  @keyframes lcsm-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }
  .lcsm-card { background: var(--paper); border: 1.5px solid rgba(187,247,208,0.6); border-radius: 20px; padding: 40px 44px; box-shadow: var(--shadow-xl); position: relative; overflow: hidden; opacity: 0; animation: lcsm-riseIn 0.75s cubic-bezier(0.16,1,0.3,1) 0.18s forwards; }
  .lcsm-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--forest) 0%, var(--forest-hi) 25%, var(--emerald) 50%, var(--forest-hi) 75%, var(--forest) 100%); background-size: 200% 100%; animation: lcsm-stripe 4s linear infinite; }
  @keyframes lcsm-stripe { from { background-position: 0%; } to { background-position: 200%; } }
  .lcsm-card-wm { position: absolute; bottom: -80px; right: -80px; width: 300px; height: 300px; border-radius: 50%; border: 40px solid rgba(220,252,231,0.2); pointer-events: none; }
  .lcsm-card-wm::before { content: ''; position: absolute; inset: 28px; border-radius: 50%; border: 18px solid rgba(187,247,208,0.15); }
  .lcsm-section { display: flex; align-items: center; gap: 12px; grid-column: 1 / -1; margin: 28px 0 2px; padding-bottom: 10px; border-bottom: 1px solid rgba(187,247,208,0.6); opacity: 0; animation: lcsm-riseIn 0.45s ease forwards; }
  .lcsm-section:first-of-type { margin-top: 0; }
  .lcsm-section-num { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; color: var(--paper); background: var(--forest-hi); width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(22,163,74,0.3); }
  .lcsm-section-title { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--forest-hi); }
  .lcsm-section-line { flex: 1; height: 1px; background: rgba(187,247,208,0.5); }
  .lcsm-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .lcsm-full { grid-column: 1 / -1; }
  @media (max-width: 900px) { .lcsm-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .lcsm-grid { grid-template-columns: 1fr; } .lcsm-card { padding: 24px 20px; } }
  .lcsm-field { display: flex; flex-direction: column; gap: 6px; opacity: 0; animation: lcsm-riseIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .lcsm-field:nth-child(1)  { animation-delay:0.28s } .lcsm-field:nth-child(2)  { animation-delay:0.33s }
  .lcsm-field:nth-child(3)  { animation-delay:0.38s } .lcsm-field:nth-child(4)  { animation-delay:0.43s }
  .lcsm-field:nth-child(5)  { animation-delay:0.48s } .lcsm-field:nth-child(6)  { animation-delay:0.53s }
  .lcsm-field:nth-child(7)  { animation-delay:0.58s } .lcsm-field:nth-child(8)  { animation-delay:0.63s }
  .lcsm-field:nth-child(9)  { animation-delay:0.68s } .lcsm-field:nth-child(10) { animation-delay:0.73s }
  .lcsm-field:nth-child(11) { animation-delay:0.78s } .lcsm-field:nth-child(12) { animation-delay:0.83s }
  .lcsm-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); display: flex; align-items: center; gap: 7px; }
  .lcsm-auto-badge { font-size: 8px; font-weight: 500; color: var(--forest-hi); background: var(--fog); border: 1px solid var(--border-g); padding: 1px 7px; border-radius: 20px; }
  .lcsm-input, .lcsm-select { width: 100%; box-sizing: border-box; padding: 11px 14px; background: var(--ivory); border: 1.5px solid rgba(187,247,208,0.8); border-radius: 10px; color: var(--ink); font-family: 'DM Mono', monospace; font-size: 13px; outline: none; transition: all 0.22s cubic-bezier(0.16,1,0.3,1); box-shadow: var(--shadow-xs), inset 0 1px 0 rgba(255,255,255,0.8); -webkit-appearance: none; appearance: none; }
  .lcsm-input::placeholder { color: var(--ink-faint); font-size: 12px; }
  .lcsm-input:hover:not(:focus), .lcsm-select:hover:not(:focus) { border-color: rgba(22,163,74,0.4); background: var(--fog); }
  .lcsm-input:focus, .lcsm-select:focus { border-color: var(--forest-hi); background: var(--paper); box-shadow: 0 0 0 3px rgba(22,163,74,0.10), var(--shadow-sm); transform: translateY(-1px); color: var(--forest); }
  .lcsm-input[readonly] { background: var(--fog); border-color: var(--border-g); color: var(--forest-hi); font-weight: 600; cursor: default; }
  .lcsm-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 15px; padding-right: 38px; }
  .lcsm-select-danger { border-color: rgba(217,119,6,0.4) !important; background-color: var(--blush) !important; color: var(--copper) !important; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important; }
  .lcsm-select-danger:focus { box-shadow: 0 0 0 3px rgba(217,119,6,0.12), var(--shadow-sm) !important; border-color: var(--copper-hi) !important; }
  .lcsm-equip-area { grid-column: 1 / -1; }
  .lcsm-chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .lcsm-chip { padding: 8px 18px; border: 1.5px solid rgba(187,247,208,0.9); border-radius: 999px; background: var(--ivory); color: var(--ink-soft); font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.16,1,0.3,1); user-select: none; box-shadow: var(--shadow-xs); }
  .lcsm-chip:hover { border-color: var(--forest-hi); color: var(--forest); background: var(--fog); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
  .lcsm-chip.active { background: linear-gradient(135deg, var(--forest), var(--forest-hi)); border-color: var(--forest); color: #fff; font-weight: 500; box-shadow: 0 4px 14px rgba(21,128,61,0.3); }
  .lcsm-chip.active::before { content: '✓ '; font-size: 10px; }
  .lcsm-chip-add { padding: 8px 18px; border: 1.5px dashed rgba(22,163,74,0.4); border-radius: 999px; background: transparent; color: var(--forest-hi); font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s ease; }
  .lcsm-chip-add:hover { background: var(--fog); border-color: var(--forest-hi); transform: translateY(-2px); }
  .lcsm-arret-zone { grid-column: 1 / -1; background: linear-gradient(135deg, var(--blush), #fff9ec); border: 1.5px solid rgba(217,119,6,0.25); border-radius: 16px; padding: 22px 26px; position: relative; animation: lcsm-arretReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards; box-shadow: 0 4px 20px rgba(146,64,14,0.06); }
  .lcsm-arret-zone::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--copper-hi), var(--copper)); border-radius: 16px 0 0 16px; }
  @keyframes lcsm-arretReveal { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .lcsm-arret-head { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--copper-hi); }
  .lcsm-arret-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--copper-hi); box-shadow: 0 0 0 3px rgba(180,83,9,0.15); animation: lcsm-pulse 1.4s ease infinite; }
  .lcsm-arret-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .lcsm-arret-zone .lcsm-input { background: #fff; border-color: rgba(217,119,6,0.2); }
  .lcsm-arret-zone .lcsm-input:focus { border-color: var(--copper-hi); box-shadow: 0 0 0 3px rgba(217,119,6,0.08); color: var(--copper); }
  .lcsm-rendement { grid-column: 1 / -1; display: flex; align-items: stretch; background: linear-gradient(135deg, var(--forest) 0%, var(--forest-hi) 60%, var(--emerald) 100%); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(21,128,61,0.3), 0 4px 12px rgba(21,128,61,0.2); position: relative; opacity: 0; animation: lcsm-riseIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s forwards; }
  .lcsm-rendement::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); animation: lcsm-sweep 4s ease-in-out 1.5s infinite; }
  @keyframes lcsm-sweep { 0% { left: -100%; } 50% { left: 150%; } 100% { left: 150%; } }
  .lcsm-rendement-left { flex: 1; padding: 26px 32px; position: relative; z-index: 1; }
  .lcsm-rendement-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 8px; }
  .lcsm-rendement-value { font-family: 'DM Serif Display', serif; font-size: 3.8rem; font-weight: 400; line-height: 1; color: #fff; letter-spacing: -0.02em; transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .lcsm-rendement-value.zero { color: rgba(255,255,255,0.3); }
  .lcsm-rendement-unit { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 6px; }
  .lcsm-rendement-right { width: 160px; flex-shrink: 0; background: rgba(0,0,0,0.12); border-left: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 20px; position: relative; z-index: 1; }
  .lcsm-ring-wrap { position: relative; width: 84px; height: 84px; }
  .lcsm-ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .lcsm-ring-track { fill: none; stroke: rgba(255,255,255,0.15); stroke-width: 5; }
  .lcsm-ring-progress { fill: none; stroke: rgba(255,255,255,0.9); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 245; stroke-dashoffset: 245; transition: stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 0 6px rgba(255,255,255,0.4)); }
  .lcsm-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.9); }
  .lcsm-ring-pct { font-size: 13px; font-weight: 500; line-height: 1; }
  .lcsm-ring-sub { font-size: 9px; opacity: 0.55; }
  .lcsm-rendement-rlabel { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.1em; text-align: center; }
  .lcsm-action-row { grid-column: 1 / -1; display: flex; gap: 12px; align-items: center; padding-top: 8px; opacity: 0; animation: lcsm-riseIn 0.5s ease 1.1s forwards; }
  .lcsm-btn-submit { position: relative; overflow: hidden; padding: 13px 40px; background: linear-gradient(135deg, var(--forest) 0%, var(--forest-hi) 100%); border: none; border-radius: 12px; color: #fff; font-family: 'Epilogue', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 20px rgba(21,128,61,0.35), inset 0 1px 0 rgba(255,255,255,0.15); }
  .lcsm-btn-submit::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); transform: skewX(-20deg); transition: left 0.5s ease; }
  .lcsm-btn-submit:hover::before { left: 160%; }
  .lcsm-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(21,128,61,0.45); background: linear-gradient(135deg, var(--forest-hi) 0%, var(--emerald) 100%); }
  .lcsm-btn-submit:active { transform: translateY(0); }
  .lcsm-btn-cancel { padding: 13px 24px; background: var(--ivory-warm); border: 1.5px solid var(--ivory-deep); border-radius: 12px; color: var(--ink-soft); font-family: 'Epilogue', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.22s ease; }
  .lcsm-btn-cancel:hover { background: var(--ivory-deep); color: var(--ink); transform: translateY(-1px); }
  @keyframes lcsm-riseIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

function SectionLabel({ num, title }) {
  return (
    <div className="lcsm-section lcsm-full">
      <div className="lcsm-section-num">{num}</div>
      <span className="lcsm-section-title">{title}</span>
      <div className="lcsm-section-line" />
    </div>
  );
}
function Field({ label, children, auto = false }) {
  return (
    <div className="lcsm-field">
      <label className="lcsm-label">
        {label}{auto && <span className="lcsm-auto-badge">AUTO</span>}
      </label>
      {children}
    </div>
  );
}
function RendementRing({ value, max = 200 }) {
  const C = 245;
  const pct = Math.min(Math.max(value, 0) / max, 1);
  return (
    <div className="lcsm-ring-wrap">
      <svg viewBox="0 0 90 90">
        <circle className="lcsm-ring-track"    cx="45" cy="45" r="39" />
        <circle className="lcsm-ring-progress" cx="45" cy="45" r="39"
          style={{ strokeDashoffset: C * (1 - pct) }} />
      </svg>
      <div className="lcsm-ring-center">
        <span className="lcsm-ring-pct">{value > 0 ? `${Math.round(pct * 100)}%` : "—"}</span>
        <span className="lcsm-ring-sub">perf.</span>
      </div>
    </div>
  );
}

function DashboardCasement() {
  const dispatch = useDispatch();
  const [editIndex, setEditIndex] = useState(null);
  const [equipOpts, setEquipOpts] = useState(["7500M1", "7500M2", "P&H1", "P&H2", "200B1"]);

  const emptyForm = {
    date: "", panneau: "", tranchee: "", niveau: "",
    volume_casse: "", granulometrie: "", type_roche: "",
    equipements: [], conducteur: "", matricule: "",
    heureDebut: "", heureFin: "", temps: "", nombreCoups: "",
    poste: "", etatMachine: "En marche",
    typeArret: "", heureDebutArret: "", heureFinArret: "",
  };
  const [form, setForm] = useState(emptyForm);

  const calcTemps = (d, f) => {
    if (!d || !f) return "";
    const [dh, dm] = d.split(":").map(Number);
    const [fh, fm] = f.split(":").map(Number);
    const min = fh * 60 + fm - (dh * 60 + dm);
    return min > 0 ? (min / 60).toFixed(2) : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const u = { ...form, [name]: value };
    if (name === "heureDebut" || name === "heureFin")
      u.temps = calcTemps(name === "heureDebut" ? value : form.heureDebut, name === "heureFin" ? value : form.heureFin);
    setForm(u);
  };

  const toggleEquip = (eq) => setForm({ ...form, equipements: form.equipements.includes(eq) ? form.equipements.filter(e => e !== eq) : [...form.equipements, eq] });
  const addEquip = () => { const n = prompt("Nom du nouvel équipement"); if (n && !equipOpts.includes(n)) setEquipOpts([...equipOpts, n]); };
  const reset = () => { setForm(emptyForm); setEditIndex(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) dispatch(updateCasement({ index: editIndex, data: form }));
    else dispatch(addCasement(form));
    reset();
  };

  const rendement = form.temps > 0 ? parseFloat((form.volume_casse / form.temps).toFixed(2)) : 0;
  const isArret = form.etatMachine === "En arrêt";

  return (
    <div className="lcsm-root">
      <style>{CSS}</style>
      <div className="lcsm-bg" /><div className="lcsm-dots" />
      <div className="lcsm-leaf lcsm-leaf-1" /><div className="lcsm-leaf lcsm-leaf-2" />

      <div className="lcsm-page">
        <header className="lcsm-header">
          <div>
            <div className="lcsm-vol-label">Opérations Minières · ZD11</div>
            <h1 className="lcsm-title">Décapage par <em>Casement</em></h1>
          </div>
          <div className="lcsm-header-right">
            <div className="lcsm-pill"><div className="lcsm-pill-dot" />Système actif</div>
            <img src={image} alt="logo" className="lcsm-logo" />
          </div>
        </header>

        <div className="lcsm-card">
          <div className="lcsm-card-wm" />
          <form onSubmit={handleSubmit}>
            <div className="lcsm-grid">

              <SectionLabel num="01" title="Localisation & Identification" />
              <Field label="Date"><input type="date" className="lcsm-input" name="date" value={form.date} onChange={handleChange} required /></Field>
              <Field label="Panneau"><input type="text" className="lcsm-input" name="panneau" placeholder="ex : P-12" value={form.panneau} onChange={handleChange} /></Field>
              <Field label="Tranchée"><input type="text" className="lcsm-input" name="tranchee" placeholder="ex : T-03" value={form.tranchee} onChange={handleChange} /></Field>
              <Field label="Niveau"><input type="text" className="lcsm-input" name="niveau" placeholder="ex : −45 m" value={form.niveau} onChange={handleChange} /></Field>

              <SectionLabel num="02" title="Données de Production" />
              <Field label="Volume Cassé"><input type="number" className="lcsm-input" name="volume_casse" placeholder="tonnes" value={form.volume_casse} onChange={handleChange} /></Field>
              <Field label="Granulométrie"><input type="number" className="lcsm-input" name="granulometrie" placeholder="mm" value={form.granulometrie} onChange={handleChange} /></Field>
              <Field label="Type de Roche">
                <select className="lcsm-select" name="type_roche" value={form.type_roche} onChange={handleChange}>
                  <option value="">— Sélectionner —</option>
                  <option value="Phosphate">Phosphate</option>
                  <option value="Silex">Silex</option>
                  <option value="Calcaire">Calcaire</option>
                  <option value="Argile">Argile</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </Field>
              <Field label="Nombre de Coups"><input type="number" className="lcsm-input" name="nombreCoups" placeholder="coups BRH" value={form.nombreCoups} onChange={handleChange} /></Field>

              <SectionLabel num="03" title="Temps & Planification" />
              <Field label="Heure de Début"><input type="time" className="lcsm-input" name="heureDebut" value={form.heureDebut} onChange={handleChange} /></Field>
              <Field label="Heure de Fin"><input type="time" className="lcsm-input" name="heureFin" value={form.heureFin} onChange={handleChange} /></Field>
              <Field label="Heures de Marche" auto><input type="number" className="lcsm-input" name="temps" value={form.temps} onChange={handleChange} placeholder="calculé auto" readOnly={!!(form.heureDebut && form.heureFin)} /></Field>
              <Field label="Poste"><input type="text" className="lcsm-input" name="poste" placeholder="Matin / Après-midi / Nuit" value={form.poste} onChange={handleChange} /></Field>

              <SectionLabel num="04" title="Personnel & Équipements" />
              <Field label="Conducteur"><input type="text" className="lcsm-input" name="conducteur" placeholder="Nom complet" value={form.conducteur} onChange={handleChange} /></Field>
              <Field label="Matricule"><input type="text" className="lcsm-input" name="matricule" placeholder="MAT-XXXX" value={form.matricule} onChange={handleChange} /></Field>

              <div className="lcsm-equip-area lcsm-full">
                <label className="lcsm-label" style={{ marginBottom: 10, display: "block" }}>Équipements Utilisés</label>
                <div className="lcsm-chips-wrap">
                  {equipOpts.map(eq => (
                    <div key={eq} className={`lcsm-chip${form.equipements.includes(eq) ? " active" : ""}`} onClick={() => toggleEquip(eq)}>{eq}</div>
                  ))}
                  <button type="button" className="lcsm-chip-add" onClick={addEquip}>+ Ajouter</button>
                </div>
              </div>

              <SectionLabel num="05" title="État Machine & Arrêts" />
              <Field label="État Machine">
                <select className={`lcsm-select${isArret ? " lcsm-select-danger" : ""}`} name="etatMachine" value={form.etatMachine} onChange={handleChange}>
                  <option>En marche</option>
                  <option>En arrêt</option>
                </select>
              </Field>

              {isArret && (
                <div className="lcsm-arret-zone lcsm-full">
                  <div className="lcsm-arret-head"><div className="lcsm-arret-dot" />Détails de l'arrêt</div>
                  <div className="lcsm-arret-grid">
                    <Field label="Nature d'arrêt"><input type="text" className="lcsm-input" name="typeArret" placeholder="Panne / Maintenance…" value={form.typeArret} onChange={handleChange} /></Field>
                    <Field label="Heure Début Arrêt"><input type="time" className="lcsm-input" name="heureDebutArret" value={form.heureDebutArret} onChange={handleChange} /></Field>
                    <Field label="Heure Fin Arrêt"><input type="time" className="lcsm-input" name="heureFinArret" value={form.heureFinArret} onChange={handleChange} /></Field>
                  </div>
                </div>
              )}

              <div className="lcsm-rendement lcsm-full">
                <div className="lcsm-rendement-left">
                  <div className="lcsm-rendement-eyebrow">Rendement Instantané · Casement</div>
                  <div className={`lcsm-rendement-value${rendement === 0 ? " zero" : ""}`}>{rendement > 0 ? rendement : "—"}</div>
                  <div className="lcsm-rendement-unit">tonnes / heure</div>
                </div>
                <div className="lcsm-rendement-right">
                  <RendementRing value={rendement} max={200} />
                  <div className="lcsm-rendement-rlabel">performance</div>
                </div>
              </div>

              <div className="lcsm-action-row">
                <button type="submit" className="lcsm-btn-submit">
                  {editIndex !== null ? "↑ Mettre à jour" : "+ Enregistrer l'opération"}
                </button>
                {editIndex !== null && (
                  <button type="button" className="lcsm-btn-cancel" onClick={reset}>Annuler</button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DashboardCasement;