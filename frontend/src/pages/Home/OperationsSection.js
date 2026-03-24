import { useState, useEffect, useRef } from "react";
import "../../style/Home.css";
import image1 from "../../images/700.jpg";
import image2 from "../../images/7001.jpeg"
import image3 from "../../images/ph.jpg"

const operations = [
  {
    href: "/operations/poussage",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/operation-poussage-Fgb9EYVkcbkcCXu7xP5CZJ.webp",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    title: "Poussage",
    description: "Gestion des opérations d'extraction et de retrait des matériaux.",
  },
  {
    href: "/operations/casement",
    images: [
      image1,image2,image3
    ],
    title: "Casement",
    description: "Gestion des lieux de stockage et des matériaux entreposés.",
  },
  {
    href: "/operations/transport",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/transport-logistics-cFkpN6FkUL2xZuhtUWZVXY.webp",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    ],
    title: "Transport",
    description: "Suivi des chargements et gestion de la logistique de transport.",
  },
];

function AnimatedCard({ op, index }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImg((prev) => (prev + 1) % op.images.length);
        setIsTransitioning(false);
      }, 400);
    }, 3000 + index * 700);
    return () => clearInterval(interval);
  }, [op.images.length, index]);

  const goToImage = (i) => {
    if (i === currentImg) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImg(i);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div
      ref={cardRef}
      className={`ops-card-wrapper ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.15}s`, transitionDuration: "0.7s" }}
    >
      <a href={op.href} className="ops-card-link">
        <div className="ops-card">

          <div className="ops-card-img-wrap">
            {op.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${op.title} ${i + 1}`}
                className={`ops-card-img ${
                  i === currentImg ? (isTransitioning ? "fading" : "active") : ""
                }`}
              />
            ))}
            <div className="ops-card-overlay" />
            <div className="ops-img-counter">{currentImg + 1} / {op.images.length}</div>
            <div className="ops-dots">
              {op.images.map((_, i) => (
                <div
                  key={i}
                  className={`ops-dot ${i === currentImg ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); goToImage(i); }}
                />
              ))}
            </div>
          </div>

          <div className="ops-card-body">
            <div className="ops-accent-line" />
            <h5 className="ops-card-title">{op.title}</h5>
            <p className="ops-card-desc">{op.description}</p>
            <div className="ops-cta">
              <span>Accéder</span>
              <span className="ops-cta-arrow">→</span>
            </div>
          </div>

        </div>
      </a>
    </div>
  );
}

export default function OperationsSection() {
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);
  // toggleTheme dans ton Header
const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
};
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ops-section" id="operations">
      <div className="ops-container">
        <div ref={titleRef} className={`ops-header ${titleVisible ? "visible" : ""}`}>
          
          <h2 className="ops-title">Nos Trois Opérations Clés</h2>
          <p className="ops-subtitle">
            Gérez l'intégralité de votre chaîne de production avec nos modules spécialisés.
          </p>
        </div>
        <div className="ops-grid">
          {operations.map((op, index) => (
            <AnimatedCard key={index} op={op} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}