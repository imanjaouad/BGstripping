import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const initialForm = { id_groupe: null, code_groupe: '', annee_formation: 1, nbr_semaines: 35, mh_hebdo: '28:00', mh_annuelle: 1000, statut: 'actif' };
    const [formData, setFormData] = useState(initialForm);

    // 1. جلب البيانات ديناميكياً
    const fetchGroupes = async () => {
        try {
            const res = await fetch('/api/groupes').then(r => r.json());
            setGroupes(res);
            setLoading(false);
        } catch (e) { console.error("Erreur DB:", e); }
    };

    useEffect(() => { fetchGroupes(); }, []);

    // 2. الحفظ في الداتابيز (إضافة أو تعديل)
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
            toast.success(editMode ? 'Modifié dans MySQL ✅' : 'Ajouté à MySQL ✅');
            setShowModal(false);
            fetchGroupes(); // تحديث الجدول فوراً
        }
    };

    // 3. الحذف من الداتابيز
    const deleteGrp = async (id) => {
        if (!window.confirm("Supprimer définitivement de la base ?")) return;
        await fetch(`/api/groupes/${id}`, { method: 'DELETE' });
        toast.error("Supprimé 🗑️");
        fetchGroupes();
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">SYNCING WITH DATABASE...</div>;

    const filtered = (groupes || []).filter(g => g.code_groupe?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Groupes <span className="text-indigo-600">Dynamic</span></h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{filtered.length} enregistrements MySQL</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Rechercher..." className="px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 text-xs font-bold w-64" onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:-translate-y-1 transition-all">+ Nouveau</button>
                    </div>
                </div>

                {/* --- TABLE (Mapping Dynamic Data) --- */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest">
                                <tr>
                                    <th className="p-6">No.</th>
                                    <th className="p-6">Groupe</th>
                                    <th className="p-6">Filiere</th>
                                    <th className="p-6 text-center">AN</th>
                                    <th className="p-6 text-center">MHHeb</th>
                                    <th className="p-6 text-center">MHA</th>
                                    <th className="p-6 text-center">Statut</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-bold text-xs">
                                {filtered.map((g, i) => (
                                    <tr key={i} className="hover:bg-indigo-50/30 transition-all">
                                        <td className="p-6 text-slate-300 font-mono">#{g.id_groupe}</td>
                                        <td className="p-6">
                                            <button onClick={() => { setFormData(g); setEditMode(true); setShowModal(true); }} className="text-indigo-600 underline font-black uppercase">{g.code_groupe}</button>
                                        </td>
                                        <td className="p-6 text-slate-400 uppercase text-[10px]">
                                            {/* حماية ضد undefined باستعمال ?. */}
                                            {g.filiere?.intitule_filiere || 'GÉNIE ÉLECTRIQUE'}
                                        </td>
                                        <td className="p-6 text-center">{g.annee_formation}</td>
                                        <td className="p-6 text-center font-black text-slate-700">{g.mh_hebdo}</td>
                                        <td className="p-6 text-center text-slate-400">{g.mh_annuelle}</td>
                                        <td className="p-6 text-center uppercase text-[9px] font-black text-teal-600">{g.statut}</td>
                                        <td className="p-6 text-center">
                                            <button onClick={() => deleteGrp(g.id_groupe)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-12 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">{editMode ? 'Update' : 'Register'} Group</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6 font-bold">
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">Code Groupe</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold" value={formData.code_groupe} onChange={e => setFormData({...formData, code_groupe: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">MHHeb</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold" value={formData.mh_hebdo} onChange={e => setFormData({...formData, mh_hebdo: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">AN (Année)</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold" value={formData.annee_formation} onChange={e => setFormData({...formData, annee_formation: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">MHA (Annuelle)</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold" value={formData.mh_annuelle} onChange={e => setFormData({...formData, mh_annuelle: e.target.value})} />
                            </div>
                            <button type="submit" className="col-span-2 bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase shadow-2xl hover:-translate-y-1 active:scale-95 transition-all mt-4">
                                Commit to MySQL ⚡
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}