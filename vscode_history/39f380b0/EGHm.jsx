import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Formateurs() {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const initialForm = { matricule: '', nom: '', prenom: '', type_contrat: 'FP', mh_statutaire: 26, nbr_semaines: 35, metier: '' };
    const [formData, setFormData] = useState(initialForm);

    const fetchFormateurs = async () => {
        try {
            const res = await fetch('/api/formateurs').then(r => r.json());
            setFormateurs(res);
            setLoading(false);
        } catch (e) { console.error("Erreur Fetch:", e); }
    };

    useEffect(() => { fetchFormateurs(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editMode ? `/api/formateurs/${formData.id_formateur}` : '/api/formateurs';
        const method = editMode ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast.success(editMode ? 'Modifié avec succès !' : 'Ajouté مع succès !');
            setShowModal(false);
            fetchFormateurs(); // إعادة تحميل القائمة من الداتابيز
        } else {
            toast.error("Erreur lors de l'enregistrement");
            const err = await res.json();
            console.log(err);
        }
    };

    const deleteFormateur = async (id) => {
        if (window.confirm("🚨 Supprimer ce formateur ?")) {
            const res = await fetch(`/api/formateurs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.error("Supprimé !");
                fetchFormateurs();
            }
        }
    };

    const openEditModal = (f) => {
        setFormData(f);
        setEditMode(true);
        setShowModal(true);
    };

    const filtered = formateurs.filter(f => 
        f.nom?.toLowerCase().includes(search.toLowerCase()) || 
        f.matricule?.toString().includes(search)
    );

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">CHARGEMENT...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen text-black">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-[#006064] italic">Liste des formateurs</h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{filtered.length} PERSONNES DANS LA BASE</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Rechercher MLE/Nom..." className="p-2 border-2 border-slate-100 rounded-xl outline-none focus:border-[#006064] font-bold text-xs" onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="bg-[#006064] text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-lg shadow-teal-100 hover:-translate-y-1 transition-all">
                            + Ajouter
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white">
                            <tr className="text-[10px] font-black uppercase tracking-widest">
                                <th className="p-4">MLE</th>
                                <th className="p-4">Identité</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-center">MHStat</th>
                                <th className="p-4 text-center">Métier</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((f, i) => (
                                <tr key={i} className="hover:bg-teal-50/30 transition-colors font-bold text-xs">
                                    <td className="p-4 text-slate-400">{f.matricule}</td>
                                    <td className="p-4 uppercase">{f.nom} {f.prenom}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${f.type_contrat === 'FP' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {f.type_contrat}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">{f.mh_statutaire}h</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-[9px] uppercase">{f.metier || 'N/A'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => openEditModal(f)} className="hover:scale-125 transition-transform text-teal-600">✏️</button>
                                            <button onClick={() => deleteFormateur(f.id_formateur)} className="hover:scale-125 transition-transform text-red-600">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL SMART */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[2000] p-6">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 border border-white">
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-6 border-b pb-4">{editMode ? 'Modifier' : 'Nouveau'} Formateur</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Matricule (MLE)</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Spécialité</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" value={formData.metier} onChange={e => setFormData({...formData, metier: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nom</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Prénom</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Type de contrat</label>
                                <select className="w-full p-3 border-2 border-slate-100 rounded-2xl font-bold" value={formData.type_contrat} onChange={e => setFormData({...formData, type_contrat: e.target.value})}>
                                    <option value="FP">FP (Permanent)</option>
                                    <option value="FV">FV (Vacataire)</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Masse Horaire Stat.</label>
                                <input type="number" className="w-full p-3 border-2 border-slate-100 rounded-2xl" value={formData.mh_statutaire} onChange={e => setFormData({...formData, mh_statutaire: e.target.value})} />
                            </div>
                            <button type="submit" className="col-span-2 bg-[#006064] text-white p-4 rounded-2xl font-black uppercase shadow-xl hover:bg-[#004d40] transition-all mt-4">
                                {editMode ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className="col-span-2 text-slate-400 font-bold uppercase text-[9px] mt-2 tracking-widest text-center">Annuler l'opération</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}