import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Salles() {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nom_local: '', type_local: 'Salle', capacite: 30 });

    const fetchSalles = async () => {
        try {
            const res = await fetch('/api/salles').then(r => r.json());
            setSalles(res);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchSalles(); }, []);

    // --- دالة الإضافة المصلحة ---
    const handleSave = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/salles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast.success('Local enregistré !');
            setShowModal(false);
            setFormData({ nom_local: '', type_local: 'Salle', capacite: 30 });
            fetchSalles(); // تحديث القائمة
        }
    };

    // --- دالة الحذف المصلحة ---
    const deleteSalle = async (id) => {
        if(window.confirm("🚨 Attention: Supprimer cette salle effacera toutes les séances qui y sont programmées !")) {
            const res = await fetch(`/api/salles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.error('Local supprimé 🗑️');
                fetchSalles(); // تحديث القائمة
            }
        }
    };

    const filtered = salles.filter(s => s.nom_local.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-indigo-600 uppercase">Synchronisation Salles...</div>;

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans text-black">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Salles <span className="text-indigo-600">existant</span></h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestion des locaux de formation</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Rechercher..." className="px-4 py-2 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-600 text-xs font-bold" onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-xl">+ Nouveau</button>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-6">No.</th>
                                <th className="p-6">Identifiant EFP</th>
                                <th className="p-6">Nom du Local</th>
                                <th className="p-6">Type</th>
                                <th className="p-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs font-bold">
                            {filtered.map((s, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="p-6 text-slate-300 font-mono">{i + 1}</td>
                                    <td className="p-6 text-slate-400">ISTA BENGUERIR</td>
                                    <td className="p-6 text-indigo-600 underline uppercase font-black tracking-tight">{s.nom_local}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.type_local === 'Atelier' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {s.type_local}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => deleteSalle(s.id_salle)} className="text-slate-300 hover:text-red-500 transition-colors text-lg">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl p-12 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Nouveau Local</h2>
                        <form onSubmit={handleSave} className="space-y-6 font-bold">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Nom du local</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600" value={formData.nom_local} onChange={e => setFormData({...formData, nom_local: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Type de local</label>
                                <select className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl" value={formData.type_local} onChange={e => setFormData({...formData, type_local: e.target.value})}>
                                    <option value="Salle">Salle de cours</option>
                                    <option value="Atelier">Atelier (Workshop)</option>
                                    <option value="Amphi">Amphithéâtre</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase shadow-2xl hover:-translate-y-1 active:scale-95 transition-all">
                                Commit to Server ⚡
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}