import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const { filiere, annee } = location.state || {};

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [ccs, setCcs] = useState({});
  const [efms, setEfms] = useState({});
  const [cours, setCours] = useState({});
  const [effs, setEffs] = useState({});

  // Récupérer tous les modules pour la filière
  useEffect(() => {
    if (!filiere) return;

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere.id}/modules`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setModules(data.data);
        setLoadingModules(false);
      });
  }, [filiere]);

  const loadModuleData = (moduleId) => {
    // CC
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/ccs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setCcs((prev) => ({ ...prev, [moduleId]: data.data }));
      });

    // EFM
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/efms`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setEfms((prev) => ({ ...prev, [moduleId]: data.data }));
      });

    // Cours
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setCours((prev) => ({ ...prev, [moduleId]: data.data }));
      });
  };

  // EFF pour la filière
  useEffect(() => {
    if (!filiere) return;
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere.id}/effs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setEffs(data.data);
      });
  }, [filiere]);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        <h2>
          Modules pour {annee?.name} - {filiere?.name}
        </h2>

        {loadingModules && <p>Chargement des modules...</p>}

        {modules.map((m) => (
          <div key={m.id} className="module-card">
            <h3>{m.name}</h3>
            <p>Code: {m.code} | Crédits: {m.credits}</p>
            <button onClick={() => loadModuleData(m.id)} className="select-module-btn">
              Charger CC / EFM / Cours
            </button>

            {ccs[m.id] && (
              <div>
                <strong>📘 Contrôles Continus</strong>
                <ul>
                  {ccs[m.id].map((cc) => <li key={cc.id}>{cc.title || cc.name}</li>)}
                </ul>
              </div>
            )}

            {efms[m.id] && (
              <div>
                <strong>📝 Examens Finaux</strong>
                <ul>
                  {efms[m.id].map((e) => <li key={e.id}>{e.title || e.name}</li>)}
                </ul>
              </div>
            )}

            {cours[m.id] && (
              <div>
                <strong>📖 Cours</strong>
                <ul>
                  {cours[m.id].map((c) => <li key={c.id}>{c.title || c.name}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}

        {effs.length > 0 && (
          <div className="info-box">
            <h3>EFF pour la filière</h3>
            <ul>
              {effs.map((e) => <li key={e.id}>{e.title || e.name}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
