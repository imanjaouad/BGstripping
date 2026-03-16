import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCasementsAPI,
  createCasementAPI,
  updateCasementAPI,
  deleteCasementAPI,
} from "../services/api";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCasements = createAsyncThunk(
  "casement/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCasementsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addCasementAsync = createAsyncThunk(
  "casement/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createCasementAPI(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

export const updateCasementAsync = createAsyncThunk(
  "casement/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCasementAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

export const deleteCasementAsync = createAsyncThunk(
  "casement/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCasementAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Helper: map backend → frontend field names ───────────────────────────────

function mapBackendToFrontend(c) {
  return {
    id: c.id,
    date: c.operation_date ? c.operation_date.split("T")[0] : "",
    panneau: c.panneau || "",
    tranchee: c.tranchee || "",
    niveau: c.niveau || "",
    volume_casse: c.volume_casse || 0,
    granulometrie: c.granulometrie || "",
    type_roche: c.type_roche || "",
    nombreCoups: c.nombre_coups || 0,
    equipements: c.equipements || [],
    conducteur: c.conducteur || "",
    matricule: c.matricule || "",
    heureDebut: c.heure_debut || "",
    heureFin: c.heure_fin || "",
    temps: c.temps || 0,
    poste: c.poste || "",
    etatMachine:
      c.etat_machine === "en_marche"
        ? "En marche"
        : c.etat_machine === "en_arret"
        ? "En arrêt"
        : c.etat_machine || "En marche",
    typeArret: c.type_arret || "",
    heureDebutArret: c.arret_heure_debut || "",
    heureFinArret: c.arret_heure_fin || "",
  };
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const casementSlice = createSlice({
  name: "casement",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCasement: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateCasement: (state, action) => {
      const { index, data } = action.payload;
      if (state.list[index]) state.list[index] = data;
    },
    deleteCasement: (state, action) => {
      state.list.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCasements
      .addCase(fetchCasements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCasements.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload || []).map(mapBackendToFrontend);
      })
      .addCase(fetchCasements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addCasementAsync
      .addCase(addCasementAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCasementAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(mapBackendToFrontend(action.payload));
      })
      .addCase(addCasementAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCasementAsync
      .addCase(updateCasementAsync.fulfilled, (state, action) => {
        const mapped = mapBackendToFrontend(action.payload);
        const idx = state.list.findIndex((item) => item.id === mapped.id);
        if (idx !== -1) state.list[idx] = mapped;
      })

      // deleteCasementAsync
      .addCase(deleteCasementAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((item) => item.id !== id);
      });
  },
});

export const { addCasement, updateCasement, deleteCasement } =
  casementSlice.actions;
export default casementSlice.reducer;
