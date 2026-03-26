import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTransportJournaliersAPI,
  createTransportJournalierAPI,
<<<<<<< HEAD
  updateTransportJournalierAPI,
  deleteTransportJournalierAPI,
=======
>>>>>>> clean-IMANE
} from "../services/api";

// ─── Fonction utilitaire ───────────────────────────────────────────────────────
// Convertit un enregistrement brut venant du backend en objet propre.
// Retourne null si l'enregistrement est invalide (protection contre les crashes).
function mapRecord(r) {
  if (!r || typeof r !== "object") return null;
  return {
    id: r.id ?? null,
    // operation_date peut contenir une heure (ex: "2024-03-17T00:00:00"), on garde juste la date
    date: r.operation_date
      ? String(r.operation_date).split("T")[0]
      : r.date || "",
    entreprise: r.entreprise || "",
    type_moyen: r.type_moyen || "",
    nombre_voyages: Number(r.nombre_voyages) || 0,
    capacite_camion: Number(r.capacite_camion) || 0,
    volume_decape: Number(r.volume_decape) || 0,
<<<<<<< HEAD
    panneau: r.panneau || "",
    tranchee: r.tranchee || "",
    niveau: r.niveau || "",
=======
>>>>>>> clean-IMANE
  };
}

// ─── Actions asynchrones (Thunks) ─────────────────────────────────────────────

/** Récupère tous les enregistrements de transport (filtrés par date si fournie) */
export const fetchTransportJournaliers = createAsyncThunk(
  "transport/fetchAll",
  async (date = null, { rejectWithValue }) => {
    try {
      const res = await fetchTransportJournaliersAPI(date);
      // api.js retourne directement le JSON parsé (pas un objet axios avec .data)
      return Array.isArray(res) ? res : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Crée ou met à jour un enregistrement de transport (upsert).
 * Le backend utilise updateOrCreate sur (date, entreprise, type_moyen).
 * Après la sauvegarde, on recharge la liste pour la même date.
 */
export const saveTransportJournalier = createAsyncThunk(
  "transport/save",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await createTransportJournalierAPI(payload);
      // Important : le payload contient "operation_date" et non "date"
      // Si on passe payload?.date, ça vaut undefined → le filtre backend plante
      const dateParam = payload?.operation_date || null;
      await dispatch(fetchTransportJournaliers(dateParam));
      return res;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

<<<<<<< HEAD
/** Supprime un enregistrement transport par son ID */
export const deleteTransportJournalier = createAsyncThunk(
  "transport/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTransportJournalierAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

/** Met à jour un enregistrement transport */
export const updateTransportJournalier = createAsyncThunk(
  "transport/update",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await updateTransportJournalierAPI(id, data);
      await dispatch(fetchTransportJournaliers());
      return res;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

=======
>>>>>>> clean-IMANE
// ─── Slice Redux ───────────────────────────────────────────────────────────────

const initialState = {
  list: [],       // liste des enregistrements chargés
  loading: false, // chargement en cours (fetch)
  saving: false,  // sauvegarde en cours (save)
  error: null,    // message d'erreur éventuel
};

const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Fetch : chargement de la liste ──────────────────────────────────────
      .addCase(fetchTransportJournaliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportJournaliers.fulfilled, (state, action) => {
        state.loading = false;
        const data = Array.isArray(action.payload) ? action.payload : [];
        // On filtre les éléments null (enregistrements invalides rejetés par mapRecord)
        state.list = data.map(mapRecord).filter(Boolean);
      })
      .addCase(fetchTransportJournaliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Save : sauvegarde d'un enregistrement ───────────────────────────────
      .addCase(saveTransportJournalier.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveTransportJournalier.fulfilled, (state) => {
        // La liste est déjà mise à jour par le fetchTransportJournaliers
        // appelé à l'intérieur du thunk saveTransportJournalier
        state.saving = false;
      })
      .addCase(saveTransportJournalier.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
<<<<<<< HEAD
      })

      // ── Delete ──────────────────────────────────────────────────────────────
      .addCase(deleteTransportJournalier.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      })

      // ── Update ──────────────────────────────────────────────────────────────
      .addCase(updateTransportJournalier.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateTransportJournalier.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateTransportJournalier.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
=======
>>>>>>> clean-IMANE
      });
  },
});

export default transportSlice.reducer;
