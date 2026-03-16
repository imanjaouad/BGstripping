import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    // دالة لتغيير ستايل الرابط إذا كان هو الصفحة النشطة
    const getLinkClass = (path) => {
        const baseClass = "px-3 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center gap-2";
        return location.pathname === path 
            ? `${baseClass} bg-black text-white shadow-lg scale-105` 
            : `${baseClass} text-gray-300 hover:bg-[#004d40] hover:text-white`;
    };

    return (
        <nav className="bg-[#006064] shadow-2xl mb-6 sticky top-0 z-[1000] border-b-4 border-[#004d40]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    
                    {/* LOGO الإداري */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white text-[#006064] w-10 h-10 rounded-full flex items-center justify-center font-black italic shadow-inner">
                            ISTA
                        </div>
                        <div className="text-white font-black text-lg tracking-tighter uppercase italic">
                            EFP <span className="text-teal-300">Planner</span>
                        </div>
                    </div>

                    {/* القائمة الرئيسية */}
                    <div className="hidden md:flex space-x-2">
                        <Link to="/" className={getLinkClass("/")}>
                            🏠 Tableau de bord
                        </Link>
                        
                        <Link to="/affectations" className={getLinkClass("/affectations")}>
                            📅 Modules
                        </Link>

                        {/* --- هـادا هـو الـرابـط الـجديـد (Quick Assign) --- */}
                        <Link to="/drag" className={getLinkClass("/drag")}>
                            🚀 Affectation Rapide
                        </Link>

                        <Link to="/emploi" className={getLinkClass("/emploi")}>
                            ⏱️ Emploi du temps
                        </Link>
                        
                        <Link to="/formateurs" className={getLinkClass("/formateurs")}>
                            👨‍🏫 Formateurs
                        </Link>
                        
                        <Link to="/salles" className={getLinkClass("/salles")}>
                            🏢 Salles
                        </Link>
                    </div>

                    {/* أيقونة المستخدم (إضافة جمالية) */}
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded-full border border-white/10 px-4">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-white font-black uppercase">Admin1 Online</span>
                    </div>

                </div>
            </div>
        </nav>
    );
}