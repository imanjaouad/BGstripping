import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [time, setTime] = useState(new Date());

    // تحديث الساعة كل ثانية
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        const baseClass = "px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1";
        return isActive 
            ? `${baseClass} bg-black text-white shadow-lg scale-105` 
            : `${baseClass} text-slate-400 hover:bg-slate-100 hover:text-[#006064]`;
    };

    return (
        <div className="fixed top-0 w-full z-[1000] bg-white border-b-2 border-slate-100 shadow-sm px-6">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center h-20">
                    
                    {/* --- 1. BRAND & SEARCH --- */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#006064] rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-teal-100">I</div>
                            <div className="hidden xl:block font-black text-slate-800 tracking-tighter text-lg uppercase italic">
                                Smart<span className="text-[#006064]">Plan</span>
                            </div>
                        </div>

                        {/* خانة البحث الشاملة (الإبداع) */}
                        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 w-64 group focus-within:w-80 focus-within:border-[#006064] transition-all duration-500">
                            <span className="opacity-30">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Recherche globale..." 
                                className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-full text-slate-600"
                            />
                        </div>
                    </div>

                    {/* --- 2. MAIN NAVIGATION --- */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link to="/" className={getLinkClass("/")}>Dashboard</Link>
                        <Link to="/emploi" className={getLinkClass("/emploi")}>Emploi</Link>
                        <Link to="/locaux" className={getLinkClass("/locaux")}>Locaux</Link>
                        <Link to="/drag" className={getLinkClass("/drag")}>Assign</Link>
                        <Link to="/affectations" className={getLinkClass("/affectations")}>Modules</Link>
                        <Link to="/formateurs" className={getLinkClass("/formateurs")}>Staff</Link>
                        <Link to="/groupes" className={getLinkClass("/groupes")}>Groupes</Link>
                    </div>

                    {/* --- 3. LIVE CLOCK & PROFILE --- */}
                    <div className="flex items-center gap-6 border-l border-slate-100 pl-6">
                        
                        {/* الساعة الحية (Live Clock) */}
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="text-sm font-black text-slate-800 tabular-nums leading-none">
                                {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                                {time.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </div>
                        </div>

                        {/* Profile Area */}
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                            <div className="w-8 h-8 bg-[#006064] rounded-xl flex items-center justify-center text-white font-black text-xs">
                                K
                            </div>
                            <div className="hidden md:block">
                                <div className="text-[9px] font-black text-slate-400 uppercase leading-none">Admin Mode</div>
                                <div className="text-xs font-bold text-slate-800">Kamal Dev</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}