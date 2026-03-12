import { useEffect, useRef } from "react";
import "./Home.css";

// Inline SVG icons — no Font Awesome dependency needed
const icons = {
  bolt: (
    <svg viewBox="0 0 24 24">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

const features = [
  {
    icon: "shield",
    title: "Éliminer la couche superficielle inutile du sol",
    description:
"Consiste à retirer la première couche du sol qui ne contient pas de minerai ou de matière utile."  },
  {
    icon: "chart",
    title: "Faciliter l’exploitation et améliorer les conditions de travail",
    description:
"Rendre le terrain plus accessible pour les machines et les travailleurs afin d’exploiter plus facilement le minerai."  },
  {
    icon: "bolt",
    title: "Accéder au minerai ou à la couche utile située en dessous",
    description:
"Permet de découvrir et atteindre la couche du sol qui contient la matière exploitable (comme le phosphate)."  },
];

export default function DefinitionSection() {
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  // toggleTheme dans ton Header
const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
};

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.3 }
    );
    if (headerRef.current) headerObserver.observe(headerRef.current);

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setTimeout(() => entry.target.classList.add("visible"), index * 150);
          }
        });
      },
      { threshold: 0.2 }
    );
    cardRefs.current.forEach((card) => { if (card) cardObserver.observe(card); });

    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <section className="definition-section">
      <div className="container">

        <div className="definition-header" ref={headerRef}>
          <h2>Qu'est-ce que le Décapage par poussage ?</h2>
          <p>
          Le décapage par poussage est une technique qui consiste à 
          enlever la couche superficielle du sol (stérile ou pauvre) en la poussant à l’aide 
          d’engins mécaniques afin d’accéder à une couche utile ou au minerai.
          </p>
        </div>

        <div className="definition-grid">
          {features.map((feature, index) => (
            <div
              className="definition-card"
              key={index}
              data-index={index}
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <div className="icon-box">
                {icons[feature.icon]}
              </div>
              <h5>{feature.title}</h5>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}