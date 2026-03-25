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
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchFormateurs(); }, []);

    // --- الـسّـر فـي الـسّـرعـة: تحديث محلي فوري (Optimistic Update) ---
    const handleSave = async (e) => {
        e.preventDefault();
        
        // 1. خزن النسخة القديمة (للحالة الطارئة)
        const oldFormateurs = [...formateurs];

        // 2. سد الـ Modal فوراً باش المستخدم يحس بالسرعة
        setShowModal(false);

        // 3. تحديث القائمة محلياً في الذاكرة (بدون انتظار السيرفر)
        if (editMode) {
            setFormateurs(formateurs.map(f => f.id_formateur === formData.id_formateur ? { ...f, ...formData } : f));
            toast.success('Modification prise en compte !');
        } else {
            // إضافة مؤقتة (بـ ID وهمي) حتى يجاوب السيرفر
            const tempId = Date.now();
            setFormateurs([{ ...formData, id_formateur: tempId }, ...formateurs]);
            toast.success('Ajout en cours...');
        }

        // 4. إرسال الطلب للسيرفر في "صمت" (Background)
        const url = editMode ? `/api/formateurs/${formData.id_formateur}` : '/api/formateurs';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error();
            
            // تحديث نهائي للتأكد من الـ IDs الحقيقية من الداتابيز
            fetchFormateurs(); 
        } catch (err) {
            // إذا وقع مشكل في السيرفر، رجع الداتا القديمة وعلم المستخدم
            setFormateurs(oldFormateurs);
            toast.error("Échec de synchronisation avec le serveur");
        }
    };

    const deleteFormateur = async (id) => {
        if (!window.confirm("Supprimer ce profil ?")) return;
        
        // مسح محلي فوري
        const oldData = [...formateurs];
        setFormateurs(formateurs.filter(f => f.id_formateur !== id));
        toast.error("Suppression...");

        try {
            const res = await fetch(`/api/formateurs/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
        } catch (e) {
            setFormateurs(oldData);
            toast.error("Impossible de supprimer");
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

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">SYNCHRONISATION...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Modern Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Personnel <span className="text-[#006064]">Manager</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{filtered.length} Comptes actifs</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Recherche instantanée..." className="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#006064] text-xs font-bold w-64 transition-all" onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setEditMode(false); setFormData(initialForm); setShowModal(true); }} className="bg-[#006064] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:scale-105 active:scale-95 transition-all">
                            + Nouveau
                        </button>
                    </div>
                </div>

                {/* Table Look Modern */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-white">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="p-6">Identifiant</th>
                                <th className="p-6">Nom Complet</th>
                                <th className="p-6">Type</th>
                                <th className="p-6 text-center">Statutaire</th>
                                <th className="p-6">Métier</th>
                                <th className="p-6 text-center">Gestion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((f, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="p-6 font-black text-slate-400 text-xs tracking-tighter">#{f.matricule}</td>
                                    <td className="p-6 uppercase font-black text-slate-800 text-xs tracking-tight">{f.nom} {f.prenom}</td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${f.type_contrat === 'FP' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                            {f.type_contrat}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center font-black text-slate-700 text-sm">{f.mh_statutaire}H</td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tighter">{f.metier || 'Général'}</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => openEditModal(f)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-teal-600 hover:text-white rounded-xl transition-all shadow-sm">✏️</button>
                                            <button onClick={() => deleteFormateur(f.id_formateur)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL GÉANT MODERNE */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[2000] p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] p-12 border-8 border-slate-50 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">{editMode ? 'Edit' : 'Create'} Profile<span className="text-teal-500">.</span></h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Configuration des paramètres de l'instructeur</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-400 p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all text-xl">&times;</button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">MLE Code</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Job Title</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.metier} onChange={e => setFormData({...formData, metier: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Last Name</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">First Name</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Contract</label>
                                <select className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.type_contrat} onChange={e => setFormData({...formData, type_contrat: e.target.value})}>
                                    <option value="FP">Permanent (FP)</option>
                                    <option value="FV">Vacataire (FV)</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 ml-2">Hours Load</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:bg-white focus:border-[#006064] transition-all font-bold" value={formData.mh_statutaire} onChange={e => setFormData({...formData, mh_statutaire: e.target.value})} />
                            </div>
                            <button type="submit" className="col-span-2 bg-[#006064] text-white p-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-teal-200 hover:-translate-y-1 active:scale-95 transition-all mt-6">
                                Update Sync Node ⚡
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}