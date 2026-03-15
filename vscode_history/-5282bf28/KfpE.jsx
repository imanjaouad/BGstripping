import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
            isActive 
            ? "bg-[#006064] text-white shadow-md shadow-teal-100" 
            : "text-slate-500 hover:bg-slate-100 hover:text-[#006064]"
        }`;
    };

    return (
        <nav className="bg-white border-b-2 border-slate-100 sticky top-0 z-[1000] px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-6">
                {/* Logo Officiel Look */}
                <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
                    <div className="w-8 h-8 bg-[#006064] rounded flex items-center justify-center text-white font-black italic">I</div>
                    <span className="font-black text-slate-800 tracking-tighter text-lg uppercase">Institutional <span className="text-[#006064]">Planner</span></span>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                    <Link to="/" className={getLinkClass("/")}>Dashboard</Link>
                    <Link to="/emploi" className={getLinkClass("/emploi")}>Emploi</Link>
                    <Link to="/drag" className={getLinkClass("/drag")}>Quick Assign</Link>
                    <Link to="/affectations" className={getLinkClass("/affectations")}>Modules</Link>
                    <Link to="/formateurs" className={getLinkClass("/formateurs")}>Instructors</Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Connecté en tant que</div>
                    <div className="text-xs font-bold text-slate-800 uppercase italic">Administrateur_01</div>
                </div>
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-[#006064]">A1</div>
            </div>
        </nav>
    );
}