public function storeGroupe(Request $request) {
    try {
        $g = new \App\Models\Groupe();
        $g->code_groupe = $request->code_groupe;
        $g->id_filiere = 1; // قيمة افتراضية
        $g->annee_formation = (int)$request->annee_formation;
        $g->nbr_semaines = (int)$request->nbr_semaines;
        $g->mh_hebdo = $request->mh_hebdo;
        $g->mh_annuelle = (int)$request->mh_annuelle;
        $g->statut = 'actif';
        $g->id_proprietaire = 1;
        $g->save();
        return response()->json($g);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}