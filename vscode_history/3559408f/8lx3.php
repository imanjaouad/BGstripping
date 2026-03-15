<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RapportProduction;
use App\Models\Engin;
use App\Models\Arret;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. KPIs (Cumul Mensuel)
        $productionMois = RapportProduction::whereDate('date_operation', '>=', $startOfMonth)->sum('volume_saute') ?? 0;
        $productionJour = RapportProduction::whereDate('date_operation', $today)->sum('volume_saute') ?? 0;
        
        $totalMachines = Engin::count();

        // total volume sauté normalisé par HM du mois
        $productionMois = $rapportsMois->sum(function($rapport){
            $hm = $rapport->hm_total > 0 ? $rapport->hm_total : 1;
            return $rapport->volume_saute / $hm; // volume par HM
        });


        // Flotte Active = Nombre de machines dont le DERNIER rapport est "marche"
        $machinesActiveCount = Engin::whereHas('rapports', function($query) {
            $query->where('id', function($subquery) {
                $subquery->select('id')
                    ->from('rapport_productions')
                    ->whereColumn('engin_id', 'engins.id')
                    ->latest()
                    ->limit(1);
            })->where('statut_machine', 'marche');
        })->count();

        // HM totales du mois
        $hmMois = RapportProduction::whereDate('date_operation', '>=', $startOfMonth)
            ->get()
            ->sum('hm_total');

        // Heures d'arrêt du mois
        $arretsMois = DB::table('arrets')
            ->join('rapport_productions', 'arrets.rapport_id', '=', 'rapport_productions.id')
            ->whereDate('rapport_productions.date_operation', '>=', $startOfMonth)
            ->selectRaw('SUM(TIME_TO_SEC(TIMEDIFF(heure_fin, heure_debut)) / 3600) as total_h')
            ->value('total_h') ?? 0;

        // 2. Activité Récente (8 derniers rapports)
        $recentActivity = RapportProduction::with(['engin', 'chantier'])
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        // 3. Statut des Machines
        $machines = Engin::with(['rapports' => function($query) {
            $query->latest();
        }])->get();

        $machinesStatus = $machines->map(function($m) {
            $lastRapport = $m->rapports->first();
                
            return [
                'name' => $m->code_parc,
                'code' => $m->code_parc,
                'statut' => $lastRapport?->statut_machine ?? 'inconnu',
                'conducteur' => $lastRapport?->nom_conducteur ?? 'Non assigné',
                'last_hm' => $lastRapport?->compteur_fin ?? 0,
                'last_date' => $lastRapport ? $lastRapport->date_operation->format('d/m/Y') : '-'
            ];
        });

        return view('dashboard', compact(
            'productionMois',
            'productionJour', 
            'machinesActiveCount', 
            'totalMachines', 
            'hmMois', 
            'arretsMois', 
            'recentActivity', 
            'machinesStatus'
        ));
    }
}
