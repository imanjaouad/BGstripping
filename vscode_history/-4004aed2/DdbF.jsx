    // 19. حساب تقدم المواد (Avancement)
    public function getAvancement() {
        // هاد الكود كيدير عمليات حسابية معقدة وسط الداتابيز
        $avancement = Affectation::with(['groupe', 'module'])
            ->get()
            ->map(function($aff) {
                // مجموع السوايع اللي تبرمجو في الجدول (Seances) لهاد المادة
                $heuresSaisies = Seance::where('id_affectation', $aff.id_affectation)->count(); 
                
                // المجموع الكلي اللي خاص يتقرا (Présentiel + FAD)
                $totalPrevu = $aff->mh_pres + $aff->mh_fad;

                return [
                    'groupe' => $aff->groupe->code_groupe,
                    'module' => $aff->module->intitule_module,
                    'prevu' => $totalPrevu,
                    'realise' => $heuresSaisies, // كل حصة كتحسب بساعة للتبسيط
                    'pourcentage' => $totalPrevu > 0 ? round(($heuresSaisies / $totalPrevu) * 100) : 0
                ];
            });

        return response()->json($avancement);
    }