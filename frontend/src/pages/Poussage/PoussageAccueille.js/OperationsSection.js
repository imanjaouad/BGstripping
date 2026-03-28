import { useState, useEffect, useRef } from "react";


const operations = [
  {
    images: [
      "https://s7d2.scene7.com/is/image/Caterpillar/C752902",
      "https://tse1.mm.bing.net/th/id/OIP.Q5J7juIJ5615HyPTntllVQHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3"
    ],
    title: "D11",
    description: "Le Caterpillar D11 est un bulldozer de très grande puissance conçu spécialement pour les travaux miniers à ciel ouvert et les chantiers lourds. Il fait partie des plus gros bulldozers au monde et est largement utilisé dans les mines, notamment chez OCP pour le décapage par poussage.",
    fiche: {
      Nom: "D11",
      Modèle : "Cat C32 / C32B diesel",
Puissance : "≈ 850 ch (634 kW)",
Puissance_brute : "jusqu’à ≈ 936 ch",
Cylindrée :" 32,1 litres",
Régime_nominal : "≈ 1800 tr/min",
     image: "https://tse1.mm.bing.net/th/id/OIP.Q5J7juIJ5615HyPTntllVQHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3"
    },
  },
  {
    images: [
      "https://image.made-in-china.com/2f0j00ONykZSBJWiqs/Used-Bulldozer-475-with-Good-Quality-Original-Dozer-for-Sale.jpg",
     ],
  
     title: "Bulldozer KD 475",
    description: "Le Komatsu D475 est un bulldozer de très grande capacité conçu pour les travaux miniers lourds, en particulier dans les exploitations à ciel ouvert comme celles de l’OCP. Il fait partie des plus grosses machines de terrassement au monde et se distingue par sa puissance et sa robustesse.travaux miniers à ciel ouvert et les chantiers lourds.",
    fiche: {
      Nom: "Bulldozer KD 475",
      Modèle : "Komatsu SAA12V140E-3",
Puissance : "890 ch (664 kW)",
Puissance_brute : "890 ch (≈ 664 kW)",
Cylindrée :" ≈ 30,5 L",
Régime_nominal : "2000 tr/min",
      
      image:"https://image.made-in-china.com/2f0j00ONykZSBJWiqs/Used-Bulldozer-475-with-Good-Quality-Original-Dozer-for-Sale.jpg",
    },
  },
  {
    images: [
      "https://www.topmarkfunding.com/wp-content/uploads/2022/03/wheel-loaders-1024x577.jpg",
    ],
    title: "Wheel Loader",
    description: "La Wheel Loader (chargeuse sur pneus) est une machine de chantier et minière utilisée pour le chargement et le déplacement des matériaux comme la terre, le sable, les roches ou le phosphate. Elle se caractérise par sa grande mobilité grâce à ses roues (pneus), contrairement aux bulldozers qui utilisent des chenilles.",
    fiche: {
      Nom: "Wheel Loader",
      Modèle : "Cat C32 ACERT",
Puissance : "250 à 500 ch (≈ 185 – 370 kW)",
Puissance_brute : "850 ch (≈ 634 kW)",
Cylindrée :" 32,1 litres",
Régime_nominal : "≈ 1800 – 2200 tr/min",
      image:"https://www.topmarkfunding.com/wp-content/uploads/2022/03/wheel-loaders-1024x577.jpg",
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
             
              <p><strong>Puissance:</strong> {ficheData.Puissance}</p>
              <p><strong>Modèle:</strong> {ficheData.Modèle}</p>
              <p><strong>Puissance_brute:</strong> {ficheData.Puissance_brute}</p>
              <p><strong>Cylindrée:</strong> {ficheData.Cylindrée}</p>
              <p><strong>Régime_nominal:</strong> {ficheData.Régime_nominal}</p>
             
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