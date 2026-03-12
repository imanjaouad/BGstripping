import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPoussage, updatePoussage } from "../../features/poussageSlice";
import image from "../../images/image3.webp";
import  "../../style/PoussageForm.css";
function Dashboard() {
  const dispatch = useDispatch();

  const [editIndex, setEditIndex] = useState(null);
  const [equipementOptions, setEquipementOptions] = useState([
    "T1", "T2", "T3", "T4", "T5", "T6", "T7",
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
  heureDebut: "",
  heureFin: "",
  temps: "",
  compteurDebut: "",
  compteurFin: "",
 
  poste:"",
   
  etatMachine: "En marche",
  typeArret: "",
  heureDebutArret: "",
  heureFinArret: "",

  });

  // ── Calcul automatique des heures de marche ──────────────────────────────
  const calcTemps = (debut, fin) => {
    if (!debut || !fin) return "";
    const [dh, dm] = debut.split(":").map(Number);
    const [fh, fm] = fin.split(":").map(Number);
    const totalMin = (fh * 60 + fm) - (dh * 60 + dm);
    if (totalMin <= 0) return "";
    return (totalMin / 60).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Recalcul auto si heure debut ou fin change
    if (name === "heureDebut" || name === "heureFin") {
      const debut = name === "heureDebut" ? value : formData.heureDebut;
      const fin   = name === "heureFin"   ? value : formData.heureFin;
      updated.temps = calcTemps(debut, fin);
    }

    setFormData(updated);
  };

  const handleEquipementChange = (equipement) => {
    const list = formData.equipements;
    setFormData({
      ...formData,
      equipements: list.includes(equipement)
        ? list.filter((e) => e !== equipement)
        : [...list, equipement],
    });
  };

  const addEquipement = () => {
    const newEquip = prompt("Entrer le nom du nouvel équipement");
    if (newEquip && !equipementOptions.includes(newEquip)) {
      setEquipementOptions([...equipementOptions, newEquip]);
    }
  };

  const resetForm = () => setFormData({
    date: "", panneau: "", tranchee: "", niveau: "",
    volume_soté: "", profendeur: "", equipements: [],
    conducteur: "", matricule: "", heureDebut: "", heureFin: "",
    temps: "", compteurDebut: "", compteurFin: "",
    etatMachine: "En marche", typeArret: "",
    heureDebutArret: "", heureFinArret: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      dispatch(updatePoussage({ index: editIndex, data: formData }));
      setEditIndex(null);
    } else {
      dispatch(addPoussage(formData));
    }
    resetForm();
  };

  const rendement =
    formData.temps > 0
      ? (formData.volume_soté / formData.temps).toFixed(2)
      : 0;

  return (
    <div>

      {/* HEADER */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Gestion Décapage <span>ZD11</span>
        </h2>
        <img src={image} alt="logo" className="header-logo" />
      </div>

      {/* FORM */}
      <div className="form-card d-flex gap-3" >
        <form onSubmit={handleSubmit} className="row g-3" >

          {/* DATE */}
          <div className="col-md-3"   >
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* PANNEAU */}
          <div className="col-md-3">
            <label className="form-label">Panneau</label>
            <input
              type="text"
              className="form-control"
              name="panneau"
              value={formData.panneau}
              onChange={handleChange}
            />
          </div>

          {/* TRANCHEE */}
          <div className="col-md-3">
            <label className="form-label">Tranchée</label>
            <input
              type="text"
              className="form-control"
              name="tranchee"
              value={formData.tranchee}
              onChange={handleChange}
            />
          </div>

          {/* PROFONDEUR */}
          <div className="col-md-3">
            <label className="form-label">Profendeur</label>
            <input
              type="text"
              className="form-control"
              name="profendeur"
              value={formData.profendeur}
              onChange={handleChange}
            />
          </div>

          {/* VOLUME */}
          <div className="col-md-3">
            <label className="form-label">Volume Souté</label>
            <input
              type="number"
              className="form-control"
              name="volume_soté"
              value={formData.volume_soté}
              onChange={handleChange}
            />
          </div>
         
          {/* HEURE DEBUT */}
          <div className="col-md-3">
            <label className="form-label">Heure de Début</label>
            <input
              type="time"
              className="form-control"
              name="heureDebut"
              value={formData.heureDebut}
              onChange={handleChange}
            />
          </div>

          {/* HEURE FIN */}
          <div className="col-md-3">
            <label className="form-label">Heure de Fin</label>
            <input
              type="time"
              className="form-control"
              name="heureFin"
              value={formData.heureFin}
              onChange={handleChange}
            />
          </div>

          {/* HEURES DE MARCHE — calculé automatiquement */}
          <div className="col-md-3">
            <label className="form-label">
              Heures de Marche
              <span style={{
                marginLeft: 6,
                fontSize: 10,
                fontWeight: 600,
                color: "#16a34a",
                background: "#dcfce7",
                padding: "2px 7px",
                borderRadius: 20,
                letterSpacing: ".04em",
              }}>
                AUTO
              </span>
            </label>
            <input
              type="number"
              className="form-control"
              name="temps"
              value={formData.temps}
              onChange={handleChange}
              placeholder="Calculé automatiquement"
              style={{ background: formData.heureDebut && formData.heureFin ? "#f0fdf4" : undefined }}
              readOnly={!!(formData.heureDebut && formData.heureFin)}
            />
          </div>

          {/* CONDUCTEUR */}
          <div className="col-md-3">
            <label className="form-label">Conducteur</label>
            <input
              type="text"
              className="form-control"
              name="conducteur"
              value={formData.conducteur}
              onChange={handleChange}
            />
          </div>

          {/* MATRICULE */}
          <div className="col-md-3">
            <label className="form-label">Matricule</label>
            <input
              type="text"
              className="form-control"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
            />
          </div>
            {/* Poste */}
          <div className="col-md-3">
            <label className="form-label">Poste</label>
            <input
              type="text"
              className="form-control"
              name="machine"
              value={formData.poste}
              onChange={handleChange}
            />
          </div>


          {/* EQUIPMENTS */}
          <div className="col-md-12">
            <label className="form-label">Équipements</label>
            <div className="equip-grid">
              {equipementOptions.map((eq, index) => (
                <div
                  key={index}
                  className={`equip-chip ${
                    formData.equipements.includes(eq) ? "selected" : ""
                  }`}
                  onClick={() => handleEquipementChange(eq)}
                >
                  {eq}
                </div>
              ))}
              <button
                type="button"
                className="btn-add-equip"
                onClick={addEquipement}
              >
                + Ajouter
              </button>
            </div>
          </div>

          {/* ETAT MACHINE */}
          <div className="col-md-3">
            <label className="form-label">État Machine</label>
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

          {/* ARRET */}
         {formData.etatMachine === "En arrêt" && (
<>
  {/* TYPE ARRET */}
  <div className="col-md-3">
    <label className="form-label">Nature d'arrêt</label>
    <input
      type="text"
      className="form-control"
      name="typeArret"
      value={formData.typeArret}
      onChange={handleChange}
    />
  </div>

  {/* HEURE DEBUT ARRET */}
  <div className="col-md-3">
    <label className="form-label">Heure Début Arrêt</label>
    <input
      type="time"
      className="form-control"
      name="heureDebutArret"
      value={formData.heureDebutArret}
      onChange={handleChange}
    />
  </div>

  {/* HEURE FIN ARRET */}
  <div className="col-md-3">
    <label className="form-label">Heure Fin Arrêt</label>
    <input
      type="time"
      className="form-control"
      name="heureFinArret"
      value={formData.heureFinArret}
      onChange={handleChange}
    />
  </div>
</>
)}
           

          {/* RENDEMENT */}
          <div className="col-12">
            <div className="rendement-banner">
              <div className="rendement-value">{rendement}</div>
              <div className="rendement-label">t/h — Rendement instantané</div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="col-12">
            <button type="submit" className="btn-submit">
              {editIndex !== null ? "Mettre à jour" : "Enregistrer"}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                className="btn-submit"
                style={{ marginLeft: 10, background: "#6b7280" }}
                onClick={() => { resetForm(); setEditIndex(null); }}
              >
                Annuler
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}

export default Dashboard;