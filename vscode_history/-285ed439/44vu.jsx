import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const initialForm = {
        id_groupe: null, code_groupe: '', id_filiere: 1, annee_formation: 1,
        nbr_semaines: 35, mh_hebdo: '28:00', mh_annuelle: 1000,
        statut: 'actif', fusion_status: 'non', type_formation: 'R'
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchGroupes = async () => {
        const res = await fetch('/api/groupes').then(r => r.json());
        setGroupes(res);
        setLoading(false);
    };

    useEffect(() => { fetchGroupes(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/groupes/${formData.id_groupe}` : '/api/groupes';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast.success(editMode ? 'Groupe synchronisé ✅' : 'Groupe ajouté à la base ✅');
            setShowModal(false);
            fetchGroupes(); // تحديث القائمة
        } else {
            toast.error("Erreur de sauvegarde SQL");
        }
    };

    const deleteGrp = async (id) => {
        if(window.confirm("Supprimer ce groupe ?")) {
            await fetch(`/api/groupes/${id}`, { method: 'DELETE' });
            toast.error("Groupe supprimé");
            fetchGroupes();
        }
    };

    const filtered = groupes.filter(g => g.code_groupe?.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">SYNCING GROUPS...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen text-black">
            <div className="max-w-full mx-auto space-y-6">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-slate-800 italic">Groupes existant <span className="text-indigo-600">{filtered.length}</span></h1>
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="text-indigo-600 font-bold text-xs uppercase hover:underline mt-1">+ Ajouter</button>
                    </div>
                    <input type="text" placeholder="Recherche..." className="p-2 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-600 text-xs font-bold w-64" onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-[#004d40] text-white font-black text-[9px] uppercase">
                                    <th className="p-4">No.</th>
                                    <th className="p-4">Groupe</th>
                                    <th className="p-4">AN</th>
                                    <th className="p-4">NSem</th>
                                    <th className="p-4">MHHeb</th>
                                    <th className="p-4">MHA</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-bold text-[11px]">
                                {filtered.map((g, i) => (
                                    <tr key={i} className="hover:bg-indigo-50/30 transition-all">
                                        <td className="p-4 text-slate-300">{i + 1}</td>
                                        <td className="p-4"><button onClick={() => { setFormData(g); setEditMode(true); setShowModal(true); }} className="text-indigo-600 underline font-black">{g.code_groupe}</button></td>
                                        <td className="p-4">{g.annee_formation}</td>
                                        <td className="p-4 text-slate-400">{g.nbr_semaines}</td>
                                        <td className="p-4 font-black">{g.mh_hebdo}</td>
                                        <td className="p-4 text-slate-400">{g.mh_annuelle}</td>
                                        <td className="p-4 text-indigo-600 underline cursor-pointer">{g.statut}</td>
                                        <td className="p-4 text-center"><button onClick={() => deleteGrp(g.id_groupe)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-8">{editMode ? 'Edit' : 'Create'} Group</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-3 gap-5 font-bold">
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Code Groupe</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-600" value={formData.code_groupe} onChange={e => setFormData({...formData, code_groupe: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">AN (Année)</label>
                                <input type="number" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl" value={formData.annee_formation} onChange={e => setFormData({...formData, annee_formation: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">MHHeb</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl" value={formData.mh_hebdo} onChange={e => setFormData({...formData, mh_hebdo: e.target.value})} />
                            </div>
                            <button type="submit" className="col-span-3 bg-indigo-600 text-white p-4 rounded-3xl font-black uppercase shadow-xl mt-4">Sauvegarder dans MySQL ⚡</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}