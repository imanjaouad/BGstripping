import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPoussagesAPI,
  createPoussageAPI,
  updatePoussageAPI,
  deletePoussageAPI,
} from "../services/api";

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
    // Keep local actions for compatibility, though async thunks are preferred
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
        // Map backend fields to the frontend field names used in components
        state.list = (action.payload || []).map((p) => ({
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
          temps: p.temps || 0,
          compteurDebut: p.compteur_debut || 0,
          compteurFin: p.compteur_fin || 0,
          poste: p.poste || "",
          etatMachine: p.etat_machine === "en_marche" ? "En marche" : p.etat_machine === "en_arret" ? "En arrêt" : (p.etat_machine || "En marche"),
          typeArret: p.type_arret || "",
          heureDebutArret: p.arret_heure_debut || "",
          heureFinArret: p.arret_heure_fin || "",
        }));
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
        const p = action.payload;
        state.list.unshift({
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
          temps: p.temps || 0,
          compteurDebut: p.compteur_debut || 0,
          compteurFin: p.compteur_fin || 0,
          poste: p.poste || "",
          etatMachine: p.etat_machine === "en_marche" ? "En marche" : p.etat_machine === "en_arret" ? "En arrêt" : (p.etat_machine || "En marche"),
          typeArret: p.type_arret || "",
          heureDebutArret: p.arret_heure_debut || "",
          heureFinArret: p.arret_heure_fin || "",
        });
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
          state.list[idx] = {
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
            temps: p.temps || 0,
            compteurDebut: p.compteur_debut || 0,
            compteurFin: p.compteur_fin || 0,
            poste: p.poste || "",
            etatMachine: p.etat_machine === "en_marche" ? "En marche" : p.etat_machine === "en_arret" ? "En arrêt" : (p.etat_machine || "En marche"),
            typeArret: p.type_arret || "",
            heureDebutArret: p.arret_heure_debut || "",
            heureFinArret: p.arret_heure_fin || "",
          };
        }
      })

      // deletePoussageAsync
      .addCase(deletePoussageAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((item) => item.id !== id);
      });
  },
});

export const { addPoussage, deletePoussage, updatePoussage } = poussageSlice.actions;
export default poussageSlice.reducer;