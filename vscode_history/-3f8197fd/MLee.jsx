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
        const load = toast.loading('Vérification des accès...');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();

            if (data.success) {
                // حفظ جلسة الدخول في المتصفح
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('user', data.user);
                
                toast.success(`Accès autorisé. Bienvenue ${data.user} !`, { id: load });
                navigate('/'); // الدخول للداشبورد
            } else {
                toast.error(data.message, { id: load });
            }
        } catch (err) {
            toast.error("Erreur de connexion au serveur SQL", { id: load });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-teal-100 rounded-full blur-[100px] opacity-50"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#006064] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl mx-auto mb-4 rotate-12">I</div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">SMART<span className="text-indigo-600">PLAN</span></h1>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-2 text-black">Portail d'Administration ISTA</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4">Identifiant (Login)</label>
                            <input type="text" className="w-full p-4 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-[#006064] font-bold text-slate-700" 
                                onChange={e => setCredentials({...credentials, login: e.target.value})} required />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4">Mot de passe</label>
                            <input type="password" className="w-full p-4 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-[#006064] font-bold text-slate-700" 
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