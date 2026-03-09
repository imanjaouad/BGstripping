import { useEffect, useMemo, useRef, useState } from "react";
import "../style/PoussageForm.css";

const baseForm = {
  date: "",
  panneau: "",
  tranchee: "",
  niveau: "",
  saute: "",
  profondeur: "",
  conducteur: "",
  matricule: "",
  debutCompteur: "",
  finCompteur: "",
  etatMachine: "en_marche",
  typeArret: "",
  heureDebutArret: "",
  heureFinArret: "",
};

const trancheOptions = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"];
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function PoussageForm() {
  const [formData, setFormData] = useState(baseForm);
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [customMachineInput, setCustomMachineInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addingMachine, setAddingMachine] = useState(false);
  const [feedback, setFeedback] = useState("");
  const dateInputRef = useRef(null);

  const isStopped = useMemo(() => formData.etatMachine === "en_arret", [formData.etatMachine]);

  const heuresMarche = useMemo(() => {
    const debut = Number(formData.debutCompteur || 0);
    const fin = Number(formData.finCompteur || 0);
    if (!Number.isFinite(debut) || !Number.isFinite(fin) || fin < debut) {
      return "0";
    }
    return String(fin - debut);
  }, [formData.debutCompteur, formData.finCompteur]);

  const rendementInstantane = useMemo(() => {
    const volumeSaute = Number(formData.saute || 0);
    const heures = Number(heuresMarche || 0);
    if (!Number.isFinite(volumeSaute) || !Number.isFinite(heures) || heures <= 0) {
      return "0";
    }
    return (volumeSaute / heures).toFixed(2);
  }, [formData.saute, heuresMarche]);

  const selectedMachine = useMemo(
    () => machines.find((machine) => machine.id === selectedMachineId) || null,
    [machines, selectedMachineId]
  );

  const loadMachines = async () => {
    const response = await fetch(`${API_BASE_URL}/api/machines`, {
      headers: { Accept: "application/json" },
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.message || "Impossible de charger les machines.");
    }

    setMachines(Array.isArray(payload?.data) ? payload.data : []);
  };

  useEffect(() => {
    loadMachines().catch((error) => {
      setFeedback(error.message || "Erreur reseau.");
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "etatMachine" && value !== "en_arret"
        ? { typeArret: "", heureDebutArret: "", heureFinArret: "" }
        : {}),
    }));
  };

  const toggleMachine = (machineId) => {
    setSelectedMachineId((prev) => (prev === machineId ? null : machineId));
  };

  const addMachine = async () => {
    const cleanValue = customMachineInput.trim();
    if (!cleanValue) {
      return;
    }

    setAddingMachine(true);
    setFeedback("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/machines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: cleanValue }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Erreur ajout machine.");
      }

      const createdMachine = payload?.data;
      if (createdMachine?.id) {
        setMachines((prev) => [...prev, createdMachine].sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedMachineId(createdMachine.id);
      }
      setCustomMachineInput("");
    } catch (error) {
      setFeedback(error.message || "Erreur reseau.");
    } finally {
      setAddingMachine(false);
    }
  };

  const resetForm = () => {
    setFormData(baseForm);
    setSelectedMachineId(null);
    setCustomMachineInput("");
  };

  const handleNewReportClick = () => {
    resetForm();
    setFeedback("");
    dateInputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");

    if (!selectedMachineId) {
      setFeedback("Choisis une seule machine.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        machineId: selectedMachineId,
        heuresMarche,
      };

      const response = await fetch(`${API_BASE_URL}/api/poussages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || "Erreur pendant l'enregistrement.");
      }

      window.dispatchEvent(new Event("poussage-saved"));
      setFeedback("Enregistrement reussi.");
      resetForm();
    } catch (error) {
      setFeedback(error.message || "Erreur reseau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="poussage" className="poussage-page py-5">
      <div className="container">
        <button type="button" className="poussage-title-badge" onClick={handleNewReportClick}>
          Ajouter les Donnees
        </button>

        <form className="poussage-sheet" onSubmit={handleSubmit}>
          <div className="grid-row grid-4">
            <label className="field">
              <span>Date</span>
              <input ref={dateInputRef} type="date" name="date" value={formData.date} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Panneau</span>
              <input type="text" name="panneau" value={formData.panneau} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Tranchee</span>
              <select name="tranchee" value={formData.tranchee} onChange={handleChange} required>
                <option value="">Choisir tranche</option>
                {trancheOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Niveau</span>
              <input type="text" name="niveau" value={formData.niveau} onChange={handleChange} required />
            </label>
          </div>

          <div className="grid-row grid-2">
            <label className="field">
              <span>Volume Sauté</span>
              <input type="number" min="0" step="0.01" name="saute" value={formData.saute} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Profondeur</span>
              <input type="number" min="0" step="0.01" name="profondeur" value={formData.profondeur} onChange={handleChange} required />
            </label>
          </div>

          <div className="grid-row">
            <div className="equip-card">
              <p>Equipements (Machines)</p>
              <div className="equip-grid">
                {machines.map((machine) => (
                  <label key={machine.id} className="equip-option">
                    <input
                      type="checkbox"
                      checked={selectedMachineId === machine.id}
                      onChange={() => toggleMachine(machine.id)}
                    />
                    <span>{machine.name}</span>
                  </label>
                ))}
              </div>

              <div className="equip-actions">
                <input
                  type="text"
                  placeholder="Ajouter autre machine"
                  value={customMachineInput}
                  onChange={(e) => setCustomMachineInput(e.target.value)}
                />
                <button type="button" onClick={addMachine} disabled={addingMachine}>
                  {addingMachine ? "Ajout..." : "+ Ajouter machine"}
                </button>
              </div>

              <label className="field equip-input-preview">
                <span>Equipement</span>
                <input type="text" value={selectedMachine?.name || ""} placeholder="Machine selectionnee" readOnly />
              </label>
            </div>
          </div>

          <div className="grid-row grid-2">
            <label className="field">
              <span>Conducteur</span>
              <input type="text" name="conducteur" value={formData.conducteur} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Matricule</span>
              <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} required />
            </label>
          </div>

          <div className="grid-row grid-3">
            <label className="field">
              <span>Debut Compteur</span>
              <input type="number" min="0" step="1" name="debutCompteur" value={formData.debutCompteur} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Fin Compteur</span>
              <input type="number" min="0" step="1" name="finCompteur" value={formData.finCompteur} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Etat Machine</span>
              <select name="etatMachine" value={formData.etatMachine} onChange={handleChange}>
                <option value="en_marche">En marche</option>
                <option value="en_arret">En arret</option>
              </select>
            </label>
          </div>

          {isStopped && (
            <div className="grid-row grid-3">
              <label className="field">
                <span>Type arret</span>
                <input type="text" name="typeArret" value={formData.typeArret} onChange={handleChange} required={isStopped} />
              </label>

              <label className="field">
                <span>Heure debut arret</span>
                <input type="time" name="heureDebutArret" value={formData.heureDebutArret} onChange={handleChange} required={isStopped} />
              </label>

              <label className="field">
                <span>Heure fin arret</span>
                <input type="time" name="heureFinArret" value={formData.heureFinArret} onChange={handleChange} required={isStopped} />
              </label>
            </div>
          )}

          <p className="rendement">Rendement Instantane : {rendementInstantane} t/h</p>
          <p className="rendement-meta">Heures de Marche (calculees): {heuresMarche} h</p>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Enregistrement..." : "Enregistrer les Donnees"}
          </button>

          {feedback ? <p className="submit-feedback">{feedback}</p> : null}
        </form>
      </div>
    </section>
  );
}
