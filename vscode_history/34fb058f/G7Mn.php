<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mode Poussage - BG STRIPPING</title>
    <!-- Tailwind CSS & FontAwesome Icons -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-[#F3F6F9] font-sans flex overflow-hidden">

    <!-- 1. Sidebar (الجهة اليسرى) -->
    <div class="w-64 h-screen bg-white shadow-sm flex flex-col p-6 z-10">
        <div class="mb-10 flex flex-col items-center">
             <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <i class="fas fa-tractor text-green-600 text-3xl"></i>
             </div>
             <h2 class="font-bold text-gray-800 tracking-wider">BG STRIPPING</h2>
        </div>
        <nav class="flex-1 space-y-2">
            <a href="#" class="flex items-center p-3 text-gray-400 hover:text-green-600 transition">
                <i class="fas fa-columns w-8"></i> Dashboard
            </a>
            <a href="#" class="flex items-center p-3 bg-green-50 text-green-600 rounded-lg font-semibold">
                <i class="fas fa-layer-group w-8"></i> Mode Poussage
            </a>
            <a href="#" class="flex items-center p-3 text-gray-400 hover:text-green-600 transition">
                <i class="fas fa-chart-pie w-8"></i> Statistiques
            </a>
            <a href="#" class="flex items-center p-3 text-gray-400 hover:text-green-600 transition">
                <i class="fas fa-file-contract w-8"></i> Rapports
            </a>
        </nav>
    </div>

    <!-- 2. Main Content (الوسط) -->
    <div class="flex-1 h-screen overflow-y-auto p-8">
        
        <!-- Top Header -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-xl font-bold text-gray-800">Opération de Décapage : <span class="text-green-500 font-medium">Mode Poussage</span></h1>
            <div class="flex items-center bg-white p-2 rounded-full shadow-sm">
                <span class="px-4 text-sm font-medium text-gray-600">Bienvenue, Opérateur</span>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <i class="fas fa-user-check"></i>
                </div>
            </div>
        </div>

        <form action="{{ route('poussage.store') }}" method="POST">
            @csrf
            <div class="grid grid-cols-3 gap-8">
                
                <!-- Section Formulaire -->
                <div class="col-span-2 space-y-6">
                    
                    <!-- Chantier & Localisation -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-sm font-bold text-gray-700 mb-6 flex items-center">
                            <i class="fas fa-map-marker-alt mr-2 text-green-500"></i> Chantier & Localisation
                        </h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Date</label>
                                <input type="date" name="date_operation" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Chantier (Zone)</label>
                                <select name="chantier_id" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                                    @foreach($chantiers as $c)
                                        <option value="{{ $c->id }}">{{ $c->nom_chantier }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Personnel & Machine -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-sm font-bold text-gray-700 mb-6 flex items-center">
                            <i class="fas fa-user-cog mr-2 text-green-500"></i> Personnel & Machine
                        </h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Conducteur</label>
                                <select name="personnel_id" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                                    @foreach($personnels as $p)
                                        <option value="{{ $p->id }}">{{ $p->nom_prenom }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Machine (Engin)</label>
                                <select name="engin_id" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                                    @foreach($engins as $e)
                                        <option value="{{ $e->id }}">{{ $e->code_parc }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Temps & Production -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-sm font-bold text-gray-700 mb-6 flex items-center">
                            <i class="fas fa-clock mr-2 text-green-500"></i> Temps & Production
                        </h3>
                        <div class="grid grid-cols-3 gap-6">
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Compteur Début</label>
                                <input type="number" name="compteur_debut" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Compteur Fin</label>
                                <input type="number" name="compteur_fin" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-gray-400 uppercase">Volume (m³)</label>
                                <input type="number" name="volume_decapé" class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <button type="submit" class="bg-[#1BC5BD] hover:bg-[#18b1aa] text-white px-12 py-3 rounded-xl font-bold shadow-lg transition">
                            Enregistrez
                        </button>
                    </div>
                </div>

                <!-- 3. Calculs Automatiques (الجهة اليمنى) -->
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-green-200">
                        <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 flex items-center">
                            <i class="fas fa-calculator mr-2 text-green-500"></i> Calculs Automatiques
                        </h3>
                        <div class="space-y-4">
                            <div class="bg-gray-50 p-4 rounded-xl text-center">
                                <p class="text-[10px] text-gray-400 uppercase font-bold">Durée Totale</p>
                                <p class="text-xl font-bold text-green-600">0.00 h</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-xl text-center">
                                <p class="text-[10px] text-gray-400 uppercase font-bold">Volume Estimé</p>
                                <p class="text-xl font-bold text-green-600">0 m³</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <!-- Historique (الجدول التحتاني) -->
        <div class="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider">Historique des rapports (Poussage)</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-[11px] text-gray-400 uppercase border-b border-gray-100">
                            <th class="pb-4 font-semibold">Date</th>
                            <th class="pb-4 font-semibold">Conducteur</th>
                            <th class="pb-4 font-semibold">Machine</th>
                            <th class="pb-4 font-semibold">Volume</th>
                            <th class="pb-4 font-semibold">Statut</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-gray-600">
                        @foreach($rapports as $r)
                        <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td class="py-4">{{ $r->date_operation }}</td>
                            <td class="py-4 font-medium text-gray-800">{{ $r->personnel->nom_prenom }}</td>
                            <td class="py-4">{{ $r->engin->code_parc }}</td>
                            <td class="py-4 font-bold text-blue-500">{{ number_format($r->volume_decapé) }} m³</td>
                            <td class="py-4">
                                <span class="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Enregistré</span>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>