import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);
    const [filieres, setFilieres] = useState([]); // لجلب الشعب من الداتابيز
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        code_groupe: '', id_filiere: '', annee_formation: 1, 
        nbr_semaines: 35, mh_hebdo: '', mh_annuelle: '', 
        statut: 'actif', id_efp: 1, id_proprietaire: 1
    });

    const fetchData = async () => {
        try {
            const [gRes, fRes] = await Promise.all([
                fetch('/api/groupes').then(r => r.json()),
                fetch('/api/filieres').then(r => r.json()) // تأكد من وجود هاد الـ API
            ]);
            setGroupes(gRes);
            setFilieres(fRes);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const load = toast.loading('Enregistrement dans MySQL...');
        
        const res = await fetch('/api/groupes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) // صيفط كاع الحقول ديناميكياً
        });

        if (res.ok) {
            toast.success('Groupe enregistré dynamiquement ! ✅', { id: load });
            setShowModal(false);
            fetchData();
        } else {
            toast.error('Erreur: Vérifiez les clés étrangères SQL', { id: load });
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">DYNAMIC SYNC...</div>;

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-6 text-black">
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex justify-between items-center">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Database <span className="text-indigo-600">Groupes</span></h1>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:-translate-y-1 transition-all">+ Nouveau Groupe</button>
                </div>

                {/* الجدول */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Code</th>
                                <th className="p-6">AN</th>
                                <th className="p-6">MHHeb</th>
                                <th className="p-6">MHA</th>
                                <th className="p-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-xs">
                            {groupes.map((g, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-all">
                                    <td className="p-6 font-black uppercase">{g.code_groupe}</td>
                                    <td className="p-6">{g.annee_formation}</td>
                                    <td className="p-6">{g.mh_hebdo}</td>
                                    <td className="p-6 text-slate-400">{g.mh_annuelle}</td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => deleteGrp(g.id_groupe)} className="text-red-500">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 100% DYNAMIQUE */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6 text-black">
                    <div className="bg-white w-full max-w-3xl rounded-[4rem] shadow-2xl p-12 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Saisie Dynamique</h2>
                        
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6 font-bold">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase block mb-1 tracking-widest">1. Code Groupe</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 rounded-3xl outline-none focus:border-indigo-600 transition-all" 
                                    onChange={e => setFormData({...formData, code_groupe: e.target.value})} required />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase block mb-1 tracking-widest">2. Choisir Filière</label>
                                <select className="w-full p-4 bg-slate-50 border-2 rounded-3xl cursor-pointer" 
                                    onChange={e => setFormData({...formData, id_filiere: e.target.value})} required>
                                    <option value="">Sélectionner الشعبة...</option>
                                    {filieres.map(f => <option key={f.id_filiere} value={f.id_filiere}>{f.intitule_filiere}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase block mb-1 tracking-widest">3. Année (AN)</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border-2 rounded-3xl" 
                                    onChange={e => setFormData({...formData, annee_formation: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase block mb-1 tracking-widest">4. Masse Hebdomadaire</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 rounded-3xl" 
                                    onChange={e => setFormData({...formData, mh_hebdo: e.target.value})} placeholder="28:00" />
                            </div>

                            <button type="submit" className="col-span-2 bg-slate-900 text-white p-5 rounded-[2.5rem] font-black uppercase shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
                                Injecter dans la Database 🚀
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}