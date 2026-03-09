import { Link } from "react-router-dom";

const operations = [
  {
    href: "/operations/poussage",
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/operation-poussage-Fgb9EYVkcbkcCXu7xP5CZJ.webp",
    title: "Poussage",
    description: "Gestion des opérations d'extraction et de retrait des matériaux."
  },
  {
    href: "/operations/casement",
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/storage-cumenage-ZzsNsRJNE7LE4jDf8GxtCw.webp",
    title: "casement",
    description: "Gestion des lieux de stockage et des matériaux entreposés."
  },
  {
    href: "/operations/transport",
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/transport-logistics-cFkpN6FkUL2xZuhtUWZVXY.webp",
    title: "Transport",
    description: "Suivi des chargements et gestion de la logistique de transport."
  }
];

export default function OperationsSection() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold text-dark mb-3">
              Nos Trois Opérations Clés
            </h2>
            <p className="fs-5 text-secondary">
              Gérez l'intégralité de votre chaîne de production avec nos modules spécialisés.
            </p>
          </div>
        </div>

        {/* Horizontal Cards (Side-by-Side) */}
<div className="row ">
  {operations.map((op, index) => (
    <div className="col  col-md-6 col-4" key={index}> {/* Modification ici */}
      <Link to={op.href} className="text-decoration-none">
        <div className="card h-100 shadow-sm border-0 rounded-4 hover-scale">
          {/* Image en haut pour un meilleur rendu en colonnes */}
          <img
            src={op.imgSrc}
            className="card-img-top rounded-top-4"
            alt={op.title}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold text-dark">{op.title}</h5>
            <p className="card-text text-secondary small">{op.description}</p>
            <div className="mt-auto text-success fw-bold">Accéder →</div>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}