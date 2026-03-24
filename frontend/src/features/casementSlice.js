// ═══════════════════════════════════════════════════════════════════════════
// casementSlice.js  — Version API Laravel
//
// Remplace intégralement la version localStorage.
// Toutes les mutations (add / update / delete) passent par l'API Laravel.
// La liste locale Redux est synchronisée après chaque réponse serveur.
// ═══════════════════════════════════════════════════════════════════════════

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ── URL de base ──────────────────────────────────────────────────────────
const BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : "http://localhost:8000/api";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/* ─────────────────────────────────────────────────────────────────────────
   MAPPING  camelCase (React)  ←→  snake_case (Laravel)
   Les champs du formulaire React utilisent camelCase ;
   l'API Laravel attend snake_case.
───────────────────────────────────────────────────────────────────────── */

/** Formulaire React → corps JSON pour l'API */
const toApi = (f) => ({
  date:                  f.date                  ?? null,
  panneau:               f.panneau               ?? null,
  tranchee:              f.tranchee              ?? null,
  niveau:                f.niveau                ?? null,
  profondeur:            f.profondeur            ?? null,
  volume_saute:          f.volume_saute !== "" ? Number(f.volume_saute) : null,
  conducteur:            f.conducteur            ?? null,
  matricule:             f.matricule             ?? null,
  poste:                 f.poste                 ?? null,
  equipements:           Array.isArray(f.equipements) ? f.equipements : [],
  arrets_equipements:    f.arretsEquipements     ?? null,
  heure_debut_compteur:  f.heureDebutCompteur    ?? null,
  heure_fin_compteur:    f.heureFinCompteur      ?? null,
  temps:                 f.temps  !== "" ? Number(f.temps)  : null,
  htp:                   f.htp    !== "" ? Number(f.htp)    : null,
  etat_machine:          f.etatMachine           ?? "marche",
  type_arret:            f.typeArret             ?? null,
  heure_debut_arret:     f.heureDebutArret       ?? null,
  heure_fin_arret:       f.heureFinArret         ?? null,
  oee:                   f.oee !== "" && f.oee != null ? Number(f.oee) : null,
  tu:                    f.tu  !== "" && f.tu  != null ? Number(f.tu)  : null,
  td:                    f.td  !== "" && f.td  != null ? Number(f.td)  : null,
});

/** Réponse API → objet compatible avec le store Redux / composants React */
const fromApi = (r) => ({
  id:                  r.id,
  date:                r.date,
  panneau:             r.panneau             ?? "",
  tranchee:            r.tranchee            ?? "",
  niveau:              r.niveau              ?? "",
  profondeur:          r.profondeur          ?? "",
  volume_saute:        r.volume_saute        ?? 0,
  conducteur:          r.conducteur          ?? "",
  matricule:           r.matricule           ?? "",
  poste:               r.poste              ?? "",
  equipements:         r.equipements        ?? [],
  arretsEquipements:   r.arrets_equipements  ?? {},
  heureDebutCompteur:  r.heure_debut_compteur ?? "",
  heureFinCompteur:    r.heure_fin_compteur   ?? "",
  temps:               r.temps               ?? "",
  htp:                 r.htp                 ?? "",
  etatMachine:         r.etat_machine        ?? "marche",
  typeArret:           r.type_arret          ?? "",
  heureDebutArret:     r.heure_debut_arret   ?? "",
  heureFinArret:       r.heure_fin_arret     ?? "",
  oee:                 r.oee                 ?? "",
  tu:                  r.tu                  ?? "",
  td:                  r.td                  ?? "",
});

/* ═══════════════════════════════════════════════════════════════════════════
   THUNKS
═══════════════════════════════════════════════════════════════════════════ */

// ── Charger toutes les opérations ─────────────────────────────────────────
export const fetchCasements = createAsyncThunk(
  "casement/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res  = await fetch(`${BASE}/casements?no_pagination=1`, { headers: JSON_HEADERS });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.data ?? []);
      return list.map(fromApi);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Ajouter ───────────────────────────────────────────────────────────────
export const addCasement = createAsyncThunk(
  "casement/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/casements`, {
        method:  "POST",
        headers: JSON_HEADERS,
        body:    JSON.stringify(toApi(formData)),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message ?? "Erreur lors de l'ajout.");
      }
      const json = await res.json();
      return fromApi(json.data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Mettre à jour ─────────────────────────────────────────────────────────
// Signature : { id, data }   (l'index n'est plus nécessaire)
export const updateCasement = createAsyncThunk(
  "casement/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/casements/${id}`, {
        method:  "PUT",
        headers: JSON_HEADERS,
        body:    JSON.stringify(toApi(data)),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message ?? "Erreur lors de la mise à jour.");
      }
      const json = await res.json();
      return fromApi(json.data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Supprimer ─────────────────────────────────────────────────────────────
// Accepte directement l'id (number).
export const deleteCasement = createAsyncThunk(
  "casement/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/casements/${id}`, {
        method:  "DELETE",
        headers: JSON_HEADERS,
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id; // retourné au reducer pour filtrer la liste
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Vider tout ────────────────────────────────────────────────────────────
export const clearCasements = createAsyncThunk(
  "casement/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/casements`, {
        method:  "DELETE",
        headers: { ...JSON_HEADERS, "X-Confirm-Delete": "true" },
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ═══════════════════════════════════════════════════════════════════════════
   SLICE
═══════════════════════════════════════════════════════════════════════════ */
const casementSlice = createSlice({
  name: "casement",
  initialState: {
    list:    [],
    loading: false,
    error:   null,
  },

  reducers: {
    clearError: (state) => { state.error = null; },
  },

  extraReducers: (builder) => {

    // ── fetchCasements ────────────────────────────────────────────────────
    builder
      .addCase(fetchCasements.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchCasements.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list    = payload;
      })
      .addCase(fetchCasements.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });

    // ── addCasement ───────────────────────────────────────────────────────
    builder
      .addCase(addCasement.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(addCasement.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list.unshift(payload);   // plus récent en tête, comme avant
      })
      .addCase(addCasement.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });

    // ── updateCasement ────────────────────────────────────────────────────
    builder
      .addCase(updateCasement.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(updateCasement.fulfilled, (s, { payload }) => {
        s.loading = false;
        const idx = s.list.findIndex((c) => c.id === payload.id);
        if (idx !== -1) s.list[idx] = payload;
      })
      .addCase(updateCasement.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });

    // ── deleteCasement ────────────────────────────────────────────────────
    builder
      .addCase(deleteCasement.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(deleteCasement.fulfilled, (s, { payload: id }) => {
        s.loading = false;
        s.list    = s.list.filter((c) => c.id !== id);
      })
      .addCase(deleteCasement.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });

    // ── clearCasements ────────────────────────────────────────────────────
    builder
      .addCase(clearCasements.pending,   (s) => { s.loading = true;  })
      .addCase(clearCasements.fulfilled, (s) => { s.loading = false; s.list = []; })
      .addCase(clearCasements.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });
  },
});

export const { clearError } = casementSlice.actions;
export default casementSlice.reducer;

/* ═══════════════════════════════════════════════════════════════════════════
   SELECTORS
═══════════════════════════════════════════════════════════════════════════ */
export const selectCasements       = (s) => s.casement.list;
export const selectCasementLoading = (s) => s.casement.loading;
export const selectCasementError   = (s) => s.casement.error;
