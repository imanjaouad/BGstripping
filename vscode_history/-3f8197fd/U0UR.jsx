import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const [credentials, setCredentials] = useState({ login: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const load = toast.loading('Authentification en cours...');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();

            if (data.success) {
                // 1. حفظ الدور والاسم في المتصفح
                localStorage.setItem('userRole', data.role); // 'admin', 'stagiaire', أو 'formateur'
                localStorage.setItem('userName', data.user);
                
                // 2. إذا كان المستخدم أستاذ، نحفظ الـ ID الخاص به (مهم لفلترة لومبلوا)
                if (data.id_formateur) {
                    localStorage.setItem('userId', data.id_formateur);
                }
                
                toast.success(`Accès réussi ! Bienvenue ${data.user}`, { id: load });

                // 3. التوجيه الذكي حسب الدور (Role Routing)
                if (data.role === 'admin') {
                    navigate('/'); // الأدمن يمشي للداشبورد
                } else if (data.role === 'formateur') {
                    navigate('/enseignant'); // الأستاذ يمشي لفضاؤه الخاص
                } else {
                    navigate('/consultation'); // المتدرب يمشي لصفحة العرض
                }
            } else {
                toast.error(data.message || "Identifiants incorrects", { id: load });
            }
        } catch (err) {
            toast.error("Erreur de communication avec le serveur SQL", { id: load });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-teal-100 rounded-full blur-[100px] opacity-50"></div>

            <div className="w-full max-w-md relative z-10 text-black">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#006064] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl mx-auto mb-4 rotate-12">I</div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Smart<span className="text-indigo-600">Plan</span></h1>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-2 font-bold">Portail d'accès ISTA</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4 font-bold">Identifiant (MLE pour Staff)</label>
                            <input type="text" placeholder="Entrez votre login" className="w-full p-4 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-[#006064] font-bold text-slate-700 shadow-sm" 
                                onChange={e => setCredentials({...credentials, login: e.target.value})} required />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4 font-bold">Mot de passe</label>
                            <input type="password" placeholder="••••••••" className="w-full p-4 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-[#006064] font-bold text-slate-700 shadow-sm" 
                                onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-[#006064] transition-all active:scale-95 flex justify-center items-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Ouvrir la session ⚡"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}