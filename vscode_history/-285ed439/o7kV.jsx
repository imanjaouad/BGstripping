import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // نموذج البيانات المطابق للصورة 100%
    const initialForm = {
        id_groupe: null,
        code_groupe: '',
        id_filiere: 1,
        annee_formation: 1, // AN
        nbr_semaines: 35, // NSem
        mh_hebdo: '28:00', // MHHeb
        mh_annuelle: 1000, // MHA
        statut: 'actif',
        fusion_status: 'non',
        type_formation: 'R',
        id_proprietaire: 1 // admin1
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchGroupes = async () => {
        try {
            const res = await fetch('/api/groupes').then(r => r.json());
            setGroupes(res);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchGroupes(); }, []);

    const handleSave = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/groupes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (res.ok && data.success) {
            toast.success('Groupe ajouté !');
            setShowModal(false);
            fetchGroupes();
        } else {
            // هنا غادي يقرأ الميساج ديال Laravel
            toast.error("Erreur: " + (data.message || "Problème inconnu"));
        }
    } catch (err) {
        toast.error("Erreur de connexion au serveur");
    }
};

    const deleteGrp = async (id) => {
        if(confirm("Supprimer ce groupe définitivement ?")) {
            await fetch(`/api/groupes/${id}`, { method: 'DELETE' });
            toast.error("Groupe supprimé");
            fetchGroupes();
        }
    };

    const filtered = groupes.filter(g => g.code_groupe.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">CHARGEMENT DES GROUPES...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER (D'après l'Image 8) --- */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Groupes existant <span className="text-indigo-600">{filtered.length}</span>
                        </h1>
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="text-indigo-600 font-bold text-xs hover:underline uppercase mt-1">
                            + Ajouter un nouveau groupe
                        </button>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Rechercher un groupe (Ex: EMI201)..." 
                            className="bg-transparent flex-1 px-4 py-2 outline-none text-xs font-bold"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="bg-slate-800 text-white p-2 rounded-xl shadow-lg">🔍</button>
                    </div>
                </div>

                {/* --- DATA TABLE (Full Columns) --- */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-[#004d40] text-white font-black text-[9px] uppercase tracking-[0.1em]">
                                    <th className="p-4 border-r border-white/10">No.</th>
                                    <th className="p-4 border-r border-white/10">EFP</th>
                                    <th className="p-4 border-r border-white/10 text-center">Groupe</th>
                                    <th className="p-4 border-r border-white/10 w-64">Filiere</th>
                                    <th className="p-4 border-r border-white/10 text-center">AN</th>
                                    <th className="p-4 border-r border-white/10 text-center">NSem</th>
                                    <th className="p-4 border-r border-white/10 text-center">MHHeb</th>
                                    <th className="p-4 border-r border-white/10 text-center">MHA</th>
                                    <th className="p-4 border-r border-white/10 text-center">Jumeau</th>
                                    <th className="p-4 border-r border-white/10 text-center">Statut</th>
                                    <th className="p-4 border-r border-white/10 text-center">Fusion</th>
                                    <th className="p-4 border-r border-white/10 text-center">Type</th>
                                    <th className="p-4 border-r border-white/10">Propriétaire</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((g, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group text-[10px] font-bold">
                                        <td className="p-4 text-slate-300">{i + 1}</td>
                                        <td className="p-4 text-slate-500 leading-none">ISTA <br/> BENGUERIR</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => { setFormData(g); setEditMode(true); setShowModal(true); }} className="text-indigo-600 hover:underline font-black">{g.code_groupe}</button>
                                        </td>
                                        <td className="p-4 text-slate-600 uppercase tracking-tighter leading-tight font-medium">
                                            {g.filiere?.intitule_filiere || 'Génie Électrique Option Electromécanique'}
                                        </td>
                                        <td className="p-4 text-center">{g.annee_formation}</td>
                                        <td className="p-4 text-center text-slate-400">{g.nbr_semaines}</td>
                                        <td className="p-4 text-center font-black text-slate-800">{g.mh_hebdo}</td>
                                        <td className="p-4 text-center text-slate-400 font-medium">{g.mh_annuelle}</td>
                                        <td className="p-4 text-center text-indigo-400 italic underline">{g.code_groupe}</td>
                                        <td className="p-4 text-center">
                                            <span className="text-indigo-600 underline cursor-pointer">actif</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-indigo-600 underline cursor-pointer">non</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-indigo-600 underline cursor-pointer">R</span>
                                        </td>
                                        <td className="p-4 text-slate-500 italic">admin1</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => deleteGrp(g.id_groupe)} className="text-slate-300 hover:text-red-500 transition-colors text-lg">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL CONFIGURATION GROUPE --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{editMode ? 'Edit' : 'Create'} Group Node</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-red-500 text-4xl font-thin">&times;</button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-3 gap-5">
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">Code Groupe</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.code_groupe} onChange={e => setFormData({...formData, code_groupe: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">Année (AN)</label>
                                <input type="number" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.annee_formation} onChange={e => setFormData({...formData, annee_formation: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">Semaines</label>
                                <input type="number" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.nbr_semaines} onChange={e => setFormData({...formData, nbr_semaines: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">MHHeb</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.mh_hebdo} onChange={e => setFormData({...formData, mh_hebdo: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">MHA (Annuelle)</label>
                                <input type="number" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.mh_annuelle} onChange={e => setFormData({...formData, mh_annuelle: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-2">Type</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold" value={formData.type_formation} onChange={e => setFormData({...formData, type_formation: e.target.value})} />
                            </div>
                            
                            <button type="submit" className="col-span-3 bg-indigo-600 text-white p-4 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 transition-all mt-4">
                                Sync Group to Database ⚡
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}