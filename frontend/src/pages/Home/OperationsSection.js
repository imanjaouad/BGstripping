import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Home.css";

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
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/storage-cumenage-ZzsNsRJNE7LE4jDf8GxtCw.webp",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80",
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=600&q=80",
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
  const navigate = useNavigate();
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);

  // Get current user to check if admin
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ops-section">
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

        {/* Admin-only: User Management Card */}
        {isAdmin && (
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
            <div
              onClick={() => navigate("/admin/users")}
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fff9ec)",
                border: "1.5px solid rgba(217,119,6,0.3)",
                borderRadius: 16,
                padding: "22px 36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.25s",
                boxShadow: "0 4px 20px rgba(217,119,6,0.1)",
                maxWidth: 480,
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(217,119,6,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(217,119,6,0.1)";
              }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(217,119,6,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}
              >
                👥
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#92400e", marginBottom: 2 }}>
                  Gestion des Utilisateurs
                </div>
                <div style={{ fontSize: 12, color: "#b45309" }}>
                  Créer, modifier et gérer les comptes et permissions
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 20, color: "#b45309" }}>→</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}