import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import imagePh from "../../images/ph.jpg";
import image700 from "../../images/700.jpg";
import image7001 from "../../images/7001.jpeg";
import image200 from "../../images/image.png";
import "../../style/Casement.css"



/* ══════════════════════════════════════════════════════════════════════════
   AccueilleCasement — Page d'accueil du module Casement
══════════════════════════════════════════════════════════════════════════ */

const EQUIPEMENTS = [
  {
    key: "7500M1",
    nom: "Foreuse 7500 — M1",
    desc: "Foreuse rotary lourde pour trous de mine de grand diamètre. Utilisée en décapage profond sur front rocheux.",
    specs: [
      { label: "Diamètre forage", val: "229–311 mm" },
      { label: "Profondeur max",  val: "≈ 60 m" },
      { label: "Puissance",       val: "746 kW" },
      { label: "Poids opérat.",   val: "≈ 110 t" },
    ],
    images: [
      image700
    ],
  },
  {
    key: "7500M2",
    nom: "Foreuse 7500 — M2",
    desc: "Deuxième unité rotary de la flotte. Opère en rotation avec M1 pour garantir la continuité du forage.",
    specs: [
      { label: "Diamètre forage", val: "229–311 mm" },
      { label: "Profondeur max",  val: "≈ 60 m" },
      { label: "Puissance",       val: "746 kW" },
      { label: "Poids opérat.",   val: "≈ 110 t" },
    ],
    images: [
image7001    ],
  },
  {
    key: "P&H1",
    nom: "Pelle P&H — N°1",
    desc: "Pelle électrique à câble haute capacité pour chargement des matériaux sautés. Référence sur les grands découverts.",
    specs: [
      { label: "Capacité godet", val: "15–23 m³" },
      { label: "Rayon charg.",   val: "≈ 21 m" },
      { label: "Puissance",      val: "1 800 kW" },
      { label: "Poids opérat.",  val: "≈ 700 t" },
    ],
    images: [
    imagePh
    ],
  },
  {
    key: "P&H2",
    nom: "Pelle P&H — N°2",
    desc: "Deuxième pelle électrique de la flotte. Assure la redondance du chargement lors des pics de production.",
    specs: [
      { label: "Capacité godet", val: "15–23 m³" },
      { label: "Rayon charg.",   val: "≈ 21 m" },
      { label: "Puissance",      val: "1 800 kW" },
      { label: "Poids opérat.",  val: "≈ 700 t" },
    ],
    images: [
      imagePh 
      ],
  },
  {
    key: "200B1",
    nom: "Bulldozer 200 — B1",
    desc: "Bouteur lourd utilisé pour le régalage, le poussage des déblais et la préparation des pistes en zone de décapage.",
    specs: [
      { label: "Puissance",      val: "410 kW" },
      { label: "Lame capacity",  val: "≈ 22 m³" },
      { label: "Poids opérat.",  val: "≈ 70 t" },
      { label: "Vitesse max",    val: "11 km/h" },
    ],
    images: [
      image200
    ],
  },
];

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
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */

function AccueilCasement() {
  const navigate = useNavigate();
  const casements = useSelector((state) => state.casement?.list ?? []);

  // Dernier état connu de chaque équipement dans Redux
  const getEtat = (key) => {
    const ops = [...casements]
      .reverse()
      .find((c) => c.equipements?.includes(key));
    if (!ops) return "inconnu";
    return ops.etatMachine === "marche" ? "marche" : "arret";
  };

  const ETAT_LABEL = { marche: "En marche", arret: "En arrêt", inconnu: "Inconnu" };

  return (
    <div className="acc-csm">
      

      {/* ════════ SECTION 1 — HERO ════════ */}
      <section className="acc-csm-hero">
        <img
          src={image700}
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

      {/* ════════ SECTION 3 — ÉQUIPEMENTS ════════ */}
      <section className="acc-csm-modules">
        <div className="acc-csm-modules-head">
          <h2>Nos Équipements Casement</h2>
          <p>Flotte de machines dédiées aux opérations de décapage — état en temps réel depuis les dernières saisies.</p>
        </div>
        <div className="acc-csm-modules-grid">
          {EQUIPEMENTS.map((eq) => {
            const etat = getEtat(eq.key);
            return (
              <div key={eq.key} className="acc-csm-mod-card">
                <Carousel images={eq.images} label={eq.nom} />
                <div className="acc-csm-mod-body">
                  <div className="acc-csm-mod-top">
                    <div className="acc-csm-mod-accent" />
                    <span className={`acc-csm-badge ${etat}`}>
                      {ETAT_LABEL[etat]}
                    </span>
                  </div>
                  <h3>{eq.nom}</h3>
                  <p>{eq.desc}</p>
                  <div className="acc-csm-specs">
                    {eq.specs.map((s) => (
                      <div key={s.label} className="acc-csm-spec-row">
                        <span className="acc-csm-spec-key">{s.label}</span>
                        <span className="acc-csm-spec-val">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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

export default AccueilCasement;