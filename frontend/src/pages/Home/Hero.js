import { useState, useEffect, useRef } from "react";
import "../../style/Home.css";
import slide1 from "../../images/photoBackground.png";
import slide2 from "../../images/heroSlide2.png";
import slide3 from "../../images/heroSlide3.png";
import slide4 from "../../images/heroSlide4.png";

const slides = [
  {
    img: slide1,
    title: "Gestion Intelligente du Décapage de Phosphate",
    sub: "Optimisez vos opérations d'extraction, de stockage et de transport avec notre plateforme de gestion intégrée.",
  },
  {
    img: slide2,
    title: "Performance Logistique & Transport",
    sub: "Suivez vos rendements miniers en temps réel avec des indicateurs de performance de haute précision.",
  },
  {
    img: slide4,
    title: "Excellence Opérationnelle : Poussage & Casement",
    sub: "Maîtrisez vos activités de minage et de nivellement avec une visibilité totale sur vos chantiers.",
  },
  {
    img: slide3,
    title: "Sécurité & Disponibilité 24h/24",
    sub: "Une surveillance continue et des rapports détaillés pour garantir l'atteinte de vos objectifs de production.",
  },
];

const N = slides.length;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % N);
    }, 4000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, []);

  const goTo = (idx) => { setCurrent(idx); resetTimer(); };

  return (
    <section className="hero-section">

      {/* ── Images en absolue : chacune couvre toute la section ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${s.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 0.8s ease",
            opacity: i === current ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Overlay Vert/Sombre (Premium / Clear Effect) ── */}
      <div className="hero-overlay" />

      {/* ── Texte ── */}
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-content text-white">
          <h1
            className="display-4 fw-bold mb-4"
            key={"t" + current}
            style={{ animation: "heroTextIn 0.55s ease forwards" }}
          >
            {slides[current].title}
          </h1>
          <p
            className="lead mb-4"
            key={"p" + current}
            style={{ animation: "heroTextIn 0.55s ease 0.18s both" }}
          >
            {slides[current].sub}
          </p>
        </div>
      </div>

      {/* ── Dots ── */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={"hero-dot" + (i === current ? " active" : "")}
            onClick={() => goTo(i)}
            aria-label={"Slide " + (i + 1)}
          />
        ))}
      </div>

      {/* ── Flèches ── */}
      <button className="hero-arrow hero-arrow-left" onClick={() => goTo((current - 1 + N) % N)}>&#8249;</button>
      <button className="hero-arrow hero-arrow-right" onClick={() => goTo((current + 1) % N)}>&#8250;</button>
    </section>
  );
}