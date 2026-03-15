import React, { useEffect, useState } from 'react';

export default function Salles() {
    const [salles, setSalles] = useState([]);
    const [nom, setNom] = useState('');
    const [type, setType] = useState('Salle'); // Par défaut
    const [capacite, setCapacite] = useState(30);

    // Chargement
    const fetchSalles = () => {
        fetch('/api/salles')
            .then(res => res.json())
            .then(data => setSalles(data));
    };

    useEffect(() => { fetchSalles(); }, []);

    // Ajouter Salle
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/salles', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nom_local: nom, type_local: type, capacite: capacite })
        });
        setNom(''); // Vider input
        fetchSalles(); // Actualiser liste
    };

    // Supprimer
    const handleDelete = async (id) => {
        if(confirm('Supprimer cette salle ?')) {
            await fetch(`/api/salles/${id}`, { method: 'DELETE' });
            fetchSalles();
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[#006064] flex items-center gap-2">
                🏫 Gestion des Salles (Locaux)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* --- FORMULAIRE AJOUT (A Gauche) --- */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">Ajouter un Local</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600">Nom du Local</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Ex: Salle 5, Atelier 1..." required 
                                value={nom} onChange={e => setNom(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600">Type</label>
                            <select className="w-full p-2 border rounded" value={type} onChange={e => setType(e.target.value)}>
                                <option value="Salle">Salle de Cours</option>
                                <option value="Atelier">Atelier</option>
                                <option value="Amphi">Amphithéâtre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600">Capacité</label>
                            <input type="number" className="w-full p-2 border rounded" value={capacite} onChange={e => setCapacite(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full bg-[#00acc1] text-white py-2 rounded font-bold hover:bg-[#0097a7] transition">
                            + Ajouter
                        </button>
                    </form>
                </div>

                {/* --- LISTE DES SALLES (A Droite) --- */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-center">Capacité</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salles.map((s, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-bold text-gray-800">{s.nom_local}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.type_local === 'Atelier' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {s.type_local}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center text-gray-500">{s.capacite} places</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleDelete(s.id_salle)} className="text-red-500 hover:text-red-700 font-bold">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {salles.length === 0 && <p className="p-4 text-center text-gray-500">Aucune salle trouvée.</p>}
                </div>

            </div>
        </div>
    );
}