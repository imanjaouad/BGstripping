import "../style/DefinitionSection.css";

const features = [
  {
    icon: "fa-bolt",
    title: "Efficacité",
    description:
      "Augmentez la productivité de vos opérations grâce à une gestion optimisée des ressources.",
  },
  {
    icon: "fa-chart-line",
    title: "Réduction des Coûts",
    description:
      "Minimisez les dépenses opérationnelles avec un suivi en temps réel et une optimisation des processus.",
  },
  {
    icon: "fa-shield-alt",
    title: "Durabilité",
    description:
      "Protégez l'environnement avec des pratiques responsables et un suivi écologique complet.",
  },
];

export default function DefinitionSection() {
  return (
    <section className="definition-section">
      <div className="container">

        <div className="definition-header">
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
            <div className="definition-card" key={index}>
              <div className="icon-box">
                <i className={`fas ${feature.icon}`}></i>
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