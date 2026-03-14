import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "../../images/image3.webp";

/* ══════════════════════════════════════════════════════════════════════════
   AccueilleCasement — Page d'accueil du module Casement
   AMÉLIORATIONS : Section INFO entièrement redessinée
══════════════════════════════════════════════════════════════════════════ */

const SLIDES = {
  saisie: [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  ],
  historique: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80",
    "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=600&q=80",
  ],
  rapport: [
    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=600&q=80",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=600&q=80",
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
  ],
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

  .acc-csm * { box-sizing: border-box; margin: 0; padding: 0; }

  .acc-csm {
    font-family: 'Epilogue', sans-serif;
    background: #ffffff;
    color: #111827;
    min-height: 100vh;
  }

  /* ════════════════════════════
     SECTION 1 — HERO (inchangé)
  ════════════════════════════ */

  .acc-csm-hero { position: relative; height: 420px; overflow: hidden; }

  .acc-csm-hero-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    filter: brightness(0.55);
  }

  .acc-csm-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(20,83,45,0.75) 0%, rgba(0,0,0,0.3) 100%);
  }

  .acc-csm-hero-content {
    position: absolute;
    bottom: 48px; left: 48px; right: 48px;
    max-width: 560px;
  }

  .acc-csm-hero h1 {
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 900; color: #fff;
    line-height: 1.1; margin-bottom: 14px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  .acc-csm-hero h1 span { color: #86efac; }

  .acc-csm-hero p {
    font-size: 15px;
    color: rgba(255,255,255,0.85);
    line-height: 1.65; max-width: 440px;
  }

  @keyframes acc-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(1.5); }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 2 — INFO  ★ ENTIÈREMENT REDESSINÉE ★
     Améliorations :
       • Fond dégradé blanc → vert très pâle
       • Cercles décoratifs de fond (::before / ::after)
       • Badge eyebrow avec point pulsant
       • Titre avec <em> souligné par un trait animé shimmer
       • Définition dans un encadré à bordure gauche verte
       • Cartes avec numéro filigrane (data-num via ::before)
       • Trait vert qui s'étend au hover
       • Bande accent top révélée au hover (::after scaleX)
       • Icône avec rotation légère au hover
  ══════════════════════════════════════════════════════════════ */

  .acc-csm-info {
    padding: 96px 48px;
    background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
    position: relative;
    overflow: hidden;
  }

  /* Cercle décoratif haut-droite */
  .acc-csm-info::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(187,247,208,0.35) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Cercle décoratif bas-gauche */
  .acc-csm-info::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(187,247,208,0.25) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Wrapper centré du titre + définition */
  .acc-csm-info-head {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 64px;
    position: relative; z-index: 1;
  }

  /* Badge eyebrow pill avec point animé */
  .acc-csm-info-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: #16a34a;
    margin-bottom: 20px;
    padding: 6px 16px;
    background: rgba(220,252,231,0.7);
    border: 1px solid #bbf7d0;
    border-radius: 999px;
  }

  .acc-csm-info-eyebrow::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: #16a34a;
    animation: acc-pulse 2s ease infinite;
  }

  /* Titre H2 */
  .acc-csm-info h2 {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 900; color: #111827;
    line-height: 1.15; margin-bottom: 28px;
  }

  /* Mot-clé en vert avec soulignement shimmer animé */
  .acc-csm-info h2 em {
    font-style: normal;
    color: #16a34a;
    position: relative;
  }

  .acc-csm-info h2 em::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #86efac, #16a34a);
    background-size: 200% 100%;
    border-radius: 2px;
    animation: acc-shimmer 3s linear infinite;
  }

  @keyframes acc-shimmer {
    0%   { background-position: 0%; }
    100% { background-position: 200%; }
  }

  /* Encadré de définition : bordure gauche verte */
  .acc-csm-info-def {
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-left: 4px solid #16a34a;
    border-radius: 12px;
    padding: 20px 24px;
    text-align: left;
    box-shadow: 0 4px 20px rgba(20,83,45,0.06);
  }

  .acc-csm-info-def p {
    font-size: 14.5px; color: #4b5563;
    line-height: 1.75; margin: 0;
  }

  /* Grille des 3 cartes avantage */
  .acc-csm-cards-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    max-width: 960px;
    margin: 0 auto;
    position: relative; z-index: 1;
  }

  @media (max-width: 720px) {
    .acc-csm-cards-info        { grid-template-columns: 1fr; }
    .acc-csm-modules-grid      { grid-template-columns: 1fr !important; }
    .acc-csm-hero-content      { left: 24px; right: 24px; bottom: 32px; }
    .acc-csm-info,
    .acc-csm-modules           { padding: 56px 24px; }
  }

  /* Carte avantage */
  .acc-csm-card-info {
    background: #ffffff;
    border: 1.5px solid #e5e7eb;
    border-radius: 20px;
    padding: 36px 28px 32px;
    text-align: left;
    position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                box-shadow  0.3s cubic-bezier(0.16,1,0.3,1),
                border-color 0.3s ease;
  }

  /* Numéro 01/02/03 en filigrane (lu depuis data-num) */
  .acc-csm-card-info::before {
    content: attr(data-num);
    position: absolute; top: -10px; right: 16px;
    font-family: 'Epilogue', sans-serif;
    font-size: 96px; font-weight: 900;
    color: rgba(220,252,231,0.6);
    line-height: 1; pointer-events: none;
    transition: color 0.3s ease;
  }

  /* Bande verte top révélée au hover */
  .acc-csm-card-info::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #14532d, #16a34a, #86efac);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
  }

  .acc-csm-card-info:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(20,83,45,0.13);
    border-color: #86efac;
  }

  .acc-csm-card-info:hover::before { color: rgba(187,247,208,0.9); }
  .acc-csm-card-info:hover::after  { transform: scaleX(1); }

  /* Icône — conteneur carré arrondi avec fond dégradé vert
     Taille augmentée (56px) pour mieux accueillir les SVG */
  .acc-csm-card-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1.5px solid #86efac;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 14px rgba(22,163,74,0.15),
                inset 0 1px 0 rgba(255,255,255,0.8);
    position: relative; z-index: 1;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }

  .acc-csm-card-info:hover .acc-csm-card-icon {
    transform: scale(1.08) rotate(-3deg);
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    box-shadow: 0 8px 24px rgba(22,163,74,0.28);
  }

  /* Trait vert qui s'étend au hover */
  .acc-csm-card-line {
    width: 28px; height: 3px;
    background: linear-gradient(90deg, #16a34a, #86efac);
    border-radius: 2px; margin-bottom: 14px;
    transition: width 0.3s ease;
  }

  .acc-csm-card-info:hover .acc-csm-card-line { width: 52px; }

  .acc-csm-card-info h3 {
    font-size: 15px; font-weight: 800; color: #14532d;
    margin-bottom: 10px; position: relative; z-index: 1;
  }

  .acc-csm-card-info p {
    font-size: 13.5px; color: #6b7280;
    line-height: 1.65; margin: 0;
    position: relative; z-index: 1;
  }

  /* ════════════════════════════
     SECTION 3 — MODULES (inchangé)
  ════════════════════════════ */

  .acc-csm-modules { padding: 72px 48px; background: #f0fdf4; }

  .acc-csm-modules-head { text-align: center; margin-bottom: 48px; }

  .acc-csm-modules-head h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 800; color: #14532d; margin-bottom: 8px;
  }

  .acc-csm-modules-head p {
    font-size: 15px; color: #6b7280;
    max-width: 440px; margin: 0 auto; line-height: 1.6;
  }

  .acc-csm-modules-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; max-width: 1000px; margin: 0 auto;
  }

  .acc-csm-mod-card {
    background: #fff; border-radius: 18px;
    border: 1.5px solid #bbf7d0; overflow: hidden;
    box-shadow: 0 4px 20px rgba(20,83,45,0.07);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .acc-csm-mod-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(20,83,45,0.13);
  }

  .acc-csm-carousel { position: relative; height: 180px; overflow: hidden; background: #e5e7eb; }

  .acc-csm-carousel-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.5s ease; }

  .acc-csm-carousel-badge {
    position: absolute; top: 10px; right: 10px;
    background: rgba(0,0,0,0.55); color: #fff;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    padding: 3px 10px; border-radius: 999px; backdrop-filter: blur(4px);
  }

  .acc-csm-carousel-dots {
    position: absolute; bottom: 10px; left: 0; right: 0;
    display: flex; justify-content: center; gap: 5px;
  }

  .acc-csm-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.5);
    cursor: pointer; transition: all 0.2s ease;
    border: none; padding: 0;
  }

  .acc-csm-dot.active { background: #fff; transform: scale(1.3); }

  .acc-csm-mod-body { padding: 20px; }

  .acc-csm-mod-accent {
    width: 32px; height: 3px;
    background: linear-gradient(90deg, #16a34a, #86efac);
    border-radius: 2px; margin-bottom: 10px;
  }

  .acc-csm-mod-body h3 { font-size: 15px; font-weight: 700; color: #14532d; margin-bottom: 6px; }
  .acc-csm-mod-body p  { font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 14px; }

  .acc-csm-mod-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 13px; font-weight: 600; color: #16a34a;
    text-decoration: none; cursor: pointer;
    background: none; border: none; padding: 0;
    transition: gap 0.2s ease;
  }

  .acc-csm-mod-link:hover { gap: 8px; color: #14532d; }

  /* ════════════════════════════
     SECTION 4 — CTA (inchangé)
  ════════════════════════════ */

  .acc-csm-cta {
    background: linear-gradient(135deg, #14532d 0%, #16a34a 60%, #10b981 100%);
    padding: 64px 48px; text-align: center;
    position: relative; overflow: hidden;
  }

  .acc-csm-cta::before {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    animation: acc-sweep 5s ease-in-out infinite;
  }

  @keyframes acc-sweep {
    0%   { left: -100%; }
    50%  { left: 150%;  }
    100% { left: 150%;  }
  }

  .acc-csm-cta h2 {
    font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800; color: #fff;
    margin-bottom: 10px; position: relative; z-index: 1;
  }

  .acc-csm-cta p {
    font-size: 15px; color: rgba(255,255,255,0.8);
    margin-bottom: 28px; position: relative; z-index: 1;
  }

  .acc-csm-cta-btn {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 36px; background: #fff; color: #14532d;
    font-family: 'Epilogue', sans-serif; font-size: 14px; font-weight: 700;
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: all 0.25s ease;
  }

  .acc-csm-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    background: #f0fdf4;
  }
`;

/* ══════════════════════════════════════════════════════════════════════════
   SOUS-COMPOSANT — Carrousel
══════════════════════════════════════════════════════════════════════════ */

function Carousel({ images, label }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="acc-csm-carousel">
      <img src={images[current]} alt={`${label} ${current + 1}`} className="acc-csm-carousel-img" />
      <div className="acc-csm-carousel-badge">{current + 1} / {images.length}</div>
      <div className="acc-csm-carousel-dots">
        {images.map((_, i) => (
          <button key={i} className={`acc-csm-dot${i === current ? " active" : ""}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DONNÉES — Modules
══════════════════════════════════════════════════════════════════════════ */

const MODULES = [
  {
    key: "saisie",
    title: "Saisie des Opérations",
    desc: "Enregistrez chaque opération de décapage en temps réel : volume sauté, équipements, conducteur, horaires et état machine.",
    route: "dashboard",
  },
  {
    key: "historique",
    title: "Historique & Suivi",
    desc: "Consultez et filtrez l'ensemble des opérations enregistrées par panneau, tranchée, poste ou plage de dates. Export Excel intégré.",
    route: "historique",
  },
  {
    key: "rapport",
    title: "Rapports & Statistiques",
    desc: "Analysez les rendements, les heures de marche et les volumes sautés grâce à des graphiques interactifs et des indicateurs clés.",
    route: "rapport",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */

function AccueilleCasement() {
  const navigate = useNavigate();

  return (
    <div className="acc-csm">
      <style>{CSS}</style>

      {/* ════════ SECTION 1 — HERO ════════ */}
      <section className="acc-csm-hero">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80"
          alt="Opérations Casement"
          className="acc-csm-hero-img"
        />
        <div className="acc-csm-hero-overlay" />
        <div className="acc-csm-hero-content">
          <h1>Gestion<br />du <span>Décapage</span><br />par Casement</h1>
          <p>
            Améliorez la performance de vos opérations de décapage grâce à une
            collecte rigoureuse des données terrain, permettant un suivi précis
            des rendements et une analyse statistique en temps réel.
          </p>
        </div>
      </section>

      {/* ════════ SECTION 2 — INFO ★ REDESSINÉE ★ ════════ */}
      <section className="acc-csm-info">

        {/* En-tête : badge + titre + définition */}
        <div className="acc-csm-info-head">

          {/* Badge eyebrow avec point pulsant */}
          <div className="acc-csm-info-eyebrow">Opérations Minières</div>

          {/* Titre — "Casement" souligné par un trait shimmer vert */}
          <h2>
            Qu'est-ce que le Décapage<br />par <em>Casement</em>&nbsp;?
          </h2>

          {/* Bloc de définition avec bordure gauche verte */}
          <div className="acc-csm-info-def">
            <p>
              Le casement est une technique de décapage mécanique qui consiste à
              fragmenter et déplacer les couches de recouvrement à l'aide
              d'équipements lourds spécialisés. Notre plateforme centralise toutes
              les données de chaque opération pour un suivi précis et une
              optimisation continue des rendements.
            </p>
          </div>

        </div>

        {/* 3 cartes avantage — data-num affiche 01/02/03 en filigrane via CSS */}
        <div className="acc-csm-cards-info">

          <div className="acc-csm-card-info" data-num="01">
            {/* Icône SVG — Éclair / Saisie rapide */}
            <div className="acc-csm-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4.5 13.5H11.5L11 22L19.5 10.5H12.5L13 2Z"
                  fill="#16a34a" stroke="#14532d" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="acc-csm-card-line" />
            <h3>Saisie Rapide</h3>
            <p>
              Enregistrez une opération complète en moins de 2 minutes grâce à
              un formulaire optimisé pour le terrain.
            </p>
          </div>

          <div className="acc-csm-card-info" data-num="02">
            {/* Icône SVG — Graphique barres / Rendement */}
            <div className="acc-csm-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3"  y="12" width="4" height="9" rx="1.5" fill="#86efac" stroke="#14532d" strokeWidth="1.5"/>
                <rect x="10" y="7"  width="4" height="14" rx="1.5" fill="#16a34a" stroke="#14532d" strokeWidth="1.5"/>
                <rect x="17" y="3"  width="4" height="18" rx="1.5" fill="#14532d" stroke="#14532d" strokeWidth="1.5"/>
                <line x1="2" y1="22" x2="22" y2="22" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="acc-csm-card-line" />
            <h3>Rendement en Temps Réel</h3>
            <p>
              Visualisez instantanément le rendement en tonnes/heure calculé
              automatiquement à chaque saisie.
            </p>
          </div>

          <div className="acc-csm-card-info" data-num="03">
            {/* Icône SVG — Bouclier + coche / Traçabilité */}
            <div className="acc-csm-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z"
                  fill="#dcfce7" stroke="#14532d" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10"
                  stroke="#16a34a" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="acc-csm-card-line" />
            <h3>Traçabilité Complète</h3>
            <p>
              Historique complet par conducteur, équipement et zone — exportable
              en Excel à tout moment.
            </p>
          </div>

        </div>
      </section>

      {/* ════════ SECTION 3 — MODULES ════════ */}
      <section className="acc-csm-modules">
        <div className="acc-csm-modules-head">
          <h2>Nos Trois Modules Casement</h2>
          <p>Gérez l'intégralité de vos opérations de décapage avec nos outils spécialisés.</p>
        </div>
        <div className="acc-csm-modules-grid">
          {MODULES.map((mod) => (
            <div key={mod.key} className="acc-csm-mod-card">
              <Carousel images={SLIDES[mod.key]} label={mod.title} />
              <div className="acc-csm-mod-body">
                <div className="acc-csm-mod-accent" />
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <button className="acc-csm-mod-link" onClick={() => navigate(mod.route)}>
                  Accéder →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ SECTION 4 — CTA ════════ */}
      <section className="acc-csm-cta">
        <h2>Bienvenue dans votre espace Casement</h2>
        <p>Accédez à vos outils et commencez à enregistrer vos opérations depuis votre tableau de bord.</p>
        <button className="acc-csm-cta-btn" onClick={() => navigate("dashboard")}>
          Accéder au tableau de bord →
        </button>
      </section>

    </div>
  );
}

export default AccueilleCasement;