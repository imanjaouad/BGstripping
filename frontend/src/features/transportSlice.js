import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTransportJournaliersAPI,
  createTransportJournalierAPI,
} from "../services/api";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/** Fetch all transport records (optionally filtered by date) */
export const fetchTransportJournaliers = createAsyncThunk(
  "transport/fetchAll",
  async (date = null, { rejectWithValue }) => {
    try {
      const res = await fetchTransportJournaliersAPI(date);
      // res is already the parsed JSON array (from the request() wrapper)
      return Array.isArray(res) ? res : res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Upsert a transport record.
 * The backend uses updateOrCreate on (date, entreprise, type_moyen).
 */
export const saveTransportJournalier = createAsyncThunk(
  "transport/save",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createTransportJournalierAPI(payload);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.data || err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  list: [],
  loading: false,
  saving: false,
  error: null,
};

const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransportJournaliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportJournaliers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload || []).map((r) => ({
          id: r.id,
          date: r.operation_date ? String(r.operation_date).split("T")[0] : "",
          entreprise: r.entreprise,
          type_moyen: r.type_moyen,
          nombre_voyages: Number(r.nombre_voyages) || 0,
          capacite_camion: Number(r.capacite_camion) || 0,
          volume_decape: Number(r.volume_decape) || 0,
        }));
      })
      .addCase(fetchTransportJournaliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveTransportJournalier.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveTransportJournalier.fulfilled, (state, action) => {
        state.saving = false;
        const r = action.payload;
        const mapped = {
          id: r.id,
          date: r.operation_date ? String(r.operation_date).split("T")[0] : "",
          entreprise: r.entreprise,
          type_moyen: r.type_moyen,
          nombre_voyages: Number(r.nombre_voyages) || 0,
          capacite_camion: Number(r.capacite_camion) || 0,
          volume_decape: Number(r.volume_decape) || 0,
        };
        const idx = state.list.findIndex(
          (x) =>
            x.date === mapped.date &&
            x.entreprise === mapped.entreprise &&
            x.type_moyen === mapped.type_moyen
        );
        if (idx !== -1) {
          state.list[idx] = mapped;
        } else {
          state.list.push(mapped);
        }
      })
      .addCase(saveTransportJournalier.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export default transportSlice.reducer;
