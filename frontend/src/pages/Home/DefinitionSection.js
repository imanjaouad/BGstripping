import { useEffect, useRef } from "react";
import "../../style/Home.css";

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
    icon: "bolt",
    title: "Efficacité",
    description:
      "Augmentez la productivité de vos opérations grâce à une gestion optimisée des ressources.",
  },
  {
    icon: "chart",
    title: "Réduction des Coûts",
    description:
      "Minimisez les dépenses opérationnelles avec un suivi en temps réel et une optimisation des processus.",
  },
  {
    icon: "shield",
    title: "Durabilité",
    description:
      "Protégez l'environnement avec des pratiques responsables et un suivi écologique complet.",
  },
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
          <h2>Qu'est-ce que le Décapage de Phosphate ?</h2>
          <p>
            Le décapage de phosphate est une opération minière complexe qui
            implique l'extraction, le stockage et le transport de matériaux
            phosphatés. Notre plateforme gère chaque étape avec précision et
            efficacité.
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