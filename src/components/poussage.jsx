import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import image from "../images/image1.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Poussage = () => {

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    panneau: "",
    tranchee: "",
    niveau: "",
    materiel: "",
    equipement: "",
    operateur: "",
    quantite: "",
    temps: "",
    heureDebut: "",
    heureFin: "",
    etatMachine: "En marche",
    typeArret: "",
    dateDebutArret: "",
    dateFinArret: "",
    rendementSoutage: ""
  });

  const [poussages, setPoussages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [rendement, setRendement] = useState(0);

  // Calcul rendement principal
  useEffect(() => {
    if (formData.quantite && formData.temps) {
      const r = parseFloat(formData.quantite) / parseFloat(formData.temps);
      setRendement(r.toFixed(2));
    } else {
      setRendement(0);
    }
  }, [formData.quantite, formData.temps]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const newEntry = {
    ...formData,
    rendement: parseFloat(rendement)
  };

  if (editIndex !== null) {
    const updated = [...poussages];
    updated[editIndex] = newEntry;
    setPoussages(updated);
    setEditIndex(null);
  } else {
    setPoussages([...poussages, newEntry]);
  }

  setShowForm(false);
};

  // Calculs globaux
  const totalVolume = poussages.reduce(
    (acc, item) => acc + parseFloat(item.quantite || 0),
    0
  );

  const totalTemps = poussages.reduce(
    (acc, item) => acc + parseFloat(item.temps || 0),
    0
  );

  const rendementTotal =
    totalTemps > 0 ? (totalVolume / totalTemps).toFixed(2) : 0;

  // Données graphique
  const chartData = {
    labels: poussages.map((item, index) => `Op ${index + 1}`),
    datasets: [
      {
        label: "Rendement (t/h)",
        data: poussages.map(item => item.rendement),
        backgroundColor: "#16bd07"
      }
    ]
  };
  const handleDelete = (index) => {
  const updated = poussages.filter((_, i) => i !== index);
  setPoussages(updated);
};

const handleEdit = (index) => {
  const item = poussages[index];
  setFormData(item);
  setEditIndex(index);
  setShowForm(true);
};

  return (
    <div className="d-flex dashboard">

      {/* SIDEBAR */}
      <div className="sidebar p-2 text-center">
  <img 
    src={image}
    alt="Logo Mine"
    width="120"
    className="mb-4" />
        <h4 className="text-success">Accueille</h4>
       
      </div>

      {/* CONTENU */}
      <div className="flex-grow-1 p-4">

       <h3 
  className="mb-4 " 
  style={{ color: "rgb(2, 56, 25)" }}
>
  Gestion de Poussage
</h3>
     

        <button
          className="btn btn mb-4" style={{ backgroundColor: "rgb(2, 56, 25)", color: "white" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fermer" : "Nouvelle Opération"}
        </button>

        {/* FORMULAIRE COMPLET */}
        {showForm && (
          <div className="card custom-card p-4 mb-4">
            <form onSubmit={handleSubmit} className="row g-3">

              <div className="col-md-3">
                <label>Date</label>
                <input type="date" className="form-control"
                  name="date" onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label>Panneau</label>
                <input type="text" className="form-control"
                  name="panneau" onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label>Tranchée</label>
                <input type="text" className="form-control"
                  name="tranchee" onChange={handleChange} />
              </div>

              <div className="col-md-3">
                <label>Niveau</label>
                <input type="text" className="form-control"
                  name="niveau" onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label>Matériel</label>
                <input type="text" className="form-control"
                  name="materiel" onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label>Équipement</label>
                <input type="text" className="form-control"
                  name="equipement" onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label>Opérateur</label>
                <input type="text" className="form-control"
                  name="operateur" onChange={handleChange} />
              </div>

              <div className="col-md-3">
                <label>Quantité (tonnes)</label>
                <input type="number" className="form-control"
                  name="quantite" onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label>Temps (heures)</label>
                <input type="number" className="form-control"
                  name="temps" onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label>Heure Début</label>
                <input type="time" className="form-control"
                  name="heureDebut" onChange={handleChange} />
              </div>

              <div className="col-md-3">
                <label>Heure Fin</label>
                <input type="time" className="form-control"
                  name="heureFin" onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label>État Machine</label>
                <select className="form-select"
                  name="etatMachine"
                  onChange={handleChange}>
                  <option>En marche</option>
                  <option>Arrêt</option>
                </select>
              </div>

              {formData.etatMachine === "Arrêt" && (
                <>
                  <div className="col-md-4">
                    <label>Type d'arrêt</label>
                    <input type="text" className="form-control"
                      name="typeArret"
                      onChange={handleChange} />
                  </div>

                  <div className="col-md-4">
                    <label>Date Début Arrêt</label>
                    <input type="date" className="form-control"
                      name="dateDebutArret"
                      onChange={handleChange} />
                  </div>

                  <div className="col-md-4">
                    <label>Date Fin Arrêt</label>
                    <input type="date" className="form-control"
                      name="dateFinArret"
                      onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="col-md-4">
                <label>Rendement de Soutage</label>
                <input type="number" className="form-control"
                  name="rendementSoutage"
                  onChange={handleChange} />
              </div>

              <div className="col-12">
                <h5 className="text-success">
                  Rendement Instantané : {rendement} t/h
                </h5>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-success">
                  Enregistrer l'opération
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STATISTIQUES */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card stat-card p-3">
              <h6>Volume Total</h6>
              <h2>{totalVolume} t</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stat-card p-3">
              <h6>Temps Total</h6>
              <h2>{totalTemps} h</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stat-card p-3">
              <h6>Rendement Global</h6>
              <h2>{rendementTotal} t/h</h2>
            </div>
          </div>
        </div>

        {/* LISTE */}
        <div className="card custom-card p-4 mb-4">
          <h5>Liste des Poussages</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Panneau</th>
                  <th>Équipement</th>
                  <th>Quantité</th>
                  <th>Temps</th>
                  <th>Rendement</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {poussages.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.panneau}</td>
                    <td>{item.equipement}</td>
                    <td>{item.quantite}</td>
                    <td>{item.temps}</td>
                    <td>{item.rendement}</td>
                    <td>{item.etatMachine}</td>

<td>
  <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => handleEdit(index)}
  >
    Modifier
  </button>

  <button
    className="btn btn-warning btn-sm"
    onClick={() => handleDelete(index)}
  >
    Supprimer
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRAPHIQUE */}
        <div className="card custom-card p-4">
          <h5>Graphique des Rendements</h5>
          <Bar data={chartData} />
        </div>

      </div>
    </div>
  );
};

export default Poussage;