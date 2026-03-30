<?php

namespace App\Http\Controllers;

use App\Http\Requests\CasementRequest;
use App\Models\Casement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * CasementController — API REST complète pour la gestion des opérations de casement.
 *
 * Endpoints :
 *   GET    /api/casements             → index()    Liste + filtres
 *   POST   /api/casements             → store()    Créer
 *   GET    /api/casements/{id}        → show()     Détail
 *   PUT    /api/casements/{id}        → update()   Modifier
 *   DELETE /api/casements/{id}        → destroy()  Supprimer (soft delete)
 *   GET    /api/casements/stats       → stats()    KPIs globaux (Rapport)
 *   GET    /api/casements/stats/monthly → monthly() Rapport mensuel
 *   DELETE /api/casements             → destroyAll() Vider toutes les opérations
 */
class CasementController extends Controller
{
    // ══════════════════════════════════════════════════════════════════════════
    //  INDEX — Liste avec filtres et pagination
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements
     *
     * Query params supportés :
     *   ?panneau=P01
     *   ?conducteur=Ahmed
     *   ?etat_machine=marche|arret
     *   ?date_debut=2024-01-01&date_fin=2024-12-31
     *   ?search=Ahmed        (cherche dans panneau, tranchee, conducteur)
     *   ?per_page=50         (défaut: 100, max: 500)
     *   ?sort=date&dir=desc  (tri)
     *   ?no_pagination=1     (retourne TOUT sans pagination — pour Redux)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Casement::query();

        // ── Filtres ────────────────────────────────────────────────────────
        if ($request->filled('panneau')) {
            $query->where('panneau', $request->panneau);
        }

        if ($request->filled('conducteur')) {
            $query->where('conducteur', 'like', '%' . $request->conducteur . '%');
        }

        if ($request->filled('etat_machine')) {
            $query->where('etat_machine', $request->etat_machine);
        }

