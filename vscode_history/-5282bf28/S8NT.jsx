import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-500 ${
            isActive 
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 scale-105" 
            : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
        }`;
    };

    return (
        <div className="fixed top-4 w-full z-[1000] px-6">
            <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-100 rounded-[2rem] px-8 py-4 flex justify-between items-center">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        I
                    </div>
                    <div className="text-slate-800 font-black text-xl tracking-tighter uppercase">
                        Smart<span className="text-indigo-600">Plan</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-2">
                    <Link to="/" className={getLinkClass("/")}>Dashboard</Link>
                    <Link to="/drag" className={getLinkClass("/drag")}>Quick Assign</Link>
                    <Link to="/emploi" className={getLinkClass("/emploi")}>Scheduler</Link>
                    <Link to="/affectations" className={getLinkClass("/affectations")}>Modules</Link>
                    <Link to="/formateurs" className={getLinkClass("/formateurs")}>Staff</Link>
                </div>

                {/* User Profile Area */}
                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-black text-indigo-600 uppercase">Administrator</div>
                        <div className="text-xs font-bold text-slate-700">Kamal Dev</div>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Kamal&background=6366f1&color=fff" alt="avatar" />
                    </div>
                </div>
            </nav>
        </div>
    );
}