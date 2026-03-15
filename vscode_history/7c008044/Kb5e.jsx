import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Salles() {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    // نموذج الإضافة
    const [formData, setFormData] = useState({ nom_local: '', type_local: 'Salle', capacite: 30 });

    const fetchSalles = async () => {
        try {
            const res = await fetch('/api/salles').then(r => r.json());
            setSalles(res);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchSalles(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/salles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast.success('Local ajouté avec succès ✅');
            setShowModal(false);
            setFormData({ nom_local: '', type_local: 'Salle', capacite: 30 });
            fetchSalles();
        }
    };

    const deleteSalle = async (id) => {
        if(confirm("Supprimer ce local ?")) {
            await fetch(`/api/salles/${id}`, { method: 'DELETE' });
            toast.error("Local supprimé 🗑️");
            fetchSalles();
        }
    };

    const filtered = salles.filter(s => s.nom_local.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">SCANNING ROOMS...</div>;

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* --- HEADER (D'après l'Image 9) --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Salles <span className="text-indigo-600">existant</span></h1>
                        <button onClick={() => setShowModal(true)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline mt-2 flex items-center gap-2">
                            <span>+</span> Ajouter un nouveau local
                        </button>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl border-2 border-slate-200 w-full md:w-80">
                        <input 
                            type="text" 
                            placeholder="Recherche..." 
                            className="bg-transparent flex-1 px-4 py-2 outline-none text-xs font-bold"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="bg-slate-800 text-white p-2 rounded-xl">🔍</button>
                    </div>
                </div>

                {/* --- TABLEAU (Full Mapping) --- */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                                <th className="p-6">No.</th>
                                <th className="p-6">EFP</th>
                                <th className="p-6">Local</th>
                                <th className="p-6">Type</th>
                                <th className="p-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-xs">
                            {filtered.map((s, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                    <td className="p-6 text-slate-300">{i + 1}</td>
                                    <td className="p-6 text-slate-400 uppercase tracking-tighter">ISTA BENGUERIR</td>
                                    <td className="p-6">
                                        <span className="text-indigo-600 underline cursor-pointer font-black uppercase tracking-tight">
                                            {s.nom_local}
                                        </span>
                                    </td>
                                    <td className="p-6 uppercase text-slate-500">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border ${s.type_local === 'Atelier' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {s.type_local}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => deleteSalle(s.id_salle)} className="text-slate-200 hover:text-red-500 transition-colors">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL AJOUT SALLE --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl p-12 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Nouveau Local</h2>
                        
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Nom du local</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 font-bold" 
                                    placeholder="Ex: Salle 10, Atelier 1..."
                                    value={formData.nom_local} onChange={e => setFormData({...formData, nom_local: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Type</label>
                                <select className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl font-bold" 
                                    value={formData.type_local} onChange={e => setFormData({...formData, type_local: e.target.value})}>
                                    <option value="Salle">Salle de cours</option>
                                    <option value="Atelier">Atelier (Workshop)</option>
                                    <option value="Amphi">Amphithéâtre</option>
                                </select>
                            </div>
                            
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                                    Enregistrer le local ⚡
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}