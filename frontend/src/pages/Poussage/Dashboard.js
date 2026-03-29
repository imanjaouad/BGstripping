import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPoussages, addPoussageAsync, updatePoussageAsync } from "../../features/poussageSlice";
import image from "../../images/image3.webp";
import "../../style/PoussageForm.css";
import UseAuth from "../../components/UseAuth";
function Dashboard() {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.poussage);
  const { isAdmin } = UseAuth();
  useEffect(() => {
    dispatch(fetchPoussages());
  }, [dispatch]);

  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  const [equipementOptions, setEquipementOptions] = useState([
    "T1", "T2", "T3", "T4", "T5", "T6", "T7",
  ]);

  const emptyForm = {
    date: "",
    panneau: "",
    tranchee: "",
    niveau: "",
    volume_sote: "",
    profondeur: "",
    equipements: [],
    conducteur: "",
    matricule: "",
    machine_id: "",
    heureDebut: "",
    heureFin: "",
    temps: "",
    poste: "",
    etat_machine: "En marche",
    type_arret: "",
    heureDebutArret: "",
    heureFinArret: "",
    heures_arret: 0, // FIX 1 : champ manquant dans emptyForm
    htp: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // FIX 2 : calcTemps était appelée mais jamais définie — on la définit ici
  const calcTemps = (debut, fin) => {
    if (!debut || !fin) return 0;
    const [dh, dm] = debut.split(":").map(Number);
    const [fh, fm] = fin.split(":").map(Number);
    let totalMin = (fh * 60 + fm) - (dh * 60 + dm);
    if (totalMin < 0) totalMin += 24 * 60;
    return (totalMin / 60).toFixed(2);
  };

  const calcDuree = (debut, fin) => {
    if (!debut || !fin) return 0;
    const [dh, dm] = debut.split(":").map(Number);
    const [fh, fm] = fin.split(":").map(Number);
    let totalMin = (fh * 60 + fm) - (dh * 60 + dm);
    if (totalMin < 0) totalMin += 24 * 60;
    return (totalMin / 60).toFixed(2);
  };

  // FIX 3 : accolade fermante mal placée — le bloc if(etat_machine) était sorti de la fonction
  const handleChange = (e) => {
    if (!isAdmin) return;
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "heureDebut" || name === "heureFin") {
      const debut = name === "heureDebut" ? value : formData.heureDebut;
      const fin = name === "heureFin" ? value : formData.heureFin;
      updated.temps = calcTemps(debut, fin);
    }

    if (name === "heureDebutArret" || name === "heureFinArret") {
      const debutArret = name === "heureDebutArret" ? value : formData.heureDebutArret;
      const finArret = name === "heureFinArret" ? value : formData.heureFinArret;
      updated.heures_arret = calcDuree(debutArret, finArret);
    }

    // Ce bloc était en dehors de handleChange — déplacé ici
    if (name === "etat_machine" && value === "En marche") {
      updated.type_arret = "";
      updated.heureDebutArret = "";
      updated.heureFinArret = "";
      updated.heures_arret = 0;
    }

    setFormData(updated);
  };

  const handleEquipementChange = (equipement) => {
    if (!isAdmin) return;
    const list = formData.equipements;
    setFormData({
      ...formData,
      equipements: list.includes(equipement)
        ? list.filter((e) => e !== equipement)
        : [...list, equipement],
    });
  };

  const addEquipement = () => {
    if (!isAdmin) return;
    const newEquip = prompt("Entrer le nom du nouvel équipement");
    if (newEquip && !equipementOptions.includes(newEquip)) {
      setEquipementOptions([...equipementOptions, newEquip]);
    }
  };

  const resetForm = () => setFormData(emptyForm);

  const handleSubmit = async (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    try {
      if (editIndex !== null && editId) {
        await dispatch(updatePoussageAsync({ id: editId, data: formData })).unwrap();
        setEditIndex(null);
        setEditId(null);
      } else {
        await dispatch(addPoussageAsync(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Erreur lors de l'enregistrement: " + (typeof err === "string" ? err : JSON.stringify(err)));
    }
  };

  const rendement =
    formData.temps > 0
      ? (parseFloat(formData.volume_sote) / parseFloat(formData.temps)).toFixed(2)
      : 0;

  // FIX 4 : OEE / TU / TD étaient utilisés sans être définis — calculs ajoutés
  const htp = parseFloat(formData.htp) || 0;
  const temps = parseFloat(formData.temps) || 0;
  const heuresArret = parseFloat(formData.heures_arret) || 0;
const OEE = htp > 0 && rendement > 0
    ? ((htp / 24) * 100).toFixed(1) :0;  
 
// 1. Taux d'utilisation (TU) basé sur htp
const TU = htp > 0 ? ((OEE / 24) * 100) .toFixed(1) :0;

// 2. Temps disponible réel
const tempsFonctionnement = htp - heuresArret;

// 3. Taux de disponibilité (TD)
const TD = htp > 0 ?((tempsFonctionnement / 24) * 100) .toFixed(1) :0;

// 4. Format final


  return (
    <div>

      {/* HEADER */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Gestion Décapage <span>ZD11</span>
        </h2>
        <img src={image} alt="logo" className="header-logo" />
      </div>

      <style>{`
        .form-card {
          background:#fff; border:1px solid #e5e7eb; border-radius:12px;
          padding:24px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); margin-top:20px;
        }
        .db-form-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 16px;
        }
        .db-form-label {
          display: block; font-size: 11px; font-weight: 700; color: #4b5563;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .db-form-input {
          width: 100%; border: 1.5px solid #d1fae5; border-radius: 8px;
          padding: 10px 12px; font-size: 14px; color: #1f2937;
          background: #f8fafc; outline: none; transition: all 0.2s; box-sizing: border-box;
        }
        .db-form-input:focus {
          border-color: #16a34a; background: #fff;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        .db-form-input[readOnly] {
          background: #f0fdf4; color: #15803d; font-weight: 600; border-color: #bbf7d0;
        }
        .db-form-select {
          width: 100%; border: 1.5px solid #d1fae5; border-radius: 8px;
          padding: 10px 12px; font-size: 14px; color: #1f2937;
          background: #f8fafc; outline: none; cursor: pointer; transition: all 0.2s;
          box-sizing: border-box;
        }
        .db-form-select:focus { border-color: #16a34a; background: #fff; }
        .db-select-danger {
          border-color: rgba(217,119,6,0.4) !important;
          background-color: #fef3c7 !important; color: #92400e !important;
        }
        .db-select-danger:focus {
          box-shadow: 0 0 0 3px rgba(217,119,6,0.12) !important;
          border-color: #b45309 !important;
        }
        .db-arret-zone {
          grid-column: span 4;
          background: linear-gradient(135deg, #fef3c7, #fff9ec);
          border: 1.5px solid rgba(217,119,6,0.25); border-radius: 12px;
          padding: 20px 24px; position: relative;
          box-shadow: 0 4px 20px rgba(146,64,14,0.06);
          display: flex; flex-direction: column; gap: 16px;
        }
        .db-arret-zone::before {
          content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, #b45309, #92400e); border-radius: 12px 0 0 12px;
        }
        .db-arret-head {
          display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: #b45309;
        }
        .db-arret-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #b45309; box-shadow: 0 0 0 3px rgba(180,83,9,0.15);
        }
        .db-arret-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .db-arret-zone .db-form-input { background: #fff; border-color: rgba(217,119,6,0.2); }
        .db-arret-zone .db-form-input:focus {
          border-color: #b45309; box-shadow: 0 0 0 3px rgba(217,119,6,0.08); color: #92400e;
        }
        .db-equip-box {
          grid-column: span 4; border: 1.5px dashed #bbf7d0; border-radius: 10px;
          padding: 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 12px;
        }
        .db-equip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .db-equip-chip {
          padding: 6px 16px; border-radius: 20px; border: 1.5px solid #bbf7d0;
          font-size: 13px; font-weight: 600; color: #4b5563; background: #fff;
          cursor: pointer; transition: all 0.2s; user-select: none;
        }
        .db-equip-chip:hover { border-color: #16a34a; background: #f0fdf4; }
        .db-equip-chip.selected { background: #16a34a; color: #fff; border-color: #15803d; }
        .db-equip-add {
          padding: 6px 16px; border-radius: 20px; border: 1.5px dashed #16a34a;
          font-size: 13px; font-weight: 600; color: #16a34a; background: transparent;
          cursor: pointer; transition: all 0.2s;
        }
        .db-equip-add:hover { background: #f0fdf4; }
        .db-rendement-banner {
          background: #064e3b; border-radius: 10px; padding: 16px 20px;
          display: flex; align-items: center; gap: 16px; align-self: end;
        }
        .db-rendement-value { font-size: 32px; font-weight: 800; color: #34d399; line-height: 1; }
        .db-rendement-label { font-size: 13px; color: #a7f3d0; font-weight: 500; }
        .db-actions {
          grid-column: span 2; display: flex; gap: 12px; align-items: end; justify-content: flex-end;
        }
        .db-btn-submit {
          background: #16a34a; color: #fff; border: none; border-radius: 8px;
          padding: 12px 24px; font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);
        }
        .db-btn-submit:hover { background: #15803d; transform: translateY(-1px); }
        .db-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .db-btn-cancel {
          background: #f3f4f6; color: #4b5563; border: none; border-radius: 8px;
          padding: 12px 24px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .db-btn-cancel:hover { background: #e5e7eb; }
        @media (max-width: 1024px) {
          .db-form-grid { grid-template-columns: repeat(2, 1fr); }
          .db-arret-zone, .db-equip-box, .db-actions { grid-column: span 2; }
        }
        @media (max-width: 600px) {
          .db-form-grid { grid-template-columns: 1fr; }
          .db-arret-zone, .db-equip-box, .db-actions { grid-column: span 1; }
          .db-actions { justify-content: stretch; }
          .db-btn-submit, .db-btn-cancel { flex: 1; }
        }
      `}</style>

      {/* FORM */}
      <div className="form-card">
       
        <form onSubmit={handleSubmit} className="db-form-grid">

          {/* ROW 1 — Localisation */}
          <div>
            <label className="db-form-label">Date</label>
            <input type="date" className="db-form-input" name="date"
              value={formData.date} onChange={handleChange} required
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">Panneau</label>
            <input type="text" className="db-form-input" name="panneau"
              value={formData.panneau} onChange={handleChange} placeholder="Ex: P1"
               disabled={!isAdmin}
               />
          </div>
          <div>
            <label className="db-form-label">Tranchée</label>
            <input type="text" className="db-form-input" name="tranchee"
              value={formData.tranchee} onChange={handleChange} placeholder="Ex: TR12"
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">Niveau</label>
            <input type="text" className="db-form-input" name="niveau"
              value={formData.niveau} onChange={handleChange} placeholder="Ex: N1"
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">HTP</label>
            <input type="number" step="1" min="0" max="8" className="db-form-input" name="htp"
              value={formData.htp} onChange={handleChange} placeholder="Saisir le htp"
               disabled={!isAdmin} />
          </div>

          {/* ROW 2 — Mesures */}
          <div>
            <label className="db-form-label">Profondeur (m)</label>
            <input type="number" step="0.01" className="db-form-input" name="profondeur"
              value={formData.profondeur} onChange={handleChange} placeholder="0.00"
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">Volume Souté (t)</label>
            <input type="number" step="0.01" className="db-form-input" name="volume_sote"
              value={formData.volume_sote} onChange={handleChange} placeholder="0.00" 
               disabled={!isAdmin}/>
          </div>
          <div>
            <label className="db-form-label">Heure Début</label>
            <input type="time" className="db-form-input" name="heureDebut"
              value={formData.heureDebut} onChange={handleChange} 
               disabled={!isAdmin}/>
          </div>
          <div>
            <label className="db-form-label">Heure Fin</label>
            <input type="time" className="db-form-input" name="heureFin"
              value={formData.heureFin} onChange={handleChange}
               disabled={!isAdmin} />
          </div>

          {/* ROW 3 — Personnel & Machine */}
          <div>
            <label className="db-form-label">Conducteur</label>
            <input type="text" className="db-form-input" name="conducteur"
              value={formData.conducteur} onChange={handleChange} placeholder="Nom"
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">Matricule</label>
            <input type="text" className="db-form-input" name="matricule"
              value={formData.matricule} onChange={handleChange} placeholder="Matricule conducteur" 
               disabled={!isAdmin}/>
          </div>
          <div>
            <label className="db-form-label">Machine</label>
            <input type="number" className="db-form-input" name="machine_id"
              value={formData.machine_id} onChange={handleChange} placeholder="ID machine"
               disabled={!isAdmin} />
          </div>
          <div>
            <label className="db-form-label">Poste</label>
            <input type="text" className="db-form-input" name="poste"
              value={formData.poste} onChange={handleChange} placeholder="Ex: Matin"
               disabled={!isAdmin} />
          </div>

        
          <div style={{ gridColumn: "span 2" }}>
            <label className="db-form-label">État Machine</label>
            <select
              className={`db-form-select ${formData.etat_machine === "En arrêt" ? "db-select-danger" : ""}`}
              name="etat_machine"
              value={formData.etat_machine}
              onChange={handleChange}
               disabled={!isAdmin}
            >
              <option value="En marche">En marche</option>
              <option value="En arrêt">En arrêt</option>
            </select>
          </div>

          {/* ZONE ARRÊT — conditionnelle */}
          {formData.etat_machine === "En arrêt" && (
            <div className="db-arret-zone">
              <div className="db-arret-head"><div className="db-arret-dot" />Détails de l'arrêt</div>
              <div className="db-arret-grid">
                <div>
                  <label className="db-form-label" style={{ color: "#92400e" }}>Nature d'arrêt</label>
                  <input type="text" className="db-form-input" name="type_arret"
                    value={formData.type_arret} onChange={handleChange} placeholder="Cause technique..."
                     disabled={!isAdmin} />
                </div>
                <div>
                  <label className="db-form-label" style={{ color: "#92400e" }}>Heure Début Arrêt</label>
                  <input type="time" className="db-form-input" name="heureDebutArret"
                    value={formData.heureDebutArret} onChange={handleChange}
                     disabled={!isAdmin} />
                </div>
                <div>
                  <label className="db-form-label" style={{ color: "#92400e" }}>Heure Fin Arrêt</label>
                  <input type="time" className="db-form-input" name="heureFinArret"
                    value={formData.heureFinArret} onChange={handleChange} 
                     disabled={!isAdmin}/>
                </div>
              </div>
            </div>
          )}

          {/* ÉQUIPEMENTS */}
          <div className="db-equip-box">
            <label className="db-form-label" style={{ marginBottom: 0 }}>Équipements mobilisés</label>
            <div className="db-equip-grid">
              {equipementOptions.map((eq, index) => (
                <div
                  key={index}
                  className={`db-equip-chip ${formData.equipements.includes(eq) ? "selected" : ""}`}
                  onClick={() => handleEquipementChange(eq)}
                >
                  {eq}
                </div>
              ))}
               {isAdmin && (<button type="button" className="db-equip-add" onClick={addEquipement}>+ Ajouter</button>)}
            </div>
          </div>

          {/* FIX 5 : bannières corrigées — JSX invalide (commentaire // dans JSX) supprimé,
              structure de grille imbriquée déplacée hors de la div parente */}
          <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignSelf: "end" }}>
            <div className="db-rendement-banner">
              <div className="db-rendement-value">{formData.temps || 0}</div>
              <div className="db-rendement-label">h<br />Heures de marche</div>
            </div>
            <div className="db-rendement-banner">
              <div className="db-rendement-value">{rendement}</div>
              <div className="db-rendement-label">t/h<br />Rendement instantané</div>
            </div>
          </div>

          <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", alignSelf: "end" }}>
            <div className="db-rendement-banner">
              <div className="db-rendement-value">{OEE}</div>
              <div className="db-rendement-label">OEE %</div>
            </div>
            <div className="db-rendement-banner">
              <div className="db-rendement-value">{TU}</div>
              <div className="db-rendement-label">TU %</div>
            </div>
            <div className="db-rendement-banner">
              <div className="db-rendement-value">{TD}</div>
              <div className="db-rendement-label">TD %</div>
            </div>
          </div>

          {/* BOUTONS */}
          <div className="db-actions">
            {editIndex !== null && (
              <button type="button" className="db-btn-cancel"
                onClick={() => { resetForm(); setEditIndex(null); setEditId(null); }}>
                Annuler
              </button>
            )}
             {isAdmin && (
            <button type="submit" className="db-btn-submit" disabled={loading}>
              {loading ? "Enregistrement..." : editIndex !== null ? "Mettre à jour" : "Enregistrer"}
            </button>
             )}
          </div>

        </form>
        
      </div>

    </div>
  );
}

export default Dashboard;