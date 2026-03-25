import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCasement, updateCasement, deleteCasement, fetchCasements } from "../../features/casementSlice";
import image from "../../images/image3.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   CASEMENT  — DASHBOARD FORM
   CHANGES:
   ✅ Supprimé : le compteur / nombre d'opérations
   ✅ Supprimé : granulométrie, type_roche, nombreCoups
   ✅ Renommé  : niveau → profondeur  |  volume_casse → volume_saute
   ✅ Conservé : Date, Panneau, Tranchée, Profondeur, Volume Sauté,
                 Heure Début, Heure Fin, Heures de Marche (AUTO),
                 Conducteur, Matricule, Poste (select),
                 Équipements fixes (7500M1,7500M2,P&H1,P&H2,200B1),
                 État Machine (+ détails arrêt conditionnel)
   ✅ Supprimé : bouton "+ Ajouter équipement" (liste fixe)
═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  /* ── Animations (identiques Dashboard) ── */
  @keyframes lcsm-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lcsm-shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes lcsm-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes lcsm-stripe   { from{background-position:0%} to{background-position:200%} }
  @keyframes lcsm-riseIn   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lcsm-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
  @keyframes lcsm-arretReveal { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lcsm-sweep    { 0%{left:-100%} 50%{left:150%} 100%{left:150%} }

  /* ── Root & Tokens (alignés Dashboard) ── */
  .lcsm-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: #f0fdf4;
    padding: 32px 28px 60px;
    color: #14532d;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background décoratif (identique Dashboard) ── */
  .lcsm-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 100% 0%,  rgba(220,252,231,0.6) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 0% 100%, rgba(187,247,208,0.35) 0%, transparent 55%);
  }
  .lcsm-dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(20,83,45,0.05) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%);
  }
  .lcsm-leaf { display: none; } /* retiré — Dashboard n'a pas de feuilles */
  .lcsm-page { position: relative; z-index: 1; }

  /* ── Header (style Hero Dashboard) ── */
  .lcsm-header {
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 20px;
    padding: 32px 36px;
    margin-bottom: 28px;
    position: relative; overflow: hidden;
    opacity: 0; animation: lcsm-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s forwards;
  }
  .lcsm-header::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg,#14532d,#16a34a,#10b981,#16a34a,#14532d);
    background-size: 200% 100%; animation: lcsm-stripe 4s linear infinite;
  }
  .lcsm-vol-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.22em;
    text-transform: uppercase; color: #16a34a;
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .lcsm-vol-label::before {
    content: ''; width: 28px; height: 1.5px;
    background: linear-gradient(90deg,#16a34a,transparent);
  }
  .lcsm-title {
    font-size: clamp(1.8rem,3vw,2.6rem); font-weight: 800;
    color: #14532d; line-height: 1.05; margin: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .lcsm-title em {
    font-style: normal;
    background: linear-gradient(135deg,#16a34a,#10b981);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .lcsm-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .lcsm-logo {
    height: 72px; border-radius: 16px;
    border: 2px solid #bbf7d0; box-shadow: 0 8px 32px rgba(22,163,74,0.15);
    object-fit: cover; animation: lcsm-float 6s ease-in-out infinite;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .lcsm-logo:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 40px rgba(22,163,74,0.22); }
  .lcsm-pill {
    display: flex; align-items: center; gap: 5px; padding: 5px 12px;
    border-radius: 999px; background: #f0fdf4; border: 1.5px solid #bbf7d0;
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; color: #16a34a;
  }
  .lcsm-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; animation: lcsm-pulse 2.5s ease infinite; }

  /* ── Form card (aligné Dashboard .acc-kpi) ── */
  .lcsm-card {
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 20px;
    padding: 36px 36px;
    position: relative; overflow: hidden;
    opacity: 0; animation: lcsm-fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.18s forwards;
    box-shadow: 0 4px 24px rgba(22,163,74,0.07);
  }
  .lcsm-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size: 200%; animation: lcsm-shimmer 2.4s linear infinite;
  }
  .lcsm-card-wm { display: none; } /* simplifié */

  /* ── Section labels (style acc-section Dashboard) ── */
  .lcsm-section {
    display: flex; align-items: center; gap: 10px;
    grid-column: 1 / -1; margin: 24px 0 4px; padding-bottom: 10px;
    border-bottom: 1px solid #bbf7d0;
    opacity: 0; animation: lcsm-riseIn 0.45s ease forwards;
  }
  .lcsm-section:first-of-type { margin-top: 0; }
  .lcsm-section-num {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700;
    color: #fff; background: #15803d;
    width: 22px; height: 22px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(22,163,74,0.3);
  }
  .lcsm-section-title {
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a;
  }
  .lcsm-section-line { flex: 1; height: 1px; background: #bbf7d0; }

  /* ── Grid ── */
  .lcsm-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .lcsm-full { grid-column: 1 / -1; }
  @media (max-width: 900px) { .lcsm-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .lcsm-grid { grid-template-columns: 1fr; } .lcsm-card { padding: 24px 20px; } }

  /* ── Fields & Labels ── */
  .lcsm-field {
    display: flex; flex-direction: column; gap: 6px;
    opacity: 0; animation: lcsm-riseIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .lcsm-field:nth-child(1){animation-delay:.22s} .lcsm-field:nth-child(2){animation-delay:.27s}
  .lcsm-field:nth-child(3){animation-delay:.32s} .lcsm-field:nth-child(4){animation-delay:.37s}
  .lcsm-field:nth-child(5){animation-delay:.42s} .lcsm-field:nth-child(6){animation-delay:.47s}
  .lcsm-field:nth-child(7){animation-delay:.52s} .lcsm-field:nth-child(8){animation-delay:.57s}
  .lcsm-field:nth-child(9){animation-delay:.62s} .lcsm-field:nth-child(10){animation-delay:.67s}
  .lcsm-field:nth-child(11){animation-delay:.72s} .lcsm-field:nth-child(12){animation-delay:.77s}

  .lcsm-label {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af;
    display: flex; align-items: center; gap: 7px;
  }
  .lcsm-auto-badge {
    font-size: 8px; font-weight: 600; color: #16a34a;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    padding: 1px 7px; border-radius: 20px;
  }

  /* ── Inputs & Selects ── */
  .lcsm-input, .lcsm-select {
    width: 100%; box-sizing: border-box;
    padding: 11px 14px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 10px;
    color: #111827;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
    outline: none;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 1px 3px rgba(20,83,45,0.04), inset 0 1px 0 rgba(255,255,255,0.8);
    -webkit-appearance: none; appearance: none;
  }
  .lcsm-input::placeholder { color: #d1d5db; font-size: 12px; }
  .lcsm-input:hover:not(:focus), .lcsm-select:hover:not(:focus) {
    border-color: rgba(22,163,74,0.4); background: #f0fdf4;
  }
  .lcsm-input:focus, .lcsm-select:focus {
    border-color: #16a34a; background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.10), 0 2px 8px rgba(22,163,74,0.06);
    transform: translateY(-1px); color: #14532d;
  }
  .lcsm-input[readonly] {
    background: #f0fdf4; border-color: #bbf7d0;
    color: #15803d; font-weight: 700; cursor: default;
  }
  .lcsm-select {
    cursor: pointer;
    -webkit-appearance: none !important; appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; background-size: 15px; padding-right: 38px;
  }
  .lcsm-select-danger {
    border-color: rgba(217,119,6,0.4) !important; background-color: #fffbeb !important;
    color: #92400e !important;
    -webkit-appearance: none !important; appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important; background-position: right 12px center !important; background-size: 15px !important;
  }
  .lcsm-select-danger:focus { box-shadow: 0 0 0 3px rgba(217,119,6,0.1) !important; border-color: #b45309 !important; }

  /* ── Equipment chips ── */
  .lcsm-equip-area { grid-column: 1 / -1; }
  .lcsm-chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .lcsm-chip {
    padding: 8px 18px; border: 1.5px solid #bbf7d0; border-radius: 999px;
    background: #fff; color: #6b7280;
    font-family: 'DM Mono', monospace; font-size: 12px;
    cursor: pointer; transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    user-select: none; box-shadow: 0 1px 3px rgba(20,83,45,0.05);
    font-weight: 600;
  }
  .lcsm-chip:hover { border-color: #16a34a; color: #14532d; background: #f0fdf4; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(22,163,74,0.12); }
  .lcsm-chip.active {
    background: linear-gradient(135deg,#15803d,#16a34a); border-color: #15803d;
    color: #fff; font-weight: 700; box-shadow: 0 4px 14px rgba(21,128,61,0.3);
  }
  .lcsm-chip.active::before { content: '✓  '; font-size: 10px; }
  .lcsm-chip-delete {
    display: inline-flex; align-items: center; justify-content: center;
    margin-left: 6px; width: 16px; height: 16px; border-radius: 50%;
    background: rgba(220,38,38,0.12); color: #dc2626;
    font-size: 11px; font-weight: 700; line-height: 1;
    border: none; cursor: pointer; flex-shrink: 0;
    transition: all 0.18s; padding: 0;
  }
  .lcsm-chip-delete:hover { background: #dc2626; color: #fff; transform: scale(1.2); }
  .lcsm-chip.active .lcsm-chip-delete { background: rgba(255,255,255,0.25); color: #fff; }
  .lcsm-chip.active .lcsm-chip-delete:hover { background: rgba(220,38,38,0.85); }
  .lcsm-chip-add {
    position: relative; overflow: hidden; padding: 8px 20px;
    border: none; border-radius: 999px;
    background: linear-gradient(135deg,#15803d,#16a34a); color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 14px rgba(21,128,61,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1); user-select: none;
  }
  .lcsm-chip-add::before { content: '+'; display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; background: rgba(255,255,255,0.2); border-radius: 50%; font-size: 14px; font-weight: 700; line-height: 1; flex-shrink: 0; }
  .lcsm-chip-add::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform: skewX(-20deg); transition: left 0.45s ease; }
  .lcsm-chip-add:hover::after { left: 160%; }
  .lcsm-chip-add:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(21,128,61,0.4); background: linear-gradient(135deg,#16a34a,#10b981); }
  .lcsm-chip-add:active { transform: translateY(0); }

  /* ── Arrêts par équipement ── */
  .lcsm-arret-equip {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #fffbeb, #fff9ec);
    border: 1.5px solid rgba(217,119,6,0.25);
    border-radius: 16px; padding: 20px 24px; margin-top: 4px;
    animation: lcsm-arretReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
    box-shadow: 0 4px 20px rgba(146,64,14,0.06);
  }
  .lcsm-arret-equip-head {
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #b45309;
    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
  }
  .lcsm-arret-equip-rows { display: flex; flex-direction: column; gap: 10px; }
  .lcsm-arret-equip-row {
    display: grid; grid-template-columns: 90px 1fr 1fr 1fr 70px;
    gap: 10px; align-items: end;
  }
  @media (max-width: 720px) { .lcsm-arret-equip-row { grid-template-columns: 1fr 1fr; } }
  .lcsm-equip-badge {
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700;
    color: #92400e; background: rgba(217,119,6,0.1);
    border: 1px solid rgba(217,119,6,0.25); border-radius: 8px;
    padding: 9px 8px; text-align: center; align-self: center;
  }
  .lcsm-arret-duree-badge {
    font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 800;
    color: #b45309; background: #fff; border: 1.5px solid rgba(217,119,6,0.2);
    border-radius: 10px; padding: 8px 10px; text-align: center; align-self: end;
  }
  .lcsm-arret-total {
    margin-top: 12px; padding-top: 10px;
    border-top: 1px dashed rgba(217,119,6,0.25);
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: #b45309; font-weight: 700;
    display: flex; gap: 24px;
  }

  /* ── KPI Cards OEE / TU / TD ── */
  .lcsm-kpi-banner {
    grid-column: 1 / -1;
    display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
    opacity: 0; animation: lcsm-riseIn 0.6s ease 0.85s forwards;
  }
  @media (max-width: 900px) { .lcsm-kpi-banner { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px) { .lcsm-kpi-banner { grid-template-columns: 1fr; } }
  .lcsm-kpi {
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
    padding: 16px 18px; position: relative; overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    transition: transform .2s, box-shadow .2s;
  }
  .lcsm-kpi:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.09); }
  .lcsm-kpi-stripe {
    position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0;
  }
  .lcsm-kpi-top {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
  }
  .lcsm-kpi-name {
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af;
  }
  .lcsm-kpi-num {
    font-size: 2.2rem; font-weight: 800; line-height: 1;
    font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.02em;
  }
  .lcsm-kpi-unit-row {
    font-family: 'DM Mono', monospace; font-size: 10px; color: #9ca3af; margin-top: 4px;
  }
  /* Barre de progression sous chaque KPI */
  .lcsm-kpi-bar-bg {
    height: 5px; background: #f3f4f6; border-radius: 999px;
    overflow: hidden; margin-top: 10px;
  }
  .lcsm-kpi-bar-fill {
    height: 100%; border-radius: 999px;
    transition: width .8s cubic-bezier(0.16,1,0.3,1);
  }
  .lcsm-kpi-formula {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #d1d5db; margin-top: 8px;
  }

  /* ── Arrêt zone (global) ── */
  .lcsm-arret-zone {
    grid-column: 1 / -1;
    background: linear-gradient(135deg,#fffbeb,#fff9ec);
    border: 1.5px solid rgba(217,119,6,0.25); border-radius: 16px;
    padding: 20px 24px; position: relative;
    animation: lcsm-arretReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
    box-shadow: 0 4px 20px rgba(146,64,14,0.06);
  }
  .lcsm-arret-zone::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px; background: linear-gradient(180deg,#b45309,#92400e); border-radius: 16px 0 0 16px; }
  .lcsm-arret-head { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #b45309; }
  .lcsm-arret-dot { width: 7px; height: 7px; border-radius: 50%; background: #b45309; box-shadow: 0 0 0 3px rgba(180,83,9,0.15); animation: lcsm-pulse 1.4s ease infinite; }
  .lcsm-arret-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .lcsm-arret-zone .lcsm-input { background: #fff; border-color: rgba(217,119,6,0.2); }
  .lcsm-arret-zone .lcsm-input:focus { border-color: #b45309; box-shadow: 0 0 0 3px rgba(217,119,6,0.08); color: #92400e; }

  /* ── Rendement banner ── */
  .lcsm-rendement {
    grid-column: 1 / -1;
    display: flex; align-items: stretch;
    background: linear-gradient(135deg,#14532d 0%,#15803d 50%,#16a34a 80%,#10b981 100%);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 12px 40px rgba(21,128,61,0.28), 0 4px 12px rgba(21,128,61,0.16);
    position: relative;
    opacity: 0; animation: lcsm-riseIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s forwards;
  }
  .lcsm-rendement::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); animation: lcsm-sweep 4s ease-in-out 1.5s infinite; }
  .lcsm-rendement-left { flex: 1; padding: 26px 32px; position: relative; z-index: 1; }
  .lcsm-rendement-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 8px; }
  .lcsm-rendement-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 3.6rem; font-weight: 800; line-height: 1; color: #fff; letter-spacing: -0.02em; transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .lcsm-rendement-value.zero { color: rgba(255,255,255,0.3); }
  .lcsm-rendement-unit { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 6px; }
  .lcsm-rendement-right { width: 150px; flex-shrink: 0; background: rgba(0,0,0,0.1); border-left: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 20px; position: relative; z-index: 1; }
  .lcsm-ring-wrap { position: relative; width: 84px; height: 84px; }
  .lcsm-ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .lcsm-ring-track { fill: none; stroke: rgba(255,255,255,0.15); stroke-width: 5; }
  .lcsm-ring-progress { fill: none; stroke: rgba(255,255,255,0.9); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 245; stroke-dashoffset: 245; transition: stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 0 6px rgba(255,255,255,0.4)); }
  .lcsm-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.9); }
  .lcsm-ring-pct { font-size: 13px; font-weight: 600; line-height: 1; }
  .lcsm-ring-sub { font-size: 9px; opacity: 0.55; }
  .lcsm-rendement-rlabel { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.1em; text-align: center; }

  /* ── Action buttons (identiques Dashboard .acc-btn-primary) ── */
  .lcsm-action-row {
    grid-column: 1 / -1; display: flex; gap: 12px; align-items: center;
    padding-top: 10px;
    opacity: 0; animation: lcsm-riseIn 0.5s ease 1.1s forwards;
  }
  .lcsm-btn-submit {
    position: relative; overflow: hidden;
    padding: 12px 32px;
    background: linear-gradient(135deg,#15803d,#16a34a);
    border: none; border-radius: 12px; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; box-shadow: 0 4px 14px rgba(22,163,74,0.3);
  }
  .lcsm-btn-submit::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transform: skewX(-20deg); transition: left 0.5s ease; }
  .lcsm-btn-submit:hover::before { left: 160%; }
  .lcsm-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.35); background: linear-gradient(135deg,#16a34a,#10b981); }
  .lcsm-btn-submit:active { transform: translateY(0); }
  .lcsm-btn-cancel {
    padding: 11px 22px; background: #fff; color: #15803d;
    border: 1.5px solid #bbf7d0; border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .lcsm-btn-cancel:hover { background: #f0fdf4; border-color: #16a34a; transform: translateY(-1px); }

  /* ── TOAST ── */
  @keyframes lcsm-toastIn  { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
  @keyframes lcsm-toastOut { from { opacity:1; transform:translateX(0);    } to { opacity:0; transform:translateX(110%); } }
  @keyframes lcsm-bar { from { width:100%; } to { width:0%; } }
  .lcsm-toast-wrap { position:fixed; bottom:28px; right:28px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
  .lcsm-toast {
    pointer-events:all; min-width:300px; max-width:380px; background:#fff;
    border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.13); overflow:hidden;
    animation:lcsm-toastIn 0.42s cubic-bezier(0.16,1,0.3,1) forwards;
    border:1.5px solid transparent; position:relative;
  }
  .lcsm-toast.out { animation:lcsm-toastOut 0.35s cubic-bezier(0.4,0,1,1) forwards; }
  .lcsm-toast-inner { display:flex; align-items:flex-start; gap:13px; padding:16px 18px 18px; }
  .lcsm-toast-icon { width:38px; height:38px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .lcsm-toast-body { flex:1; }
  .lcsm-toast-title { font-weight:700; font-size:14px; margin-bottom:2px; }
  .lcsm-toast-msg   { font-size:12.5px; line-height:1.45; }
  .lcsm-toast-close { background:none; border:none; cursor:pointer; font-size:18px; opacity:0.4; transition:opacity .18s; align-self:flex-start; }
  .lcsm-toast-close:hover { opacity:0.8; }
  .lcsm-toast-bar { height:3px; border-radius:0 0 16px 16px; animation:lcsm-bar linear forwards; }
  .lcsm-toast.success { border-color:#bbf7d0; }
  .lcsm-toast.success .lcsm-toast-icon  { background:#f0fdf4; color:#16a34a; }
  .lcsm-toast.success .lcsm-toast-title { color:#14532d; }
  .lcsm-toast.success .lcsm-toast-msg   { color:#15803d; }
  .lcsm-toast.success .lcsm-toast-bar   { background:linear-gradient(90deg,#16a34a,#4ade80); }
  .lcsm-toast.warning { border-color:#fde68a; }
  .lcsm-toast.warning .lcsm-toast-icon  { background:#fffbeb; color:#d97706; }
  .lcsm-toast.warning .lcsm-toast-title { color:#92400e; }
  .lcsm-toast.warning .lcsm-toast-msg   { color:#b45309; }
  .lcsm-toast.warning .lcsm-toast-bar   { background:linear-gradient(90deg,#f59e0b,#fcd34d); }
  .lcsm-toast.danger { border-color:#fecaca; }
  .lcsm-toast.danger .lcsm-toast-icon  { background:#fef2f2; color:#dc2626; }
  .lcsm-toast.danger .lcsm-toast-title { color:#7f1d1d; }
  .lcsm-toast.danger .lcsm-toast-msg   { color:#b91c1c; }
  .lcsm-toast.danger .lcsm-toast-bar   { background:linear-gradient(90deg,#ef4444,#fca5a5); }

  /* ══ CONFIRM DIALOG ══════════════════════════════════════════════════ */
  @keyframes lcsm-dlgIn { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .lcsm-dlg-overlay {
    position:fixed; inset:0; z-index:9998;
    background:rgba(0,0,0,0.35); backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center;
  }
  .lcsm-dlg {
    background:#fff; border-radius:20px; padding:32px 36px;
    max-width:400px; width:90%;
    box-shadow:0 24px 80px rgba(0,0,0,0.18);
    animation:lcsm-dlgIn 0.38s cubic-bezier(0.16,1,0.3,1) forwards;
    text-align:center;
  }
  .lcsm-dlg-icon {
    width:56px; height:56px; border-radius:16px;
    background:#fef2f2; color:#dc2626;
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 16px;
  }
  .lcsm-dlg-title { font-size:17px; font-weight:800; color:#111827; margin-bottom:8px; }
  .lcsm-dlg-msg   { font-size:13.5px; color:#6b7280; line-height:1.55; margin-bottom:24px; }
  .lcsm-dlg-btns  { display:flex; gap:10px; justify-content:center; }
  .lcsm-dlg-cancel {
    padding:10px 24px; border-radius:10px; border:1.5px solid #e5e7eb;
    background:#f9fafb; color:#374151; font-weight:600; font-size:14px;
    cursor:pointer; transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .lcsm-dlg-cancel:hover { background:#f3f4f6; border-color:#d1d5db; }
  .lcsm-dlg-confirm {
    padding:10px 28px; border-radius:10px; border:none;
    background:linear-gradient(135deg,#dc2626,#ef4444); color:#fff;
    font-weight:700; font-size:14px; cursor:pointer; transition:all .18s;
    box-shadow:0 4px 14px rgba(220,38,38,0.3); font-family:'Plus Jakarta Sans',sans-serif;
  }
  .lcsm-dlg-confirm:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(220,38,38,0.4); }

  /* ══ HISTORIQUE TABLE ════════════════════════════════════════════════ */
  .lcsm-histo-card {
    background:#fff;
    border:1.5px solid #bbf7d0;
    border-radius:20px;
    padding:32px 36px;
    margin-top:28px;
    position:relative; overflow:hidden;
    opacity:0; animation:lcsm-fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
    box-shadow:0 4px 24px rgba(22,163,74,0.07);
  }
  .lcsm-histo-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size:200%; animation:lcsm-shimmer 2.4s linear infinite;
  }
  .lcsm-histo-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:20px; flex-wrap:wrap; gap:12px;
  }
  .lcsm-histo-title-wrap { display:flex; align-items:center; gap:12px; }
  .lcsm-histo-icon {
    width:40px; height:40px; border-radius:12px;
    background:linear-gradient(135deg,#15803d,#16a34a);
    display:flex; align-items:center; justify-content:center;
    color:#fff; box-shadow:0 4px 14px rgba(21,128,61,0.3); flex-shrink:0;
  }
  .lcsm-histo-title {
    font-size:16px; font-weight:800; color:#14532d;
    font-family:'Plus Jakarta Sans',sans-serif; margin:0;
  }
  .lcsm-histo-sub {
    font-size:12px; color:#9ca3af; margin:2px 0 0;
    font-family:'DM Mono',monospace;
  }
  .lcsm-histo-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 14px; border-radius:999px;
    background:#f0fdf4; border:1.5px solid #bbf7d0;
    font-family:'DM Mono',monospace; font-size:11px; font-weight:700;
    color:#16a34a; letter-spacing:.05em;
  }
  .lcsm-histo-badge-dot {
    width:6px; height:6px; border-radius:50%; background:#10b981;
    animation:lcsm-pulse 2.5s ease infinite;
  }
  .lcsm-histo-empty {
    text-align:center; padding:48px 20px;
    color:#9ca3af; font-size:14px; font-family:'DM Mono',monospace;
  }
  .lcsm-histo-empty-icon {
    font-size:40px; margin-bottom:12px; opacity:.35;
  }

  /* ── Table wrapper ── */
  .lcsm-tbl-wrap {
    overflow-x:auto;
    border-radius:14px;
    border:1.5px solid #e5e7eb;
  }
  .lcsm-tbl {
    width:100%; border-collapse:collapse;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
  }
  .lcsm-tbl thead tr {
    background:linear-gradient(135deg,#f0fdf4,#dcfce7);
    border-bottom:2px solid #bbf7d0;
  }
  .lcsm-tbl thead th {
    padding:12px 14px; text-align:left;
    font-family:'DM Mono',monospace; font-size:9px; font-weight:700;
    letter-spacing:.14em; text-transform:uppercase; color:#16a34a;
    white-space:nowrap;
  }
  .lcsm-tbl thead th:first-child { border-radius:12px 0 0 0; }
  .lcsm-tbl thead th:last-child  { border-radius:0 12px 0 0; text-align:center; }

  .lcsm-tbl tbody tr {
    border-bottom:1px solid #f3f4f6;
    transition:background .15s;
    animation:lcsm-riseIn .35s ease both;
  }
  .lcsm-tbl tbody tr:last-child { border-bottom:none; }
  .lcsm-tbl tbody tr:hover { background:#f0fdf4; }
  .lcsm-tbl td {
    padding:12px 14px; color:#374151; vertical-align:middle;
    white-space:nowrap;
  }
  .lcsm-tbl td:last-child { text-align:center; }

  /* ── Cell badges ── */
  .lcsm-td-date {
    font-family:'DM Mono',monospace; font-size:12px;
    color:#6b7280; font-weight:600;
  }
  .lcsm-td-bold { font-weight:700; color:#14532d; }
  .lcsm-td-mono {
    font-family:'DM Mono',monospace; font-size:12px; color:#374151;
  }
  .lcsm-badge-marche {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:999px;
    background:#f0fdf4; border:1.5px solid #bbf7d0;
    color:#15803d; font-size:11px; font-weight:700;
    font-family:'DM Mono',monospace;
  }
  .lcsm-badge-marche::before {
    content:''; width:5px; height:5px; border-radius:50%;
    background:#10b981; flex-shrink:0;
  }
  .lcsm-badge-arret {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:999px;
    background:#fffbeb; border:1.5px solid #fde68a;
    color:#b45309; font-size:11px; font-weight:700;
    font-family:'DM Mono',monospace;
  }
  .lcsm-badge-arret::before {
    content:''; width:5px; height:5px; border-radius:50%;
    background:#f59e0b; flex-shrink:0;
  }
  .lcsm-kpi-pill {
    display:inline-block; padding:2px 8px; border-radius:6px;
    font-family:'DM Mono',monospace; font-size:11px; font-weight:700;
  }
  .lcsm-kpi-pill.oee { background:rgba(37,99,235,0.09); color:#1d4ed8; }
  .lcsm-kpi-pill.htp { background:rgba(13,148,136,0.09); color:#0d9488; }

  /* ── Action buttons in table ── */
  .lcsm-tbl-actions { display:flex; gap:6px; justify-content:center; }
  .lcsm-btn-edit {
    display:inline-flex; align-items:center; gap:5px;
    padding:6px 12px; border-radius:9px;
    border:1.5px solid #22c55e;
    background:rgba(34,197,94,0.08); color:#15803d;
    font-size:12px; font-weight:600; cursor:pointer;
    transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
    white-space:nowrap;
  }
  .lcsm-btn-edit:hover {
    background:#22c55e; color:#fff;
    box-shadow:0 4px 14px rgba(34,197,94,0.35);
    transform:translateY(-1px);
  }
  .lcsm-btn-del {
    display:inline-flex; align-items:center; gap:5px;
    padding:6px 12px; border-radius:9px;
    border:1.5px solid #fca5a5;
    background:rgba(239,68,68,0.06); color:#dc2626;
    font-size:12px; font-weight:600; cursor:pointer;
    transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
    white-space:nowrap;
  }
  .lcsm-btn-del:hover {
    background:#ef4444; color:#fff; border-color:#ef4444;
    box-shadow:0 4px 14px rgba(239,68,68,0.35);
    transform:translateY(-1px);
  }

  /* ── Search bar ── */
  .lcsm-histo-search {
    display:flex; align-items:center; gap:10px;
    background:#f9fafb; border:1.5px solid #e5e7eb;
    border-radius:12px; padding:9px 14px;
    transition:all .2s;
  }
  .lcsm-histo-search:focus-within {
    border-color:#16a34a;
    box-shadow:0 0 0 3px rgba(22,163,74,0.10);
    background:#fff;
  }
  .lcsm-histo-search svg { color:#9ca3af; flex-shrink:0; }
  .lcsm-histo-search input {
    border:none; outline:none; background:transparent;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
    color:#374151; width:200px;
  }
  .lcsm-histo-search input::placeholder { color:#d1d5db; }
`;

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * EMPTY_FORM — État initial (vide) du formulaire.
 * Utilisé à la création ET au reset après soumission.
 * Chaque clé correspond exactement à un champ `name` dans le JSX.
 *
 * Valeurs notables :
 *  - equipements : tableau vide → aucun équipement sélectionné au départ
 *  - etatMachine : "marche" (valeur interne sans accent, évite les bugs d'encodage)
 */
const EMPTY_FORM = {
  date:                 "",
  panneau:              "",
  tranchee:             "",
  niveau:               "",
  profondeur:           "",
  volume_saute:         "",
  conducteur:           "",
  matricule:            "",
  poste:                "",
  equipements:          [],
  heureDebutCompteur: "",
  heureFinCompteur:   "",
  temps:                "",
  htp:                  "",
  etatMachine:          "marche",
  typeArret:            "",
  heureDebutArret:      "",
  heureFinArret:        "",
};
/**
 * INITIAL_EQUIP — Liste de base des équipements disponibles.
 * L'opérateur peut en ajouter d'autres via le bouton "+ Ajouter équipement".
 * Cette liste est stockée dans le state `equipOpts` du composant.
 */
const INITIAL_EQUIP = ["7500M1", "7500M2", "P&H1", "P&H2", "200B1"];

/* ══════════════════════════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * calcTemps(d, f) — Calcule la durée en heures entre deux horaires HH:MM.
 *
 * @param {string} d - Heure de début  ex: "06:30"
 * @param {string} f - Heure de fin    ex: "14:00"
 * @returns {string} Durée en heures avec 2 décimales ex: "7.50", ou "" si invalide
 *
 * Logique :
 *  1. Convertit chaque horaire en minutes depuis minuit
 *  2. Soustrait début de fin
 *  3. Convertit en heures (÷ 60) et arrondit à 2 décimales
 *  4. Retourne "" si la différence est nulle ou négative (ex: fin < début)
 */
const calcTemps = (d, f) => {
  if (!d || !f) return "";
  const [dh, dm] = d.split(":").map(Number);
  const [fh, fm] = f.split(":").map(Number);
  const min = fh * 60 + fm - (dh * 60 + dm);
  return min > 0 ? (min / 60).toFixed(2) : "";
};

/* ══════════════════════════════════════════════════════════════════════════
   COMPOSANTS UI RÉUTILISABLES
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * SectionLabel — Séparateur visuel numéroté entre les groupes de champs.
 * Affiche : [numéro] ── TITRE ────────────────────
 *
 * @param {string} num   - Numéro de section ex: "01"
 * @param {string} title - Titre de la section ex: "Localisation & Identification"
 */
function SectionLabel({ num, title }) {
  return (
    <div className="lcsm-section lcsm-full">
      <div className="lcsm-section-num">{num}</div>
      <span className="lcsm-section-title">{title}</span>
      <div className="lcsm-section-line" />
    </div>
  );
}

/**
 * Field — Wrapper générique pour un champ de formulaire.
 * Affiche un label stylisé au-dessus du champ enfant.
 *
 * @param {string}  label    - Texte du label affiché au-dessus du champ
 * @param {node}    children - L'input, select ou autre élément de saisie
 * @param {boolean} auto     - Si true, affiche le badge "AUTO" (champ calculé automatiquement)
 */
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

/**
 * RendementRing — Anneau SVG de performance circulaire.
 * Visualise le rendement calculé sous forme de pourcentage graphique.
 *
 * @param {number} value - Rendement actuel en tonnes/heure
 * @param {number} max   - Valeur maximale de référence (défaut: 200 t/h = 100%)
 *
 * Technique SVG :
 *  - stroke-dasharray = circonférence totale (C = 245px pour r=39)
 *  - stroke-dashoffset = C × (1 - pct) → masque la portion non remplie
 *  - L'anneau est pivoté de -90° pour démarrer en haut (midi)
 */
function RendementRing({ value, max = 200 }) {
  const C = 245; // Circonférence approximative du cercle (2π × r ≈ 2π × 39)
  const pct = Math.min(Math.max(value, 0) / max, 1); // Clamp entre 0 et 1
  return (
    <div className="lcsm-ring-wrap">
      <svg viewBox="0 0 90 90">
        {/* Piste grise de fond — cercle complet */}
        <circle className="lcsm-ring-track"    cx="45" cy="45" r="39" />
        {/* Arc de progression — longueur proportionnelle au pourcentage */}
        <circle className="lcsm-ring-progress" cx="45" cy="45" r="39"
          style={{ strokeDashoffset: C * (1 - pct) }} />
      </svg>
      {/* Texte centré dans l'anneau */}
      <div className="lcsm-ring-center">
        <span className="lcsm-ring-pct">{value > 0 ? `${Math.round(pct * 100)}%` : "—"}</span>
        <span className="lcsm-ring-sub">perf.</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
══════════════════════════════════════════════════════════════════════════ */
function ConfirmDialog({ open, label, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="lcsm-dlg-overlay" onClick={onCancel}>
      <div className="lcsm-dlg" onClick={e => e.stopPropagation()}>
        <div className="lcsm-dlg-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <div className="lcsm-dlg-title">Confirmer la suppression</div>
        <div className="lcsm-dlg-msg">
          Voulez-vous vraiment supprimer l'opération <strong>«&nbsp;{label}&nbsp;»</strong> ?<br/>
          Cette action est irréversible.
        </div>
        <div className="lcsm-dlg-btns">
          <button className="lcsm-dlg-cancel" onClick={onCancel}>Annuler</button>
          <button className="lcsm-dlg-confirm" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */

/**
 * DashboardCasement — Formulaire de saisie des opérations de décapage par Casement.
 *
 * Responsabilités :
 *  1. Gérer l'état local du formulaire (form)
 *  2. Calculer automatiquement les Heures de Marche et le Rendement
 *  3. Dispatcher les actions Redux : addCasement / updateCasement
 *  4. Afficher conditionnellement les détails d'arrêt si "En arrêt"
 */

function LcsmToast({ toasts, onClose }) {
  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    danger: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
    ),
  };
  return (
    <div className="lcsm-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`lcsm-toast ${t.type}${t.out?" out":""}`}>
          <div className="lcsm-toast-inner">
            <div className="lcsm-toast-icon">{icons[t.type]}</div>
            <div className="lcsm-toast-body">
              <div className="lcsm-toast-title">{t.title}</div>
              <div className="lcsm-toast-msg">{t.msg}</div>
            </div>
            <button className="lcsm-toast-close" onClick={()=>onClose(t.id)}>×</button>
          </div>
          <div className="lcsm-toast-bar" style={{animationDuration:`${t.duration}ms`}}/>
        </div>
      ))}
    </div>
  );
}

function Gestion() {
  const dispatch  = useDispatch();
  const casements = useSelector((s) => s.casement?.list || []);

  // ── Lecture de l'état de navigation (données pré-remplies depuis Statistique_Casement) ──
  const location = useLocation();
  const navigate = useNavigate();
  const editPayload      = location.state?.editData  ?? null;
  const editPayloadIndex = location.state?.editIndex ?? null;
  const editPayloadId    = location.state?.editId    ?? null;

  // ── STATE ──
  const [form, setForm] = useState(() =>
    editPayload
      ? { ...EMPTY_FORM, ...editPayload, equipements: editPayload.equipements || [] }
      : EMPTY_FORM
  );
  const [editIndex, setEditIndex] = useState(editPayloadIndex);
  const [editId,    setEditId]    = useState(editPayloadId);
  const [equipOpts, setEquipOpts] = useState(() => {
    try {
      const saved = localStorage.getItem("casement_equipOpts");
      return saved ? JSON.parse(saved) : INITIAL_EQUIP;
    } catch { return INITIAL_EQUIP; }
  });
  const [toasts,     setToasts]     = useState([]);
  const [search,     setSearch]     = useState("");
  const [confirmDlg, setConfirmDlg] = useState({ open: false, id: null, index: null, label: "" });
  const [submitting, setSubmitting] = useState(false);

  // Charger les données depuis la BDD au montage
  useEffect(() => { dispatch(fetchCasements()); }, [dispatch]);

  const showToast = (type, title, msg, duration=4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, type, title, msg, duration, out:false}]);
    setTimeout(()=>{
      setToasts(prev => prev.map(t => t.id===id ? {...t,out:true} : t));
      setTimeout(()=> setToasts(prev => prev.filter(t => t.id!==id)), 380);
    }, duration);
  };
  const closeToast = (id) => {
    setToasts(prev => prev.map(t => t.id===id ? {...t,out:true} : t));
    setTimeout(()=> setToasts(prev => prev.filter(t => t.id!==id)), 380);
  };

  /* ────────────────────────────────────────────────────────────────────────
     HANDLER PRINCIPAL — handleChange
     Gère tous les champs texte/number/date/time/select via leur attribut `name`.
     Cas spécial : si le champ modifié est heureDebut ou heureFin,
     recalcule automatiquement le champ `temps` (Heures de Marche).
  ──────────────────────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const u = { ...form, [name]: value };

    // TB = heureFin - heureDebut (temps brut Compteur)
    if (name === "heureDebutCompteur" || name === "heureFinCompteur") {
      const debut = name === "heureDebutCompteur" ? value : form.heureDebutCompteur;
      const fin   = name === "heureFinCompteur"   ? value : form.heureFinCompteur;
      u.temps = calcTemps(debut, fin); // TB stocké dans `temps`
    }
    setForm(u);
  };

  /**
   * toggleEquip — Active/désactive un équipement dans la liste des équipements sélectionnés.
   * Si l'équipement est déjà dans le tableau → il est retiré (désélection).
   * Sinon → il est ajouté (sélection).
   * @param {string} eq - Identifiant de l'équipement ex: "7500M1"
   */
  const toggleEquip = (eq) =>
    setForm({
      ...form,
      equipements: form.equipements.includes(eq)
        ? form.equipements.filter((e) => e !== eq) // Retirer si déjà sélectionné
        : [...form.equipements, eq],               // Ajouter si non sélectionné
    });

  /**
   * addEquip — Ajoute un nouvel équipement à la liste via une boîte de dialogue.
   * Vérifie que le nom n'est pas vide et n'existe pas déjà avant d'ajouter.
   * Le nouvel équipement apparaît immédiatement dans les chips.
   */
  const saveEquipOpts = (list) => {
    setEquipOpts(list);
    try { localStorage.setItem("casement_equipOpts", JSON.stringify(list)); } catch {}
  };

  const addEquip = () => {
    const n = prompt("Nom du nouvel équipement");
    if (n && n.trim() && !equipOpts.includes(n.trim())) {
      saveEquipOpts([...equipOpts, n.trim()]);
    }
  };

  /**
   * removeEquip — Supprime un équipement de la liste des options.
   * Le retire aussi de la sélection active si nécessaire.
   */
  const removeEquip = (eq) => {
    saveEquipOpts(equipOpts.filter(e => e !== eq));
    setForm(prev => ({
      ...prev,
      equipements: prev.equipements.filter(e => e !== eq),
    }));
  };

  /**
   * reset — Remet le formulaire à son état initial vide.
   * Appelé après une soumission réussie ou un clic sur "Annuler" en mode édition.
   */
  const reset = () => {
    setForm(EMPTY_FORM);
    setEditIndex(null);
    setEditId(null); // ✅ Réinitialiser l'ID Laravel
    // Effacer l'état de navigation pour éviter le re-remplissage au rechargement
    navigate(location.pathname, { replace: true, state: {} });
  };

  // handleSubmit — async, attend la réponse API avant de reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const payload = {
      ...form,
      htp:   HTP,
      oee:   OEE,
      tu:    TU,
      td:    TD,
      temps: parseFloat(form.temps || 0),
    };
    setSubmitting(true);
    try {
      if (editIndex !== null && editId !== null) {
        console.log("Modification de l'ID :", editId, "avec les données :", payload);
        await dispatch(updateCasement({ id: editId, data: payload })).unwrap();
        showToast("warning", "Opération modifiée", "Les données ont été mises à jour dans la base de données.");
      } else {
        await dispatch(addCasement(payload)).unwrap();
        showToast("success", "Opération enregistrée", "Le casement a bien été ajouté à l'historique.");
      }
      reset();
    } catch (err) {
      // Si err est une chaîne de caractères (payload rejeté par createAsyncThunk)
      const message = typeof err === 'string' ? err : (err?.message || "Erreur de connexion au serveur.");
      showToast("danger", "Erreur API", message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── KPI ──────────────────────────────────────────────────────────────── */
  const TR = 24;
  const TB = Math.min(parseFloat(form.temps || 0), TR);
  // TA = arrêt machine global uniquement (section 05)
  const TA = Math.min(
    parseFloat(calcTemps(form.heureDebutArret, form.heureFinArret) || 0),
    TB
  );
  const HM  = Math.max(0, TB - TA);
  const HTP = Math.min(
    form.htp !== "" ? Math.max(0, parseFloat(form.htp || 0)) : HM,
    HM, TR
  );
  const nbEquip    = form.equipements.length || 1;
  const HTP_GLOBAL = HTP * nbEquip;
  // OEE = (HTP / TR) × 100
  const OEE = HTP > 0 ? parseFloat(Math.min((HTP / TR) * 100, 100).toFixed(2)) : 0;
  // TU  = (HM  / TB) × 100
  const TU  = TB  > 0 ? parseFloat(Math.min((HM  / TB) * 100, 100).toFixed(2)) : 0;
  // TD  = ((TB - TA) / TB) × 100
  const TD  = TB  > 0 ? parseFloat(Math.min(((TB - TA) / TB) * 100, 100).toFixed(2)) : 0;
  const rendement = HTP > 0
    ? parseFloat((parseFloat(form.volume_saute || 0) / HTP).toFixed(2))
    : 0;

  const isArret = form.etatMachine === "arret";

  /* ── Handlers tableau ──────────────────────────────────────────────── */
  const handleEditRow = (c, i) => {
    // Charger les données dans le formulaire — sans arretsEquipements
    const { arretsEquipements, ...rest } = c;
    setForm({ ...EMPTY_FORM, ...rest, equipements: c.equipements ?? [] });
    setEditIndex(i);
    setEditId(c.id ?? null); // id BDD → handleSubmit fera PUT /api/casements/{id}
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("warning", "Mode édition activé", `Opération du ${c.date || "—"} chargée dans le formulaire.`);
  };

  const handleDeleteRow = (i) => {
    const c = casements[i];
    const label = c
      ? `${c.date || ""} · ${c.panneau || ""} · ${c.tranchee || ""}`.replace(/^·\s*|·\s*$/g, "").trim()
      : `#${i + 1}`;
    setConfirmDlg({ open: true, id: c?.id ?? null, index: i, label });
  };

  // confirmDelete — supprime dans la BDD via DELETE /api/casements/{id}
  const confirmDelete = async () => {
    if (!confirmDlg.id) {
      showToast("danger", "Erreur", "Identifiant manquant — impossible de supprimer.");
      setConfirmDlg({ open: false, id: null, index: null, label: "" });
      return;
    }
    try {
      await dispatch(deleteCasement(confirmDlg.id)).unwrap();
      showToast("danger", "Opération supprimée", `L'enregistrement « ${confirmDlg.label} » a été supprimé de la base de données.`);
    } catch (err) {
      showToast("danger", "Erreur suppression", err?.message ?? "Erreur de connexion au serveur.");
    } finally {
      setConfirmDlg({ open: false, id: null, index: null, label: "" });
    }
  };

  /* ── Filtrage tableau ──────────────────────────────────────────────── */
  const filteredList = casements.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.date        || "").toLowerCase().includes(q) ||
      (c.panneau     || "").toLowerCase().includes(q) ||
      (c.tranchee    || "").toLowerCase().includes(q) ||
      (c.conducteur  || "").toLowerCase().includes(q) ||
      (c.matricule   || "").toLowerCase().includes(q)
    );
  });

  /* ── RENDER ── */

  return (
    <div className="lcsm-root">
      <style>{CSS}</style>
      <LcsmToast toasts={toasts} onClose={closeToast}/>
      <ConfirmDialog
        open={confirmDlg.open}
        label={confirmDlg.label}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDlg({ open: false, id: null, index: null, label: "" })}
      />
      <div className="lcsm-bg" /><div className="lcsm-dots" />
      <div className="lcsm-leaf lcsm-leaf-1" /><div className="lcsm-leaf lcsm-leaf-2" />

      <div className="lcsm-page">

        {/* ══ HEADER ══ */}
        <header className="lcsm-header">
          <div>
            <h1 className="lcsm-title">Décapage par <em>Casement</em></h1>
          </div>
          <div className="lcsm-header-right">
            <img src={image} alt="logo" className="lcsm-logo" />
          </div>
        </header>

        {/* ══ FORM CARD ══ */}
        <div className="lcsm-card">
          <div className="lcsm-card-wm" />
          <form onSubmit={handleSubmit}>
            <div className="lcsm-grid">
               {/* ── ÉQUIPEMENTS ── */}
              <div className="lcsm-equip-area lcsm-full">
                <label className="lcsm-label" style={{ marginBottom: 10, display: "block" }}>
                  Équipements Utilisés
                </label>
                <div className="lcsm-chips-wrap">
                  {equipOpts.map((eq) => (
                    <div
                      key={eq}
                      className={`lcsm-chip${form.equipements.includes(eq) ? " active" : ""}`}
                      onClick={() => toggleEquip(eq)}
                    >
                      {eq}
                      <button
                        type="button"
                        className="lcsm-chip-delete"
                        title={`Supprimer ${eq}`}
                        onClick={(e) => { e.stopPropagation(); removeEquip(eq); }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" className="lcsm-chip-add" onClick={addEquip}>
                    Ajouter équipement
                  </button>
                </div>
              </div>

              {/* ── 01 · LOCALISATION ── */}
              <SectionLabel num="01" title="Localisation & Identification" />

              <Field label="Date">
                <input type="date" className="lcsm-input" name="date"
                  value={form.date} onChange={handleChange} required />
              </Field>

              <Field label="Panneau">
                <input type="text" className="lcsm-input" name="panneau"
                  placeholder="ex : P-12" value={form.panneau} onChange={handleChange} />
              </Field>

              <Field label="Tranchée">
                <input type="text" className="lcsm-input" name="tranchee"
                  placeholder="ex : T-03" value={form.tranchee} onChange={handleChange} />
              </Field>
               <Field label="Niveau">
                <input type="text" className="lcsm-input" name="niveau"
                  placeholder="ex : N-1" value={form.niveau} onChange={handleChange} />
              </Field>   
              <Field label="Profondeur">
                <input type="text" className="lcsm-input" name="profondeur"
                  placeholder="ex : −45 m" value={form.profondeur} onChange={handleChange} />
              </Field>

              {/* ── 02 · PRODUCTION ── */}
              <SectionLabel num="02" title="Données de Production" />

              <Field label="Volume Sauté">
                <input type="number" className="lcsm-input" name="volume_saute"
                  placeholder="m²" value={form.volume_saute} onChange={handleChange} />
              </Field>

              {/* ── 03 · TEMPS ── */}
              <SectionLabel num="03" title="Temps & Planification" />

              <Field label="Début du Compteur">
                <input type="time" className="lcsm-input" name="heureDebutCompteur"
                  value={form.heureDebutCompteur} onChange={handleChange} />
              </Field>

              <Field label="Fin du Compteur">
                <input type="time" className="lcsm-input" name="heureFinCompteur"
                  value={form.heureFinCompteur} onChange={handleChange} />
              </Field>

              <Field label="hHeur de marche" auto>
                <input type="number" className="lcsm-input" name="temps"
                  value={form.temps} readOnly placeholder="calculé auto" />
              </Field>

              <Field label="HTP — Heures Travail Pur">
                <input type="number" className="lcsm-input" name="htp"
                  value={form.htp}
                  onChange={handleChange}
                  placeholder={TB > 0 ? `auto : ${Math.max(0, TB - TA).toFixed(2)} h` : "ex : 6.5"}
                  min="0" max="24" step="0.01"
                />
              </Field>

              {/* ── 04 · PERSONNEL ── */}
              <SectionLabel num="04" title="Personnel" />

              <Field label="Conducteur">
                <input type="text" className="lcsm-input" name="conducteur"
                  placeholder="Nom complet" value={form.conducteur} onChange={handleChange} />
              </Field>

              <Field label="Matricule">
                <input type="text" className="lcsm-input" name="matricule"
                  placeholder="MAT-XXXX" value={form.matricule} onChange={handleChange} />
              </Field>

              <Field label="Poste">
                <select className="lcsm-select" name="poste"
                  value={form.poste} onChange={handleChange}>
                  <option value="">— Sélectionner —</option>
                  <option value="1er">1er </option>
                  <option value="2eme">2ème </option>
                  <option value="3eme">3ème </option>
                </select>
              </Field>

             

              {/* ── 05 · ÉTAT MACHINE ── */}
              <SectionLabel num="05" title="État Machine & Arrêts" />

              <Field label="État Machine">
                <select
                  className={`lcsm-select${isArret ? " lcsm-select-danger" : ""}`}
                  name="etatMachine" value={form.etatMachine} onChange={handleChange}
                >
                  <option value="marche">En marche</option>
                  <option value="arret">En arrêt</option>
                </select>
              </Field>

              {isArret && (
                <div className="lcsm-arret-zone lcsm-full">
                  <div className="lcsm-arret-head">
                    <div className="lcsm-arret-dot" />Détails de l'arrêt
                  </div>
                  <div className="lcsm-arret-grid">
                    <Field label="Nature d'arrêt">
                      <input type="text" className="lcsm-input" name="typeArret"
                        placeholder="Panne / Maintenance…"
                        value={form.typeArret} onChange={handleChange} />
                    </Field>
                    <Field label="Heure Début Arrêt">
                      <input type="time" className="lcsm-input" name="heureDebutArret"
                        value={form.heureDebutArret} onChange={handleChange} />
                    </Field>
                    <Field label="Heure Fin Arrêt">
                      <input type="time" className="lcsm-input" name="heureFinArret"
                        value={form.heureFinArret} onChange={handleChange} />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── 06 · INDICATEURS KPI ── */}
              <SectionLabel num="06" title="Indicateurs de Performance (OEE · TU · TD)" />

              <div className="lcsm-kpi-banner">

                {/* HM — Heures de Marche */}
                <div className="lcsm-kpi">
                  <div className="lcsm-kpi-stripe" style={{background:"linear-gradient(90deg,#16a34a,#4ade80)"}}/>
                  <div className="lcsm-kpi-top">
                    <span className="lcsm-kpi-name">HM</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="lcsm-kpi-num" style={{color:"#15803d"}}>
                    {HM > 0 ? `${HM.toFixed(2)}` : "—"}
                  </div>
                  <div className="lcsm-kpi-unit-row">heures de marche</div>
                  <div className="lcsm-kpi-bar-bg">
                    <div className="lcsm-kpi-bar-fill" style={{width:`${TB > 0 ? Math.min((HM/TB)*100,100) : 0}%`, background:"#16a34a"}}/>
                  </div>
                  <div className="lcsm-kpi-formula">TB({TB.toFixed(1)}) − TA({TA.toFixed(1)})</div>
                </div>

                {/* HTP */}
                <div className="lcsm-kpi">
                  <div className="lcsm-kpi-stripe" style={{background:"linear-gradient(90deg,#0891b2,#67e8f9)"}}/>
                  <div className="lcsm-kpi-top">
                    <span className="lcsm-kpi-name">HTP</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div className="lcsm-kpi-num" style={{color:"#0e7490"}}>
                    {HTP > 0 ? `${HTP.toFixed(2)}` : "—"}
                  </div>
                  <div className="lcsm-kpi-unit-row">heures de travail pur</div>
                  <div className="lcsm-kpi-bar-bg">
                    <div className="lcsm-kpi-bar-fill" style={{width:`${Math.min((HTP/TR)*100,100)}%`, background:"#0891b2"}}/>
                  </div>
                  <div className="lcsm-kpi-formula">
                    {form.htp !== "" ? `Manuel · HM max = ${HM.toFixed(2)}` : `= HM (${HM.toFixed(2)} h)`}
                  </div>
                </div>

                {/* OEE = HTP / TR × 100 */}
                <div className="lcsm-kpi">
                  <div className="lcsm-kpi-stripe" style={{background:"linear-gradient(90deg,#2563eb,#60a5fa)"}}/>
                  <div className="lcsm-kpi-top">
                    <span className="lcsm-kpi-name">OEE</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  </div>
                  <div className="lcsm-kpi-num" style={{color:"#1d4ed8"}}>
                    {OEE > 0 ? `${OEE}%` : "—"}
                  </div>
                  <div className="lcsm-kpi-unit-row">efficience globale équipement</div>
                  <div className="lcsm-kpi-bar-bg">
                    <div className="lcsm-kpi-bar-fill" style={{width:`${Math.min(OEE,100)}%`, background:"#2563eb"}}/>
                  </div>
                  <div className="lcsm-kpi-formula">(HTP / TR) × 100 · TR = {TR}h</div>
                </div>

                {/* TU = HM / TB × 100 */}
                <div className="lcsm-kpi">
                  <div className="lcsm-kpi-stripe" style={{background:"linear-gradient(90deg,#d97706,#fcd34d)"}}/>
                  <div className="lcsm-kpi-top">
                    <span className="lcsm-kpi-name">TU</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div className="lcsm-kpi-num" style={{color:"#b45309"}}>
                    {TU > 0 ? `${TU}%` : "—"}
                  </div>
                  <div className="lcsm-kpi-unit-row">taux d'utilisation</div>
                  <div className="lcsm-kpi-bar-bg">
                    <div className="lcsm-kpi-bar-fill" style={{width:`${Math.min(TU,100)}%`, background:"#d97706"}}/>
                  </div>
                  <div className="lcsm-kpi-formula">(HM / TB) × 100 · HM = {HM.toFixed(2)}h</div>
                </div>

                {/* TD = (TB - TA) / TB × 100 */}
                <div className="lcsm-kpi">
                  <div className="lcsm-kpi-stripe" style={{background:"linear-gradient(90deg,#7c3aed,#c4b5fd)"}}/>
                  <div className="lcsm-kpi-top">
                    <span className="lcsm-kpi-name">TD</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="lcsm-kpi-num" style={{color:"#6d28d9"}}>
                    {TD > 0 ? `${TD}%` : "—"}
                  </div>
                  <div className="lcsm-kpi-unit-row">taux de disponibilité</div>
                  <div className="lcsm-kpi-bar-bg">
                    <div className="lcsm-kpi-bar-fill" style={{width:`${Math.min(TD,100)}%`, background:"#7c3aed"}}/>
                  </div>
                  <div className="lcsm-kpi-formula">((TB − TA) / TB) × 100 · TA = {TA.toFixed(2)}h</div>
                </div>

              </div>

              {/* Multi-équipements : HTP global */}
              {nbEquip > 1 && HTP > 0 && (
                <div className="lcsm-full" style={{
                  background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
                  border:"1.5px solid #bbf7d0", borderRadius:12, padding:"12px 18px",
                  fontFamily:"'DM Mono',monospace", fontSize:12, color:"#14532d",
                  display:"flex", gap:24, alignItems:"center", flexWrap:"wrap",
                }}>
                  <span style={{fontWeight:700,fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"#16a34a"}}>
                    Multi-équipements ({nbEquip} machines)
                  </span>
                  <span>HTP global : <strong>{HTP_GLOBAL.toFixed(2)} h</strong> ({nbEquip} × {HTP.toFixed(2)})</span>
                  <span>OEE global : <strong>{HTP_GLOBAL > 0 ? ((HTP_GLOBAL / (TR * nbEquip)) * 100).toFixed(2) : 0}%</strong></span>
                </div>
              )}

              {/* ── RENDEMENT ── */}
              <div className="lcsm-rendement lcsm-full">
                <div className="lcsm-rendement-left">
                  <div className="lcsm-rendement-eyebrow">Rendement · Casement (basé sur HTP)</div>
                  <div className={`lcsm-rendement-value${rendement === 0 ? " zero" : ""}`}>
                    {rendement > 0 ? rendement : "—"}
                  </div>
                  <div className="lcsm-rendement-unit">
                    m² / heure &nbsp;·&nbsp; HM = {HM > 0 ? `${HM.toFixed(2)} h` : "—"} &nbsp;·&nbsp; HTP = {HTP > 0 ? `${HTP.toFixed(2)} h` : "—"}
                  </div>
                </div>
                <div className="lcsm-rendement-right">
                  <RendementRing value={rendement} max={200} />
                  <div className="lcsm-rendement-rlabel">performance</div>
                </div>
              </div>

              {/* ── ACTIONS ── */}
              <div className="lcsm-action-row">
                <button type="submit" className="lcsm-btn-submit" disabled={submitting}>
                  {editIndex !== null ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13"/><polyline points="7 3 7 8 15 8"/></svg>
                    {submitting ? "Mise à jour…" : "Mettre à jour"}</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {submitting ? "Enregistrement…" : "Enregistrer l'opération"}</>
                  )}
                </button>
                {editIndex !== null && (
                  <button type="button" className="lcsm-btn-cancel" onClick={reset} disabled={submitting}>
                    Annuler
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>

        {/* ══ TABLEAU HISTORIQUE ══ */}
        <div className="lcsm-histo-card">
          {/* Header */}
          <div className="lcsm-histo-header">
            <div className="lcsm-histo-title-wrap">
              <div className="lcsm-histo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div>
                <p className="lcsm-histo-title">Historique des opérations</p>
                <p className="lcsm-histo-sub">{casements.length} enregistrement{casements.length !== 1 ? "s" : ""} au total</p>
              </div>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
              {/* Search */}
              <div className="lcsm-histo-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {/* Count badge */}
              <div className="lcsm-histo-badge">
                <div className="lcsm-histo-badge-dot"/>
                {filteredList.length} résultat{filteredList.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Table or empty state */}
          {casements.length === 0 ? (
            <div className="lcsm-histo-empty">
              <div className="lcsm-histo-empty-icon">📋</div>
              <div>Aucune opération enregistrée pour l'instant.</div>
              <div style={{fontSize:12,marginTop:6,opacity:.6}}>Remplissez le formulaire ci-dessus pour commencer.</div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="lcsm-histo-empty">
              <div className="lcsm-histo-empty-icon">🔍</div>
              <div>Aucun résultat pour « {search} »</div>
            </div>
          ) : (
            <div className="lcsm-tbl-wrap">
              <table className="lcsm-tbl">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Panneau</th>
                    <th>Tranchée</th>
                    <th>Profondeur</th>
                    <th>Volume (m²)</th>
                    <th>Équipements</th>
                    <th>Conducteur</th>
                    <th>Matricule</th>
                    <th>Poste</th>
                    <th>TB (h)</th>
                    <th>HTP (h)</th>
                    <th>OEE</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((c, i) => {
                    const realIndex = casements.findIndex(
                      x => x === c || x.id === c.id
                    );
                    return (
                      <tr key={c.id ?? i} style={{animationDelay:`${i * 0.04}s`}}>
                        <td className="lcsm-td-mono" style={{color:"#9ca3af"}}>{realIndex + 1}</td>
                        <td className="lcsm-td-date">{c.date || "—"}</td>
                        <td className="lcsm-td-bold">{c.panneau || "—"}</td>
                        <td className="lcsm-td-mono">{c.tranchee || "—"}</td>
                        <td className="lcsm-td-mono">{c.profondeur || "—"}</td>
                        <td>
                          <span className="lcsm-td-bold" style={{color:"#15803d"}}>
                            {Number(c.volume_saute || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="lcsm-td-mono" style={{maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>
                          {(c.equipements || []).join(", ") || "—"}
                        </td>
                        <td className="lcsm-td-bold" style={{fontWeight:600}}>{c.conducteur || "—"}</td>
                        <td className="lcsm-td-mono">{c.matricule || "—"}</td>
                        <td className="lcsm-td-mono">{c.poste || "—"}</td>
                        <td className="lcsm-td-mono">
                          {Number(c.temps || 0) > 0 ? Number(c.temps).toFixed(2) : "—"}
                        </td>
                        <td>
                          <span className="lcsm-kpi-pill htp">
                            {Number(c.htp || 0) > 0 ? Number(c.htp).toFixed(2) : "—"}
                          </span>
                        </td>
                        <td>
                          <span className="lcsm-kpi-pill oee">
                            {Number(c.oee || 0) > 0 ? `${c.oee}%` : "—"}
                          </span>
                        </td>
                        <td>
                          {c.etatMachine === "marche"
                            ? <span className="lcsm-badge-marche">Marche</span>
                            : <span className="lcsm-badge-arret">Arrêt</span>
                          }
                        </td>
                        <td>
                          <div className="lcsm-tbl-actions">
                            <button
                              type="button"
                              className="lcsm-btn-edit"
                              onClick={() => handleEditRow(c, realIndex)}
                              title="Modifier cette opération"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Modifier
                            </button>
                            <button
                              type="button"
                              className="lcsm-btn-del"
                              onClick={() => handleDeleteRow(realIndex)}
                              title="Supprimer cette opération"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Gestion;