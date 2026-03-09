import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoussage, deletePoussage, updatePoussage } from "../features/poussageSlice";
import image from "../images/image3.webp";

function Dashboard() {
  const dispatch = useDispatch();
  const poussages = useSelector((state) => state.poussage?.list || []);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [equipementOptions, setEquipementOptions] = useState([
    "T1","T2","T3","T4","T5","T6","T7"
  ]);

  const [formData, setFormData] = useState({
    date: "",
    panneau: "",
    tranchee: "",
    niveau: "",
    volume_soté: "",
    profendeur: "",
    equipements: [],
    conducteur: "",
    matricule: "",
    temps: "",
    heureDebut: "",
    heureFin: "",
    compteurDebut: "",
    compteurFin: "",
    etatMachine: "En marche",
    typeArret: "",
    heureDebutArret: "",
    heureFinArret: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEquipementChange = (equipement) => {
    const currentEquipements = formData.equipements || [];
    if (currentEquipements.includes(equipement)) {
      setFormData({
        ...formData,
        equipements: currentEquipements.filter(e => e !== equipement)
      });
    } else {
      setFormData({
        ...formData,
        equipements: [...currentEquipements, equipement]
      });
    }
  };

  const addEquipement = () => {
    const newEquip = prompt("Entrer le nom du nouvel équipement");
    if (newEquip && !equipementOptions.includes(newEquip)) {
      setEquipementOptions([...equipementOptions,newEquip]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      dispatch(updatePoussage({
        index: editIndex,
        data: formData
      }));
      setEditIndex(null);
    } else {
      dispatch(addPoussage(formData));
    }

    setFormData({
      date: "",
      panneau: "",
      tranchee: "",
      niveau: "",
      volume_soté: "",
      profendeur: "",
      equipements: [],
      conducteur: "",
      matricule: "",
      temps: "",
      heureDebut: "",
      heureFin: "",
      compteurDebut: "",
      compteurFin: "",
      etatMachine: "En marche",
      typeArret: "",
      heureDebutArret: "",
      heureFinArret: "",
    });

    setShowForm(false);
  };

  const handleDelete = (index) => {
    if (window.confirm("Supprimer ce poussage ?")) {
      dispatch(deletePoussage(index));
    }
  };

  const handleEdit = (item, index) => {
    setFormData({
      ...item,
      equipements: item.equipements || []
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const rendement = formData.temps > 0
    ? (formData.volume_soté / formData.temps).toFixed(2)
    : 0;

  return (
    <div className=""  >
      {/* En-tête avec titre et logo */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0"  style={{  color: "#1F2937" }}>Gestion Décapage ZD11</h2>
        <img src={image} alt="Logo Mine" width="70" />
      </div>

      <button
        className="btn mb-3"
        style={{ backgroundColor: " #16A34A", color: "white" }}
        onClick={() => setShowForm(!showForm)}
      >
        Ajouter les Données
      </button>

      {showForm && (
        <div className="card shadow p-4 mb-4">
          <form onSubmit={handleSubmit} className="row g-3">

            {/* Champs standards */}
            <div className="col-md-3">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label>Panneau</label>
              <input
                type="text"
                className="form-control"
                name="panneau"
                value={formData.panneau}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label>Tranchée</label>
              <input
                type="text"
                className="form-control"
                name="tranchee"
                value={formData.tranchee}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Niveau</label>
              <input
                type="text"
                className="form-control"
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Volume Soté</label>
              <input
                type="number"
                className="form-control"
                name="volume_soté"
                value={formData.volume_soté}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Profendeur</label>
              <input
                type="text"
                className="form-control"
                name="profendeur"
                value={formData.profendeur}
                onChange={handleChange}
              />
            </div>

            {/* Équipements */}
            <div className="col-md-4">
              <label className="mb-2">Équipements</label>
              <div className="border rounded p-3">
                <div className="row">
                  {equipementOptions.map((eq, index) => (
                    <div className="col-2" key={index}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.equipements?.includes(eq) || false}
                          onChange={() => handleEquipementChange(eq)}
                        />
                        <label className="form-check-label">{eq}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn btn-sm mt-2" style={{backgroundColor:"#16A34A", color:"white"}}
                  onClick={addEquipement}
                >
                  + Ajouter équipement
                </button>
              </div>
            </div>

            {/* Conducteur et Matricule */}
            <div className="col-md-4">
              <label>Conducteur</label>
              <input
                type="text"
                className="form-control"
                name="conducteur"
                value={formData.conducteur}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Matricule</label>
              <input
                type="text"
                className="form-control"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                required
              />
            </div>

            {/* Temps et Rendement */}
            <div className="col-md-3">
              <label>Heures de Marche</label>
              <input
                type="number"
                className="form-control"
                name="temps"
                value={formData.temps}
                onChange={handleChange}
                required
              />
            </div>

           

            {/* Début / Fin Compteur et État */}
            <div className="col-md-3">
              <label>Début Compteur</label>
              <input
                type="number"
                className="form-control"
                name="compteurDebut"
                value={formData.compteurDebut || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Fin Compteur</label>
              <input
                type="number"
                className="form-control"
                name="compteurFin"
                value={formData.compteurFin || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>État Machine</label>
              <select
                className="form-select"
                name="etatMachine"
                value={formData.etatMachine}
                onChange={handleChange}
              >
                <option>En marche</option>
                <option>En arrêt</option>
              </select>
            </div>

            {/* Champs conditionnels si en arrêt */}
            {formData.etatMachine === "En arrêt" && (
              <>
                <div className="col-md-3">
                  <label>Nature d'arrêt</label>
                  <input
                    type="text"
                    className="form-control"
                    name="typeArret"
                    value={formData.typeArret || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label>Heure Début Arrêt</label>
                  <input
                    type="time"
                    className="form-control"
                    name="heureDebutArret"
                    value={formData.heureDebutArret || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label>Heure Fin Arrêt</label>
                  <input
                    type="time"
                    className="form-control"
                    name="heureFinArret"
                    value={formData.heureFinArret || ""}
                    onChange={handleChange}
                  />
                </div>
                
              </>
            )}
             <div className="col-12">
              <h5 className="text-success">
                Rendement Instantané : {rendement} t/h
              </h5>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#16A34A", color: "white" }}
              >
                
                Enregistrer les Données
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Liste des poussages */}
      <div className="card shadow p-3">
        <h5>Liste des Poussages</h5>
        <table className="table table-striped mt-3" >
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Panneau</th>
              <th>Profendeur</th>
              <th>Volume</th>
              <th>Tranchée</th>
              <th>Équipements</th>
              <th>Heures</th>
              <th>Rendement</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {poussages.map((p,index) => (
              <tr key={index}>
                <td>{p.date}</td>
                <td>{p.panneau}</td>
                <td>{p.profendeur}</td>
                <td>{p.volume_soté}</td>
                <td>{p.tranchee}</td>
                <td>{p.equipements?.join(", ")}</td>
                <td>{p.temps}</td>
                <td>{p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : 0} t/h</td>
                
                <td>{p.etatMachine}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2"  onClick={() => handleEdit(p,index)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;