        if ($request->filled('date_debut') && $request->filled('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        } elseif ($request->filled('date_debut')) {
            $query->where('date', '>=', $request->date_debut);
        } elseif ($request->filled('date_fin')) {
            $query->where('date', '<=', $request->date_fin);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('panneau',    'like', $s)
                  ->orWhere('tranchee', 'like', $s)
                  ->orWhere('conducteur', 'like', $s)
                  ->orWhere('matricule',  'like', $s);
            });
        }

        // ── Tri ───────────────────────────────────────────────────────────
        $allowedSorts = ['date', 'created_at', 'volume_saute', 'panneau', 'conducteur'];
        $sort  = in_array($request->sort, $allowedSorts) ? $request->sort : 'created_at';
        $dir   = $request->dir === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $dir);

        // ── Retour sans pagination (pour charger tout dans Redux) ─────────
        if ($request->boolean('no_pagination')) {
            $data = $query->get();
            return response()->json([
                'data'  => $data,
                'total' => $data->count(),
            ]);
        }

        // ── Pagination ────────────────────────────────────────────────────
        $perPage = min((int) ($request->per_page ?? 100), 500);
        $result  = $query->paginate($perPage);

        return response()->json($result);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  STORE — Créer une nouvelle opération
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * POST /api/casements
     * Corps : JSON avec les champs du formulaire React
     */
    public function store(CasementRequest $request): JsonResponse
    {
        $casement = Casement::create($request->validated());

        return response()->json([
            'message' => 'Opération enregistrée avec succès.',
            'data'    => $casement,
        ], 201);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  SHOW — Détail d'une opération
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements/{id}
     */
    public function show(Casement $casement): JsonResponse
    {
        // Ajoute les accesseurs calculés dans la réponse
        $casement->append(['rendement', 'duree_arret']);

        return response()->json(['data' => $casement]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  UPDATE — Modifier une opération
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * PUT /api/casements/{id}
     */
    public function update(CasementRequest $request, Casement $casement): JsonResponse
    {
        $casement->update($request->validated());

        return response()->json([
            'message' => 'Opération mise à jour avec succès.',
            'data'    => $casement->fresh(),
        ]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  DESTROY — Supprimer (soft delete)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * DELETE /api/casements/{id}
     */
    public function destroy(Casement $casement): JsonResponse
    {
        $casement->delete();

        return response()->json([
            'message' => 'Opération supprimée avec succès.',
        ]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  DESTROY ALL — Vider toutes les opérations (équivalent clearCasements)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * DELETE /api/casements
     * Nécessite header: X-Confirm-Delete: true  (protection anti-accident)
     */
    public function destroyAll(Request $request): JsonResponse
    {
        if ($request->header('X-Confirm-Delete') !== 'true') {
            return response()->json([
                'message' => 'En-tête X-Confirm-Delete: true requis pour cette opération.',
            ], 422);
        }

        $count = Casement::count();
        Casement::query()->delete(); // Soft delete de tout

        return response()->json([
            'message' => "{$count} opération(s) supprimée(s).",
            'deleted' => $count,
        ]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  STATS — KPIs globaux (page Rapport)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements/stats
     *
     * Retourne exactement les mêmes calculs que RapportCasement.js :
     *   totalVolume, totalTemps, totalHTP, rendement, txDispo,
     *   moyOEE, moyTU, moyTD, nbMarche, nbArret, totalOps
     *
     * Query params optionnels :
     *   ?date_debut=2024-01-01&date_fin=2024-12-31
     */
    public function stats(Request $request): JsonResponse
    {
        $query = Casement::query();

        if ($request->filled('date_debut') && $request->filled('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        // Agrégats en une seule requête SQL
        $agg = $query->selectRaw("
            COUNT(*)                                    AS total_ops,
            COALESCE(SUM(volume_saute), 0)              AS total_volume,
            COALESCE(SUM(temps), 0)                     AS total_temps,
            COALESCE(SUM(htp), 0)                       AS total_htp,
            SUM(CASE WHEN etat_machine='marche' THEN 1 ELSE 0 END) AS nb_marche,
            SUM(CASE WHEN etat_machine='arret'  THEN 1 ELSE 0 END) AS nb_arret,
            AVG(CASE WHEN oee > 0 THEN oee END)         AS moy_oee,
            AVG(CASE WHEN tu  > 0 THEN tu  END)         AS moy_tu,
            AVG(CASE WHEN td  > 0 THEN td  END)         AS moy_td
        ")->first();

        $totalOps    = (int)   $agg->total_ops;
        $totalVolume = (float) $agg->total_volume;
        $totalTemps  = (float) $agg->total_temps;
        $totalHTP    = (float) $agg->total_htp;
        $nbMarche    = (int)   $agg->nb_marche;

        return response()->json([
            'data' => [
                'total_ops'    => $totalOps,
                'total_volume' => round($totalVolume, 2),
                'total_temps'  => round($totalTemps,  2),
                'total_htp'    => round($totalHTP,    2),
                'rendement'    => $totalTemps > 0 ? round($totalVolume / $totalTemps, 2) : 0,
                'tx_dispo'     => $totalOps   > 0 ? round(($nbMarche  / $totalOps) * 100, 1) : 0,
                'nb_marche'    => $nbMarche,
                'nb_arret'     => (int) $agg->nb_arret,
                'moy_oee'      => $agg->moy_oee !== null ? round((float) $agg->moy_oee, 1) : null,
                'moy_tu'       => $agg->moy_tu  !== null ? round((float) $agg->moy_tu,  1) : null,
                'moy_td'       => $agg->moy_td  !== null ? round((float) $agg->moy_td,  1) : null,
            ],
        ]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  MONTHLY — Rapport mensuel (page Rapport → tableau mensuel)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements/stats/monthly
     *
     * Retourne un tableau mensuel équivalent à monthlyStats dans RapportCasement.js.
     * Groupé par année-mois, trié chronologiquement.
     *
     * Query params optionnels :
     *   ?annee=2024   (filtre par année)
     */
    public function monthly(Request $request): JsonResponse
    {
        $query = Casement::query();

        if ($request->filled('annee')) {
            $query->whereYear('date', $request->annee);
        }

        $rows = $query
            ->selectRaw("
                DATE_FORMAT(date, '%Y-%m') AS mois_key,
                DATE_FORMAT(date, '%M %Y') AS mois_label,
                COUNT(*)                                       AS ops,
                COALESCE(SUM(volume_saute), 0)                 AS volume,
                COALESCE(SUM(htp), 0)                          AS htp,
                COALESCE(SUM(temps), 0)                        AS temps,
                AVG(CASE WHEN oee > 0 THEN oee END)            AS oee_moy,
                AVG(CASE WHEN tu  > 0 THEN tu  END)            AS tu_moy,
                AVG(CASE WHEN td  > 0 THEN td  END)            AS td_moy
            ")
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m'), DATE_FORMAT(date, '%M %Y')")
            ->orderByRaw("DATE_FORMAT(date, '%Y-%m') ASC")
            ->get();

        $data = $rows->map(function ($row) {
            $volume = (float) $row->volume;
            $temps  = (float) $row->temps;
            return [
                'mois'       => $row->mois_label,
                'mois_key'   => $row->mois_key,
                'ops'        => (int) $row->ops,
                'volume'     => round($volume, 2),
                'htp'        => round((float) $row->htp, 2),
                'temps'      => round($temps, 2),
                'rendement'  => $temps > 0 ? round($volume / $temps, 2) : 0,
                'oee_moy'    => $row->oee_moy !== null ? round((float) $row->oee_moy, 1) : null,
                'tu_moy'     => $row->tu_moy  !== null ? round((float) $row->tu_moy,  1) : null,
                'td_moy'     => $row->td_moy  !== null ? round((float) $row->td_moy,  1) : null,
            ];
        });

        return response()->json(['data' => $data]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  PANNEAUX — Liste des panneaux distincts (pour le filtre du formulaire)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements/panneaux
     */
    public function panneaux(): JsonResponse
    {
        $list = Casement::query()
            ->whereNotNull('panneau')
            ->distinct()
            ->orderBy('panneau')
            ->pluck('panneau');

        return response()->json(['data' => $list]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  CONDUCTEURS — Liste des conducteurs distincts
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/casements/conducteurs
     */
    public function conducteurs(): JsonResponse
    {
        $list = Casement::query()
            ->whereNotNull('conducteur')
            ->distinct()
            ->orderBy('conducteur')
            ->pluck('conducteur');

        return response()->json(['data' => $list]);
    }
}