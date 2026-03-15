import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile() {
    const [settings, setSettings] = useState({
        efp_name: '', login_admin: '', password_admin: '',
        surveillant_login: '', surveillant_pass: '',
        impression_annee: '', pied_groupe_nb: '',
        pied_groupe_gauche: '', pied_groupe_milieu: '', pied_groupe_droit: ''
    });
    const [loading, setLoading] = useState(true);

    // 1. جلب البيانات من الداتابيز عند فتح الصفحة
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if(data) setSettings(data);
                setLoading(false);
            });
    }, []);

    // 2. دالة تحديث الحالة (State) محلياً
    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    // 3. دالة الحفظ في الداتابيز (POST to Laravel)
    const handleUpdate = async (e) => {
        if(e) e.preventDefault();
        const load = toast.loading('Synchronisation avec la base...');
        
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if(res.ok) {
                toast.success('Informations mises à jour dans MySQL ! ✅', { id: load });
            } else { throw new Error(); }
        } catch (err) {
            toast.error('Erreur de connexion SQL', { id: load });
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">CONNECTING TO SERVER...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <div className="max-w-4xl mx-auto space-y-8">
                
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Configuration <span className="text-indigo-600">Système</span></h1>

                {/* --- SECTION 1: EFP & COMPTE --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="border-b pb-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nom de l'Etablissement (EFP)</label>
                            <div className="flex gap-4">
                                <input name="efp_name" type="text" className="flex-1 p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold" 
                                    value={settings.efp_name} onChange={handleChange} />
                                <button type="submit" className="bg-indigo-600 text-white px-6 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 hover:scale-105 transition-all">💾 Sauver</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Admin Login</label>
                                <input name="login_admin" type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold" 
                                    value={settings.login_admin} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Admin Password</label>
                                <input name="password_admin" type="password" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold" 
                                    value={settings.password_admin} onChange={handleChange} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Enregistrer les identifiants</button>
                    </form>
                </div>

                {/* --- SECTION 2: SURVEILLANT --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <h3 className="font-black text-slate-800 text-sm uppercase italic mb-6 border-l-4 border-indigo-600 pl-4">Espace Surveillant</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <input name="surveillant_login" type="text" placeholder="Login Surveillant" className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold text-xs" 
                            value={settings.surveillant_login} onChange={handleChange} />
                        <div className="flex gap-4">
                            <input name="surveillant_pass" type="password" placeholder="Password" className="flex-1 p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold text-xs" 
                                value={settings.surveillant_pass} onChange={handleChange} />
                            <button onClick={handleUpdate} className="bg-indigo-600 text-white px-6 rounded-2xl shadow-lg shadow-indigo-100">💾</button>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: IMPRESSION SETTINGS --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <h3 className="font-black text-slate-800 text-sm uppercase italic mb-6 border-l-4 border-teal-500 pl-4">Paramètres d'Impression (PDF)</h3>
                    <div className="space-y-6">
                        <input name="impression_annee" type="text" placeholder="Année Scolaire (Ex: 2024/2025)" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-bold text-xs" 
                            value={settings.impression_annee} onChange={handleChange} />
                        
                        <div className="grid grid-cols-3 gap-4">
                            <input name="pied_groupe_gauche" type="text" placeholder="Zone Gauche" className="p-4 bg-slate-50 rounded-xl border text-[10px] font-bold" value={settings.pied_groupe_gauche} onChange={handleChange} />
                            <input name="pied_groupe_milieu" type="text" placeholder="Zone Milieu" className="p-4 bg-slate-50 rounded-xl border text-[10px] font-bold" value={settings.pied_groupe_milieu} onChange={handleChange} />
                            <input name="pied_groupe_droit" type="text" placeholder="Zone Droite" className="p-4 bg-slate-50 rounded-xl border text-[10px] font-bold" value={settings.pied_groupe_droit} onChange={handleChange} />
                        </div>
                        <button onClick={handleUpdate} className="w-full bg-teal-600 text-white p-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-teal-700 transition-all">Mettre à jour le pied de page</button>
                    </div>
                </div>

            </div>
        </div>
    );
}