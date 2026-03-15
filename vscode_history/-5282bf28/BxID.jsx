import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    
    // --- 1. جلب اسم المستخدم من المتصفح (localStorage) ---
    const [adminName, setAdminName] = useState("Admin");

    useEffect(() => {
        // تحديث الساعة
        const timer = setInterval(() => setTime(new Date()), 1000);
        
        // جلب السمية اللي تسجلات فاش درنا Login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAdminName(storedUser);
        }

        return () => clearInterval(timer);
    }, []);

    // دالة تسجيل الخروج (Logout) - إضافة إبداعية
    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        const baseClass = "px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1";
        return isActive 
            ? `${baseClass} bg-black text-white shadow-lg scale-105` 
            : `${baseClass} text-slate-400 hover:bg-slate-50 hover:text-[#006064]`;
    };

    return (
        <div className="fixed top-0 w-full z-[1000] bg-white border-b-2 border-slate-100 shadow-sm px-6">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center h-20">
                    
                    {/* --- BRAND --- */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#006064] rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">I</div>
                        <div className="font-black text-slate-800 tracking-tighter text-lg uppercase italic hidden xl:block">
                            Smart<span className="text-[#006064]">Plan</span>
                        </div>
                    </Link>

                    {/* --- MAIN NAVIGATION --- */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link to="/" className={getLinkClass("/")}>🏠 Tableau de bord</Link>
                        <Link to="/emploi" className={getLinkClass("/emploi")}>⏱️ Emploi du temps</Link>
                        <Link to="/locaux" className={getLinkClass("/locaux")}>🏢 Radar Locaux</Link>
                        <Link to="/drag" className={getLinkClass("/drag")}>🚀 Affectation Rapide</Link>
                        <Link to="/affectations" className={getLinkClass("/affectations")}>📅 Modules</Link>
                        <Link to="/formateurs" className={getLinkClass("/formateurs")}>👨‍🏫 Formateurs</Link>
                        <Link to="/groupes" className={getLinkClass("/groupes")}>🎓 Groupes</Link>
                        <Link to="/salles" className={getLinkClass("/salles")}>🏫 Salles</Link>
                    </div>

                    {/* --- RIGHT SECTION (DYNAMIQUE) --- */}
                    <div className="flex items-center gap-6 border-l border-slate-100 pl-6">
                        
                        <div className="hidden sm:flex flex-col items-end border-r pr-6 border-slate-100">
                            <div className="text-sm font-black text-slate-800 tabular-nums leading-none">
                                {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                                {time.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                        </div>

                        {/* --- PROFILE DYNAMIQUE (الإبداع هنا) --- */}
                        <div className="flex items-center gap-3 group relative">
                            <Link to="/profile" className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100 hover:bg-white transition-all shadow-sm">
                                {/* الدائرة كتاخد أول حرف من سمية الأدمن */}
                                <div className="w-8 h-8 bg-[#006064] rounded-xl flex items-center justify-center text-white font-black text-xs uppercase shadow-md">
                                    {adminName.charAt(0)}
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-[9px] font-black text-indigo-600 uppercase leading-none italic">Session Active</div>
                                    <div className="text-xs font-bold text-slate-800 tracking-tight uppercase">
                                        {adminName} {/* عرض اسم الأدمن الحقيقي */}
                                    </div>
                                </div>
                            </Link>
                            
                            {/* زر الخروج السريع (Logout) */}
                            <button 
                                onClick={handleLogout}
                                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm group-hover:scale-100"
                                title="Déconnexion"
                            >
                                🚪
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}