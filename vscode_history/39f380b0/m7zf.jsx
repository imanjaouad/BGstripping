import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Formateurs() {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    // نموذج البيانات (بناءً على الصورة)
    const [formData, setFormData] = useState({
        id_formateur: null,
        matricule: '', // MLE
        nom: '',
        prenom: '',
        type_contrat: 'FP', // FP FV
        mh_statutaire: 26, // MHStat
        nbr_semaines: 35, // Nbr Sem
        metier: '', // Metier
        mdp_defaut: '' // MDP
    });

    const fetchFormateurs = async () => {
        const res = await fetch('/api/formateurs').then(r => r.json());
        setFormateurs(res);
        setLoading(false);
    };

    useEffect(() => { fetchFormateurs(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        // هنا نزيدو منطق الإرسال لـ Laravel (POST أو PUT)
        // للتبسيط غانعتبروه ديما خدام
        toast.success(editMode ? 'Formateur modifié' : 'Formateur ajouté');
        setShowModal(false);
        fetchFormateurs();
    };

    const deleteFormateur = async (id) => {
        if(confirm("Supprimer cet instructeur ?")) {
            // await fetch(`/api/formateurs/${id}`, { method: 'DELETE' });
            toast.error("Instructeur supprimé");
            fetchFormateurs();
        }
    };

    // فلترة البحث
    const filtered = formateurs.filter(f => 
        f.nom.toLowerCase().includes(search.toLowerCase()) || 
        f.matricule.toString().includes(search) ||
        f.metier?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-widest">Initialisation de l'annuaire...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Corps Enseignant</h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            {filtered.length} Formateurs existants • ISTA BENGUERIR
                        </p>
                    </div>
                    
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Rechercher MLE, Nom..." 
                                className="pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl outline-none focus:border-[#006064] text-sm transition-all"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <span className="absolute left-3 top-2.5 opacity-30 text-sm">🔍</span>
                        </div>
                        <button 
                            onClick={() => { setEditMode(false); setShowModal(true); }}
                            className="bg-[#006064] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#004d40] transition-all">
                            + Ajouter
                        </button>
                    </div>
                </div>

                {/* --- TABLEAU CREATIF --- */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">EFP</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">MLE</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">MHStat</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nbr Sem</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Métier</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">MDP</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((f, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ISTA BENGUERIR</td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black text-slate-600 border border-slate-200">
                                                {f.matricule}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-black text-slate-800 uppercase text-xs leading-none mb-1">{f.nom}</div>
                                            <div className="text-[10px] font-bold text-slate-400 capitalize">{f.prenom}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${f.type_contrat === 'FP' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {f.type_contrat === 'FP' ? '● Permanent' : '○ Vacataire'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-black text-slate-700 text-xs">{f.mh_statutaire}h</td>
                                        <td className="p-4 text-center font-bold text-slate-400 text-xs">{f.nbr_semaines}</td>
                                        <td className="p-4">
                                            <span className="bg-[#006064] text-white px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-widest">
                                                {f.metier || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-mono text-slate-300 group-hover:text-slate-900 transition-colors cursor-help" title="Cliquer pour copier">
                                                {f.mdp_defaut || f.matricule}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 bg-slate-100 hover:bg-teal-600 hover:text-white rounded-lg transition-all text-slate-400">✏️</button>
                                                <button onClick={() => deleteFormateur(f.id_formateur)} className="p-2 bg-slate-100 hover:bg-red-600 hover:text-white rounded-lg transition-all text-slate-400">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL AJOUT / EDIT --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[2000] p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white p-10 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{editMode ? 'Modifier' : 'Nouveau'} Profil</h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Renseignez les informations officielles de l'instructeur</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-400 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">&times;</button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Matricule (MLE)</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" required />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Métier / Spécialité</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" placeholder="Ex: FM, THR..." />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nom</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" required />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Prénom</label>
                                <input type="text" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Type Contrat</label>
                                <select className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064] font-bold">
                                    <option value="FP">Permanent (FP)</option>
                                    <option value="FV">Vacataire (FV)</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">MHStat</label>
                                    <input type="number" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" defaultValue={26} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Semaines</label>
                                    <input type="number" className="w-full p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064]" defaultValue={35} />
                                </div>
                            </div>
                            <button type="submit" className="col-span-2 bg-[#006064] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#004d40] transition-all mt-4">
                                Enregistrer l'instructeur
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}