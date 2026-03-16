<table>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($sectors as $sector)
            <tr>
                <td>{{ $sector->name }}</td>
                <td>{{ $sector->description }}</td>
                <td>
                    <form action="{{ route('sectors.destroy', $sector->id) }}" method="POST" onsubmit="return confirm('Voulez-vous vraiment supprimer ce secteur ?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Supprimer</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>