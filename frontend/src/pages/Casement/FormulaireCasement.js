import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCasement, updateCasement } from "../../features/casementSlice";
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; background-size: 15px; padding-right: 38px;
  }
  .lcsm-select-danger {
    border-color: rgba(217,119,6,0.4) !important; background-color: #fffbeb !important;
    color: #92400e !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
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

  /* ── Arrêt zone ── */
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

  /* ── TOAST (inchangé) ──
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
  date: "",
  panneau: "",
  tranchee: "",
  profondeur: "",
  volume_saute: "",
  conducteur: "",
  matricule: "",
  poste: "",
  equipements: [],      // tableau des équipements cochés
  heureDebut: "",
  heureFin: "",
  temps: "",            // calculé automatiquement (ne pas saisir manuellement)
  etatMachine: "marche",
  typeArret: "",
  heureDebutArret: "",
  heureFinArret: "",
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
  const dispatch = useDispatch();

  // ── Lecture de l'état de navigation (données pré-remplies depuis Statistique_Casement) ──
  const location = useLocation();
  const navigate = useNavigate();
  const editPayload = location.state?.editData ?? null;
  const editPayloadIndex = location.state?.editIndex ?? null;

  // ── STATE ──
  const [form, setForm] = useState(() =>
    editPayload
      ? { ...EMPTY_FORM, ...editPayload, equipements: editPayload.equipements || [] }
      : EMPTY_FORM
  );
  const [editIndex, setEditIndex] = useState(editPayloadIndex);
  const [equipOpts, setEquipOpts] = useState(INITIAL_EQUIP);
  const [toasts, setToasts] = useState([]);

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
    const u = { ...form, [name]: value }; // Copie immutable du form avec le champ mis à jour

    // Recalcul automatique du temps si l'un des deux horaires change
    if (name === "heureDebut" || name === "heureFin")
      u.temps = calcTemps(
        name === "heureDebut" ? value : form.heureDebut,
        name === "heureFin"  ? value : form.heureFin
      );
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
  const addEquip = () => {
    const n = prompt("Nom du nouvel équipement");
    if (n && !equipOpts.includes(n)) setEquipOpts([...equipOpts, n]);
  };

  /**
   * reset — Remet le formulaire à son état initial vide.
   * Appelé après une soumission réussie ou un clic sur "Annuler" en mode édition.
   */
  const reset = () => {
    setForm(EMPTY_FORM);
    setEditIndex(null);
    // Effacer l'état de navigation pour éviter le re-remplissage au rechargement
    navigate(location.pathname, { replace: true, state: {} });
  };

  /**
   * handleSubmit — Soumission du formulaire.
   * - Mode création  (editIndex === null) : dispatche addCasement
   * - Mode édition   (editIndex ≥ 0)     : dispatche updateCasement avec l'index
   * Dans les deux cas, réinitialise le formulaire après dispatch.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      dispatch(updateCasement({ index: editIndex, data: form }));
      showToast("warning", "Opération modifiée", "Les données du casement ont été mises à jour avec succès.");
    } else {
      dispatch(addCasement(form));
      showToast("success", "Opération enregistrée", "Le nouveau casement a bien été ajouté à l'historique.");
    }
    reset();
  };

  /* ────────────────────────────────────────────────────────────────────────
     VALEURS CALCULÉES
  ──────────────────────────────────────────────────────────────────────── */

  /**
   * rendement — Rendement instantané en tonnes/heure.
   * Formule : volume_saute ÷ temps (heures de marche)
   * Retourne 0 si le temps n'est pas encore renseigné.
   */
  const rendement = form.temps > 0
    ? parseFloat((form.volume_saute / form.temps).toFixed(2))
    : 0;

  /**
   * isArret — Booléen indiquant si la machine est en arrêt.
   * Utilise la valeur interne "arret" (sans accent) pour éviter les bugs d'encodage.
   * Contrôle l'affichage conditionnel du bloc "Détails de l'arrêt".
   */
  const isArret = form.etatMachine === "arret";

  /* ── RENDER ── */

  return (
    <div className="lcsm-root">
      <style>{CSS}</style>
      <LcsmToast toasts={toasts} onClose={closeToast}/>
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

              <Field label="Profondeur">
                <input type="text" className="lcsm-input" name="profondeur"
                  placeholder="ex : −45 m" value={form.profondeur} onChange={handleChange} />
              </Field>

              {/* ── 02 · PRODUCTION ── */}
              <SectionLabel num="02" title="Données de Production" />

              <Field label="Volume Sauté">
                <input type="number" className="lcsm-input" name="volume_saute"
                  placeholder="tonnes" value={form.volume_saute} onChange={handleChange} />
              </Field>

              {/* ── 03 · TEMPS ── */}
              <SectionLabel num="03" title="Temps & Planification" />

              <Field label="Heure de Début">
                <input type="time" className="lcsm-input" name="heureDebut"
                  value={form.heureDebut} onChange={handleChange} />
              </Field>

              <Field label="Heure de Fin">
                <input type="time" className="lcsm-input" name="heureFin"
                  value={form.heureFin} onChange={handleChange} />
              </Field>

              <Field label="Heures de Marche" auto>
                <input type="number" className="lcsm-input" name="temps"
                  value={form.temps} readOnly placeholder="calculé auto" />
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
                  <option value="Matin">Matin</option>
                  <option value="Après-midi">Après-midi</option>
                  <option value="Nuit">Nuit</option>
                </select>
              </Field>

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
                    </div>
                  ))}
                  <button type="button" className="lcsm-chip-add" onClick={addEquip}>
                    Ajouter équipement
                  </button>
                </div>
              </div>

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

              {/* ── RENDEMENT ── */}
              <div className="lcsm-rendement lcsm-full">
                <div className="lcsm-rendement-left">
                  <div className="lcsm-rendement-eyebrow">Rendement Instantané · Casement</div>
                  <div className={`lcsm-rendement-value${rendement === 0 ? " zero" : ""}`}>
                    {rendement > 0 ? rendement : "—"}
                  </div>
                  <div className="lcsm-rendement-unit">tonnes / heure</div>
                </div>
                <div className="lcsm-rendement-right">
                  <RendementRing value={rendement} max={200} />
                  <div className="lcsm-rendement-rlabel">performance</div>
                </div>
              </div>

              {/* ── ACTIONS ── */}
              <div className="lcsm-action-row">
                <button type="submit" className="lcsm-btn-submit">
                  {editIndex !== null ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13"/><polyline points="7 3 7 8 15 8"/></svg> Mettre à jour</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Enregistrer l'opération</>
                  )}
                </button>
                {editIndex !== null && (
                  <button type="button" className="lcsm-btn-cancel" onClick={reset}>
                    Annuler
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Gestion;