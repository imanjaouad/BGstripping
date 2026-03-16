import React, { useEffect, useState } from 'react';

export default function AffectationTable() {
    // --- STATES (Dakira d l'application) ---
    const [affectations, setAffectations] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [modules, setModules] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [showModal, setShowModal] = useState(false); // Bach n7ello/nseddo Popup

    // Data dyal Formulaire jdid
    const [newData, setNewData] = useState({
        id_groupe: '', id_module: '', id_formateur: '', mh_pres: 0, mh_fad: 0
    });

    // --- CHARGEMENT DES DONNEES (Mn Laravel) ---
    const fetchData = async () => {
        try {
            const [affRes, grpRes, modRes, profRes] = await Promise.all([
                fetch('/api/affectations'),
                fetch('/api/groupes'),
                fetch('/api/modules'),
                fetch('/api/formateurs')
            ]);

            setAffectations(await affRes.json());
            setGroupes(await grpRes.json());
            setModules(await modRes.json());
            setFormateurs(await profRes.json());
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- FONCTION AJOUTER (Save) ---
    const handleAjouter = async (e) => {
        e.preventDefault(); // Bach mat-actualisach page
        
        await fetch('/api/affectations', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newData)
        });

        setShowModal(false); // Sed Popup
        fetchData(); // 3awed jib data bach tban jdida
        setNewData({id_groupe: '', id_module: '', id_formateur: '', mh_pres: 0, mh_fad: 0}); // Khwi form
        alert("Bien ajouté !");
    };

    // --- FILTRE & STATS ---
    const resultatFiltre = affectations.filter(item => {
        const txt = recherche.toLowerCase();
        return (
            item.module?.intitule_module.toLowerCase().includes(txt) ||
            item.formateur?.nom.toLowerCase().includes(txt) ||
            item.groupe?.code_groupe.toLowerCase().includes(txt)
        );
    });

    if (loading) return <div className="p-10 text-center animate-pulse">Chargement...</div>;

    return (
        <div className="font-sans text-sm p-6 max-w-6xl mx-auto relative">
            
            {/* --- BARRE RECHERCHE + BOUTON AJOUTER --- */}
            <div className="flex gap-4 mb-4">
                <input 
                    type="text" 
                    placeholder="🔍 Rechercher..." 
                    className="flex-1 p-3 border rounded shadow-sm outline-none focus:ring-2 focus:ring-teal-500"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow font-bold transition">
                    + Ajouter
                </button>
            </div>

            {/* --- TABLEAU --- */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-[#004d40] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3 text-left">Groupe</th>
                            <th className="p-3 text-left">Module</th>
                            <th className="p-3 text-center">MH Pres</th>
                            <th className="p-3 text-center">MH FAD</th>
                            <th className="p-3 text-left">Formateur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {resultatFiltre.map((row, index) => (
                            <tr key={index} className="hover:bg-teal-50">
                                <td className="p-3 font-bold text-gray-700">{row.groupe?.code_groupe}</td>
                                <td className="p-3 text-blue-600 font-bold">{row.module?.code_module}</td>
                                <td className="p-3 text-center">{row.mh_pres}</td>
                                <td className="p-3 text-center">{row.mh_fad}</td>
                                <td className="p-3">{row.formateur ? row.formateur.nom : 'Non Affecté'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- POPUP (MODAL) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md animate-bounce-in">
                        <h2 className="text-xl font-bold mb-4 text-[#006064]">Nouvelle Affectation</h2>
                        
                        <form onSubmit={handleAjouter} className="space-y-3">
                            {/* Select Groupe */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-1">Groupe</label>
                                <select className="w-full p-2 border rounded" required
                                    onChange={e => setNewData({...newData, id_groupe: e.target.value})}>
                                    <option value="">Choisir un groupe...</option>
                                    {groupes.map(g => <option key={g.id_groupe} value={g.id_groupe}>{g.code_groupe}</option>)}
                                </select>
                            </div>

                            {/* Select Module */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-1">Module</label>
                                <select className="w-full p-2 border rounded" required
                                    onChange={e => setNewData({...newData, id_module: e.target.value})}>
                                    <option value="">Choisir un module...</option>
                                    {modules.map(m => <option key={m.id_module} value={m.id_module}>{m.code_module} - {m.intitule_module}</option>)}
                                </select>
                            </div>

                            {/* Select Prof */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-1">Formateur</label>
                                <select className="w-full p-2 border rounded" required
                                    onChange={e => setNewData({...newData, id_formateur: e.target.value})}>
                                    <option value="">Choisir un formateur...</option>
                                    {formateurs.map(f => <option key={f.id_formateur} value={f.id_formateur}>{f.nom} {f.prenom}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block font-bold">Présentiel</label>
                                    <input type="number" className="w-full p-2 border rounded" required 
                                        onChange={e => setNewData({...newData, mh_pres: e.target.value})}/>
                                </div>
                                <div className="flex-1">
                                    <label className="block font-bold">FAD</label>
                                    <input type="number" className="w-full p-2 border rounded" required 
                                        onChange={e => setNewData({...newData, mh_fad: e.target.value})}/>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-[#006064] text-white rounded hover:bg-[#004d40]">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}