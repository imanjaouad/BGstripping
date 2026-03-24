import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPoussagesAPI,
  createPoussageAPI,
  updatePoussageAPI,
  deletePoussageAPI,
} from "../services/api";

// ─── Helper : calcule les heures de marche depuis heure_debut/heure_fin ──────
function calcTempsFromHeures(debut, fin) {
  if (!debut || !fin) return 0;
  const [dh, dm] = debut.split(":").map(Number);
  const [fh, fm] = fin.split(":").map(Number);
  let mins = (fh * 60 + fm) - (dh * 60 + dm);
  if (mins < 0) mins += 24 * 60; // passage minuit
  return parseFloat((mins / 60).toFixed(2));
}

// ─── Helper : normalise un enregistrement backend → champs frontend ───────────
function mapBackendToFrontend(p) {
  // Priorité : valeur stockée → calculé depuis heures → 0
  const tempsCalc = calcTempsFromHeures(p.heure_debut, p.heure_fin);
  const temps = parseFloat(p.temps) > 0 ? parseFloat(p.temps) : tempsCalc;

  // Heures d'arrêt : valeur stockée → calculé depuis arret_heure_debut/fin → 0
  const arretCalc = calcTempsFromHeures(p.arret_heure_debut, p.arret_heure_fin);
  const heures_arret =
    parseFloat(p.heures_arret) > 0
      ? parseFloat(p.heures_arret)
      : arretCalc;

  return {
    id: p.id,
    date: p.operation_date ? p.operation_date.split("T")[0] : "",
    panneau: p.panneau || "",
    tranchee: p.tranchee || "",
    niveau: p.niveau || "",
    volume_soté: p.volume_sote || p.saute || 0,
    profendeur: p.profondeur || 0,
    equipements: p.equipements_json || (p.equipement ? [p.equipement] : []),
    conducteur: p.conducteur || "",
    matricule: p.matricule || "",
    heureDebut: p.heure_debut || "",
    heureFin: p.heure_fin || "",
    temps,                    // ← corrigé : jamais 0 si les heures existent
    compteurDebut: p.compteur_debut || 0,
    compteurFin: p.compteur_fin || 0,
    poste: p.poste || "",
    etatMachine:
      p.etat_machine === "en_marche"
        ? "En marche"
        : p.etat_machine === "en_arret"
        ? "En arrêt"
        : p.etat_machine || "En marche",
    typeArret: p.type_arret || "",
    heureDebutArret: p.arret_heure_debut || "",
    heureFinArret: p.arret_heure_fin || "",
    htp: parseFloat(p.htp) || 0,
    heures_arret,             // ← corrigé : jamais 0 si les heures existent
  };
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchPoussages = createAsyncThunk(
  "poussage/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPoussagesAPI();
      return res.data; // array of poussages from Laravel
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addPoussageAsync = createAsyncThunk(
  "poussage/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createPoussageAPI(formData);
      return res.data; // the newly created poussage
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

export const updatePoussageAsync = createAsyncThunk(
  "poussage/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updatePoussageAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

export const deletePoussageAsync = createAsyncThunk(
  "poussage/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deletePoussageAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const poussageSlice = createSlice({
  name: "poussage",
  initialState,
  reducers: {
    addPoussage: (state, action) => {
      state.list.unshift(action.payload);
    },
    deletePoussage: (state, action) => {
      state.list.splice(action.payload, 1);
    },
    updatePoussage: (state, action) => {
      const { index, data } = action.payload;
      if (state.list[index]) {
        state.list[index] = data;
      }
    },
    // Mise à jour directe avec champs frontend (contourne mapBackendToFrontend)
    forceUpdate: (state, action) => {
      const p = action.payload;
      const idx = state.list.findIndex((item) => item.id === p.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...p };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPoussages
      .addCase(fetchPoussages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoussages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload || []).map(mapBackendToFrontend);
      })
      .addCase(fetchPoussages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addPoussageAsync
      .addCase(addPoussageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPoussageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(mapBackendToFrontend(action.payload));
      })
      .addCase(addPoussageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePoussageAsync
      .addCase(updatePoussageAsync.fulfilled, (state, action) => {
        const p = action.payload;
        const idx = state.list.findIndex((item) => item.id === p.id);
        if (idx !== -1) {
          // Si backend renvoie snake_case → mapBackendToFrontend
          // Sinon (echo frontend) → merge direct
          if (p.operation_date !== undefined || p.heure_debut !== undefined) {
            state.list[idx] = mapBackendToFrontend(p);
          } else {
            const cur = state.list[idx];
            state.list[idx] = {
              ...cur,
              id:              p.id,
              date:            p.date            ?? cur.date,
              panneau:         p.panneau         ?? cur.panneau,
              tranchee:        p.tranchee        ?? cur.tranchee,
              niveau:          p.niveau          ?? cur.niveau,
              volume_soté:     parseFloat(p["volume_soté"])  || cur["volume_soté"],
              profendeur:      p.profendeur      ?? cur.profendeur,
              equipements:     p.equipements     ?? cur.equipements,
              conducteur:      p.conducteur      ?? cur.conducteur,
              matricule:       p.matricule       ?? cur.matricule,
              heureDebut:      p.heureDebut      ?? cur.heureDebut,
              heureFin:        p.heureFin        ?? cur.heureFin,
              temps:           parseFloat(p.temps)           || cur.temps,
              poste:           p.poste           ?? cur.poste,
              etatMachine:     p.etat_machine    ?? p.etatMachine ?? cur.etatMachine,
              typeArret:       p.typeArret       ?? cur.typeArret,
              heureDebutArret: p.heureDebutArret ?? cur.heureDebutArret,
              heureFinArret:   p.heureFinArret   ?? cur.heureFinArret,
              htp:             parseFloat(p.htp)             || cur.htp,
              heures_arret:    parseFloat(p.heures_arret)    || cur.heures_arret,
            };
          }
        }
      })

      // deletePoussageAsync
      .addCase(deletePoussageAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((item) => item.id !== id);
      });
  },
});

export const { addPoussage, deletePoussage, updatePoussage, forceUpdate } = poussageSlice.actions;
export default poussageSlice.reducer;