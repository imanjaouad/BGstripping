<!-- فورمير التسجيل -->
<form action="{{ route('poussage.store') }}" method="POST">
    @csrf
    <div class="grid grid-cols-2 gap-4">
        <input type="date" name="date_operation" class="border p-2 rounded" required>
        
        <!-- اختيار الورش -->
        <select name="chantier_id" class="border p-2 rounded">
            @foreach($chantiers as $c)
                <option value="{{ $c->id }}">{{ $c->nom_chantier }}</option>
            @endforeach
        </select>

        <!-- اختيار الماكينة -->
        <select name="engin_id" class="border p-2 rounded">
            @foreach($engins as $e)
                <option value="{{ $e->id }}">{{ $e->code_parc }} ({{ $e->type_engin }})</option>
            @endforeach
        </select>

        <!-- اختيار السائق -->
        <select name="personnel_id" class="border p-2 rounded">
            @foreach($personnels as $p)
                <option value="{{ $p->id }}">{{ $p->nom_prenom }}</option>
            @endforeach
        </select>

        <input type="number" name="compteur_debut" placeholder="Compteur Début" class="border p-2 rounded">
        <input type="number" name="compteur_fin" placeholder="Compteur Fin" class="border p-2 rounded">
        <input type="number" name="volume_decapé" placeholder="Volume m³" class="border p-2 rounded">
    </div>
    <button type="submit" class="bg-green-600 text-white p-3 mt-4 rounded w-full">Enregistrer</button>
</form>

<!-- جدول التاريخ (Historique) -->
<table class="w-full mt-10 border text-left">
    <thead>
        <tr class="bg-gray-100">
            <th>Date</th> <th>Conducteur</th> <th>Machine</th> <th>Volume</th>
        </tr>
    </thead>
    <tbody>
        @foreach($rapports as $r)
        <tr>
            <td>{{ $r->date_operation }}</td>
            <td>{{ $r->personnel->nom_prenom }}</td>
            <td>{{ $r->engin->code_parc }}</td>
            <td>{{ $r->volume_decapé }} m³</td>
        </tr>
        @endforeach
    </tbody>
</table>