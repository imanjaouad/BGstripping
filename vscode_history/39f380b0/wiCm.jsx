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
        const res = await fetch('/api/formateurs').then(r => r.json());
        setFormateurs(res);
        setLoading(false);
    };

    useEffect(() => { fetchFormateurs(); }, []);

    // --- دالة الحفظ (إضافة أو تعديل) ---
    const handleSave = async (e) => {
        e.preventDefault();
        const url = editMode ? `/api/formateurs/${formData.id_formateur}` : '/api/formateurs';
        const method = editMode ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast.success(editMode ? 'Informations mises à jour !' : 'Nouveau formateur ajouté !');
            setShowModal(false);
            setFormData(initialForm);
            fetchFormateurs();
        } else {
            toast.error("Une erreur est survenue.");
        }
    };

    // --- دالة الحذف ---
    const deleteFormateur = async (id) => {
        if (window.confirm("🚨 Êtes-vous sûr de vouloir supprimer ce formateur ?")) {
            const res = await fetch(`/api/formateurs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.error("Formateur supprimé de la base.");
                fetchFormateurs();
            }
        }
    };

    // --- تعبئة النموذج عند الضغط على تعديل ---
    const openEditModal = (f) => {
        setFormData(f);
        setEditMode(true);
        setShowModal(true);
    };

    const filtered = formateurs.filter(f => 
        f.nom.toLowerCase().includes(search.toLowerCase()) || 
        f.matricule.toString().includes(search)
    );

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-widest">Chargement de la liste...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Annuaire du Personnel</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{filtered.length} Formateurs actifs</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Rechercher..." className="p-2 border-2 border-slate-100 rounded-xl outline-none focus:border-[#006064] text-sm" onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="bg-[#006064] text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-lg">
                            + Ajouter
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-4">MLE</th>
                                <th className="p-4">Identité</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">MHStat</th>
                                <th className="p-4 text-center">Métier</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((f, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-black text-slate-600 text-xs">{f.matricule}</td>
                                    <td className="p-4">
                                        <div className="font-black text-slate-800 uppercase text-xs">{f.nom}</div>
                                        <div className="text-[10px] font-bold text-slate-400 capitalize">{f.prenom}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${f.type_contrat === 'FP' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {f.type_contrat}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-black text-xs">{f.mh_statutaire}h</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">{f.metier || 'N/A'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openEditModal(f)} className="p-2 hover:bg-teal-50 text-teal-600 rounded-lg">✏️</button>
                                            <button onClick={() => deleteFormateur(f.id_formateur)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black font-bold">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10">
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-6">{editMode ? 'Modifier' : 'Nouveau'} Formateur</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">MLE</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Métier</label>
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
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Type</label>
                                <select className="w-full p-3 border-2 border-slate-100 rounded-2xl" value={formData.type_contrat} onChange={e => setFormData({...formData, type_contrat: e.target.value})}>
                                    <option value="FP">FP (Permanent)</option>
                                    <option value="FV">FV (Vacataire)</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">MHStat</label>
                                <input type="number" className="w-full p-3 border-2 border-slate-100 rounded-2xl" value={formData.mh_statutaire} onChange={e => setFormData({...formData, mh_statutaire: e.target.value})} />
                            </div>
                            <button type="submit" className="col-span-2 bg-[#006064] text-white p-4 rounded-2xl font-black uppercase shadow-xl mt-4">Enregistrer</button>
                            <button type="button" onClick={() => setShowModal(false)} className="col-span-2 text-slate-400 font-bold uppercase text-[10px] mt-2">Annuler</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}