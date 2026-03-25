import { createSlice } from "@reduxjs/toolkit";

/* ═══════════════════════════════════════════════════════════════════════════
   PANNEAU SLICE — Gestion des panneaux avec volume dynamique
   ✅ addPanneau        : Créer un nouveau panneau
   ✅ updatePanneau     : Mettre à jour volumeRestant + status
   ✅ deletePanneau     : Supprimer un panneau
   ✅ deduireVolume     : Déduire le volume après une opération casement
   ✅ restaurerVolume   : Restaurer le volume après suppression d'une opération
   ✅ changerStatus     : Changer manuellement le statut
═══════════════════════════════════════════════════════════════════════════ */

const PANNEAU_STATUTS = {
  EN_COURS:  "en_cours",
  COMPLETE:  "completé",
  SUSPENDU:  "suspendu",
};

/** Panneaux pré-chargés pour démarrage rapide */
const INITIAL_PANNEAUX = [
  {
    id:             "P-01",
    panneau:        "P-01",
    tranchee:       "T-01",
    volumeInitial:  500,
    volumeRestant:  500,
    dateCreation:   "2026-01-01",
    status:         PANNEAU_STATUTS.EN_COURS,
    description:    "",
  },
  {
    id:             "P-02",
    panneau:        "P-02",
    tranchee:       "T-01",
    volumeInitial:  800,
    volumeRestant:  800,
    dateCreation:   "2026-01-15",
    status:         PANNEAU_STATUTS.EN_COURS,
    description:    "",
  },
  {
    id:             "P-03",
    panneau:        "P-03",
    tranchee:       "T-02",
    volumeInitial:  350,
    volumeRestant:  350,
    dateCreation:   "2026-02-01",
    status:         PANNEAU_STATUTS.EN_COURS,
    description:    "",
  },
];

const panneauSlice = createSlice({
  name: "panneau",
  initialState: {
    list: INITIAL_PANNEAUX,
  },
  reducers: {

    /* ── Ajouter un nouveau panneau ── */
    addPanneau(state, action) {
      const {
        panneau, tranchee, volumeInitial, dateCreation, description = ""
      } = action.payload;

      // Générer un ID unique basé sur le nom du panneau (si fourni) ou timestamp
      const id = panneau?.trim() || `P-${Date.now()}`;

      // Éviter les doublons
      const existe = state.list.some(p => p.id === id || p.panneau === panneau?.trim());
      if (existe) return;

      state.list.push({
        id,
        panneau:       panneau?.trim() || id,
        tranchee:      tranchee?.trim() || "",
        volumeInitial: Number(volumeInitial) || 0,
        volumeRestant: Number(volumeInitial) || 0,
        dateCreation:  dateCreation || new Date().toISOString().slice(0, 10),
        status:        PANNEAU_STATUTS.EN_COURS,
        description,
      });
    },

    /* ── Mettre à jour un panneau (volume + status) ── */
    updatePanneau(state, action) {
      const { id, panneau, tranchee, volumeInitial, volumeRestant, status, description } = action.payload;
      const p = state.list.find(x => x.id === id || x.panneau === panneau);
      if (!p) return;

      if (panneau      !== undefined) p.panneau       = panneau;
      if (tranchee     !== undefined) p.tranchee      = tranchee;
      if (volumeInitial !== undefined) p.volumeInitial = Number(volumeInitial);
      if (volumeRestant !== undefined) {
        p.volumeRestant = Math.max(0, Number(volumeRestant));
        // Auto-marquer comme complété si volume = 0
        if (p.volumeRestant === 0 && status === undefined) {
          p.status = PANNEAU_STATUTS.COMPLETE;
        }
      }
      if (status !== undefined)      p.status        = status;
      if (description !== undefined) p.description   = description;
    },

    /* ── Déduire le volume après une opération casement ── */
    deduireVolume(state, action) {
      const { panneauId, panneauNom, volumeDecape } = action.payload;
      const p = state.list.find(
        x => x.id === panneauId || x.panneau === panneauNom
      );
      if (!p) return;

      const vol = Number(volumeDecape) || 0;
      p.volumeRestant = Math.max(0, p.volumeRestant - vol);

      // Passage automatique à "completé" si volume épuisé
      if (p.volumeRestant === 0) {
        p.status = PANNEAU_STATUTS.COMPLETE;
      } else if (p.status === PANNEAU_STATUTS.COMPLETE) {
        // Réactiver si du volume revient (suite à une restauration)
        p.status = PANNEAU_STATUTS.EN_COURS;
      }
    },

    /* ── Restaurer le volume après suppression d'une opération ── */
    restaurerVolume(state, action) {
      const { panneauId, panneauNom, volumeRestaure } = action.payload;
      const p = state.list.find(
        x => x.id === panneauId || x.panneau === panneauNom
      );
      if (!p) return;

      const vol = Number(volumeRestaure) || 0;
      // Ne pas dépasser le volume initial
      p.volumeRestant = Math.min(p.volumeInitial, p.volumeRestant + vol);

      // Si le panneau était complété mais qu'on restaure du volume → repasser en_cours
      if (p.status === PANNEAU_STATUTS.COMPLETE && p.volumeRestant > 0) {
        p.status = PANNEAU_STATUTS.EN_COURS;
      }
    },

    /* ── Changer manuellement le statut ── */
    changerStatus(state, action) {
      const { id, panneau, status } = action.payload;
      const p = state.list.find(x => x.id === id || x.panneau === panneau);
      if (p && Object.values(PANNEAU_STATUTS).includes(status)) {
        p.status = status;
      }
    },

    /* ── Supprimer un panneau ── */
    deletePanneau(state, action) {
      const { id, panneau } = action.payload;
      state.list = state.list.filter(
        p => p.id !== id && p.panneau !== panneau
      );
    },
  },
});

export const {
  addPanneau,
  updatePanneau,
  deduireVolume,
  restaurerVolume,
  changerStatus,
  deletePanneau,
} = panneauSlice.actions;

export { PANNEAU_STATUTS };
export default panneauSlice.reducer;