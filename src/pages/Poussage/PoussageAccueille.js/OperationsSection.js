import { useState, useEffect, useRef } from "react";

const operations = [
  {
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/operation-poussage-Fgb9EYVkcbkcCXu7xP5CZJ.webp",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    ],
    title: "T1",
    description: "Gestion des opérations d'extraction et de retrait des matériaux.",
    fiche: {
      Nom: "T1",
      Référence: "ZD11-2023",
      Puissance: "180 kW",
      Rendement: "12 t/h",
      Dimensions: "8m x 2.5m x 3m",
      Poids: "15 t",
      Matériaux: "Acier, Aluminium",
      Vitesse: "4 m/s",
      Consommation: "45 kWh",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/operation-poussage-Fgb9EYVkcbkcCXu7xP5CZJ.webp",
    },
  },
  {
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/storage-cumenage-ZzsNsRJNE7LE4jDf8GxtCw.webp",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    ],
    title: "T2",
    description: "Identification du produit et caractéristiques techniques.",
    fiche: {
      Nom: "T2",
      Référence: "CM22-2022",
      Puissance: "220 kW",
      Rendement: "15 t/h",
      Dimensions: "9m x 3m x 3.5m",
      Poids: "18 t",
      Matériaux: "Acier, Plastique",
      Vitesse: "5 m/s",
      Consommation: "55 kWh",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/storage-cumenage-ZzsNsRJNE7LE4jDf8GxtCw.webp",
    },
  },
  {
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/transport-logistics-cFkpN6FkUL2xZuhtUWZVXY.webp",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80",
    ],
    title: "T3",
    description: "Suivi des chargements et gestion de la logistique.",
    fiche: {
      Nom: "T3",
      Référence: "TR15-2021",
      Puissance: "150 kW",
      Rendement: "10 t/h",
      Dimensions: "7m x 2m x 2.8m",
      Poids: "12 t",
      Matériaux: "Acier, Caoutchouc",
      Vitesse: "3.5 m/s",
      Consommation: "38 kWh",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663205468249/85zuLatPDUpDsHYShiK7dK/transport-logistics-cFkpN6FkUL2xZuhtUWZVXY.webp",
    },
  },
];

function AnimatedCard({ op, index, onOpenFiche }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setIsVisible(true), index * 150); },
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

  return (
    <div
      ref={cardRef}
      className={`ops-card-wrapper ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.15}s`, transitionDuration: "0.7s" }}
      onClick={() => onOpenFiche(op)}
    >
      <div className="ops-card">
        <div className="ops-card-img-wrap">
          {op.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${op.title} ${i + 1}`}
              className={`ops-card-img ${i === currentImg ? (isTransitioning ? "fading" : "active") : ""}`}
            />
          ))}
          <div className="ops-card-overlay" />
          <div className="ops-img-counter">{currentImg + 1} / {op.images.length}</div>
        </div>
        <div className="ops-card-info">
          <h3>{op.title}</h3>
          <p>{op.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function OperationsSection() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [ficheOpen, setFicheOpen] = useState(false);
  const [ficheData, setFicheData] = useState(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  const openFiche = (op) => {
    setFicheData(op.fiche);
    setFicheOpen(true);
  };

  const closeFiche = () => setFicheOpen(false);

  return (
    <>
      <section className="ops-section">
        <div className="ops-container">
          <div ref={titleRef} className={`ops-header ${titleVisible ? "visible" : ""}`}>
            <h2 className="ops-title">Les équipements de Poussage</h2>
          </div>
          <div className="ops-grid">
            {operations.map((op, index) => (
              <AnimatedCard key={index} op={op} index={index} onOpenFiche={openFiche} />
            ))}
          </div>
        </div>

        {ficheOpen && ficheData && (
          <div className="machine-modal" onClick={closeFiche}>
            <div className="fiche-card" onClick={e => e.stopPropagation()}>
              <h2 style={{color:"#064E3B",marginBottom:"0.7rem"}}>FICHE TECHNIQUE</h2>
              <img src={ficheData.image} alt={ficheData.Nom} style={{width:"100%",borderRadius:"12px",marginBottom:"0.7rem"}} />
              <p><strong>Nom:</strong> {ficheData.Nom}</p>
              <p><strong>Référence:</strong> {ficheData.Référence}</p>
              <p><strong>Puissance:</strong> {ficheData.Puissance}</p>
              <p><strong>Rendement:</strong> {ficheData.Rendement}</p>
              <p><strong>Dimensions:</strong> {ficheData.Dimensions}</p>
              <p><strong>Poids:</strong> {ficheData.Poids}</p>
              <p><strong>Matériaux:</strong> {ficheData.Matériaux}</p>
              <p><strong>Vitesse:</strong> {ficheData.Vitesse}</p>
              <p><strong>Consommation:</strong> {ficheData.Consommation}</p>
              <button className="close-btn" onClick={closeFiche}>Fermer</button>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .ops-section{padding:2rem;background:#f4f5f8;}
        .ops-container{max-width:1200px;margin:0 auto;}
        .ops-header{opacity:0;transform:translateY(20px);transition:0.7s;}
        .ops-header.visible{opacity:1;transform:translateY(0);}
        .ops-title{font-size:2rem;color:#064E3B;font-weight:700;font-family:'Rajdhani',sans-serif;margin-bottom:1rem;}
        .ops-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;}
        .ops-card-wrapper{cursor:pointer;opacity:0;transform:translateY(20px);transition:0.7s;}
        .ops-card-wrapper.visible{opacity:1;transform:translateY(0);}
        .ops-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.15);transition:transform 0.25s;}
        .ops-card:hover{transform:scale(1.03);}
        .ops-card-img-wrap{position:relative;width:100%;height:180px;overflow:hidden;}
        .ops-card-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.4s;}
        .ops-card-img.active{opacity:1;}
        .ops-card-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.15);}
        .ops-card-info{padding:1rem;}
        .ops-card-info h3{margin:0;font-size:1.2rem;color:#064E3B;}
        .ops-card-info p{margin:0;font-size:0.85rem;color:#374151;}

        .machine-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);display:flex;justify-content:center;align-items:center;z-index:1000;}
        .fiche-card{width:400px;background:#fff;border-radius:16px;padding:1.2rem;box-shadow:0 20px 50px rgba(0,0,0,0.3);text-align:center;position:relative;transition:all 0.3s;}
        .fiche-card h2{color:#064E3B;font-size:1.4rem;margin-bottom:0.7rem;}
        .fiche-card p{font-size:0.9rem;margin:0.25rem 0;color:#374151;text-align:left;}
        .close-btn{margin-top:1rem;padding:0.5rem 1rem;background:#16A34A;color:white;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s;}
        .close-btn:hover{background:#22c55e;}
      `}</style>
    </>
  );
}