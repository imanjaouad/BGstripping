import React, { useEffect, useState } from 'react';

export default function AffectationTable() {
    // --- STATES ---
    const [affectations, setAffectations] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [modules, setModules] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    // Hada bach n3rfou wach kan-ajoutiw wla kan-modifiw
    const [editId, setEditId] = useState(null); 

    const [newData, setNewData] = useState({
        id_groupe: '', id_module: '', id_formateur: '', mh_pres: 0, mh_fad: 0
    });

    // --- CHARGEMENT DATA ---
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
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- OUVRIR MODAL POUR AJOUTER ---
    const openAddModal = () => {
        setEditId(null); // Mode Ajout
        setNewData({id_groupe: '', id_module: '', id_formateur: '', mh_pres: 0, mh_fad: 0});
        setShowModal(true);
    };

    // --- OUVRIR MODAL POUR MODIFIER ---
    const openEditModal = (item) => {
        setEditId(item.id_affectation); // Mode Edit
        setNewData({
            id_groupe: item.id_groupe,
            id_module: item.id_module,
            id_formateur: item.id_formateur,
            mh_pres: item.mh_pres,
            mh_fad: item.mh_fad
        });
        setShowModal(true);
    };

    // --- SAVE (AJOUT OU EDIT) ---
    const handleSave = async (e) => {
        e.preventDefault();
        const url = editId ? `/api/affectations/${editId}` : '/api/affectations';
        const method = editId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newData)
        });

        setShowModal(false);
        fetchData();
        alert(editId ? "Modifié avec succès!" : "Ajouté avec succès!");
    };

    // --- SUPPRIMER ---
    const handleDelete = async (id) => {
        if(window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) {
            await fetch(`/api/affectations/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    // --- FILTRE ---
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
        <div className="font-sans text-sm p-6 max-w-6xl mx-auto">
            
            {/* Header + Search + Button */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">
                <input 
                    type="text" 
                    placeholder="🔍 Rechercher..." 
                    className="w-full md:w-1/3 p-3 border rounded shadow-sm outline-none focus:ring-2 focus:ring-teal-500"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button 
                    onClick={openAddModal}
                    className="bg-[#006064] hover:bg-[#004d40] text-white px-6 py-3 rounded shadow font-bold transition flex items-center gap-2">
                    <span>+</span> Ajouter Affectation
                </button>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-[#004d40] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3 text-left">Groupe</th>
                            <th className="p-3 text-left">Module</th>
                            <th className="p-3 text-center">Heures (P/F)</th>
                            <th className="p-3 text-left">Formateur</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {resultatFiltre.map((row, index) => (
                            <tr key={index} className="hover:bg-teal-50 transition">
                                <td className="p-3 font-bold text-gray-700">{row.groupe?.code_groupe}</td>
                                <td className="p-3 text-blue-600 font-bold">{row.module?.code_module}</td>
                                <td className="p-3 text-center">
                                    <span className="bg-green-100 px-2 py-1 rounded text-green-800 text-xs font-bold mr-1">{row.mh_pres}h</span>
                                    <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-xs font-bold">{row.mh_fad}h</span>
                                </td>
                                <td className="p-3">{row.formateur ? row.formateur.nom : 'Non Affecté'}</td>
                                <td className="p-3 text-center flex justify-center gap-2">
                                    <button 
                                        onClick={() => openEditModal(row)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs transition">
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(row.id_affectation)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition">
                                        🗑️ Suppr
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL (POUR AJOUT ET MODIF) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md animate-bounce-in">
                        <h2 className="text-xl font-bold mb-4 text-[#006064]">
                            {editId ? 'Modifier Affectation' : 'Nouvelle Affectation'}
                        </h2>
                        
                        <form onSubmit={handleSave} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Groupe</label>
                                <select className="w-full p-2 border rounded bg-gray-50" required
                                    value={newData.id_groupe}
                                    onChange={e => setNewData({...newData, id_groupe: e.target.value})}>
                                    <option value="">-- Choisir --</option>
                                    {groupes.map(g => <option key={g.id_groupe} value={g.id_groupe}>{g.code_groupe}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Module</label>
                                <select className="w-full p-2 border rounded bg-gray-50" required
                                    value={newData.id_module}
                                    onChange={e => setNewData({...newData, id_module: e.target.value})}>
                                    <option value="">-- Choisir --</option>
                                    {modules.map(m => <option key={m.id_module} value={m.id_module}>{m.code_module}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Formateur</label>
                                <select className="w-full p-2 border rounded bg-gray-50" required
                                    value={newData.id_formateur}
                                    onChange={e => setNewData({...newData, id_formateur: e.target.value})}>
                                    <option value="">-- Choisir --</option>
                                    {formateurs.map(f => <option key={f.id_formateur} value={f.id_formateur}>{f.nom} {f.prenom}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block font-bold text-xs uppercase">Présentiel</label>
                                    <input type="number" className="w-full p-2 border rounded" required 
                                        value={newData.mh_pres}
                                        onChange={e => setNewData({...newData, mh_pres: e.target.value})}/>
                                </div>
                                <div className="flex-1">
                                    <label className="block font-bold text-xs uppercase">FAD</label>
                                    <input type="number" className="w-full p-2 border rounded" required 
                                        value={newData.mh_fad}
                                        onChange={e => setNewData({...newData, mh_fad: e.target.value})}/>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-[#006064] text-white rounded hover:bg-[#004d40] shadow">
                                    {editId ? 'Modifier' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}