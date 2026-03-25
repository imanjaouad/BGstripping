import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    // Fonction bach tzyyn lien ila konna f dik page
    const getLinkClass = (path) => {
        return location.pathname === path 
            ? "bg-[#00acc1] text-white px-3 py-2 rounded-md font-bold shadow-lg transition" 
            : "text-gray-200 hover:bg-[#004d40] hover:text-white px-3 py-2 rounded-md transition";
    };

    return (
        <nav className="bg-[#006064] shadow-md mb-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="text-white font-bold text-xl tracking-wider">
                            🏫 GESTION ISTA
                        </div>
                    </div>

                    {/* Liens du Menu (Hna fin katzid Salles) */}
                    <div className="flex space-x-4">
                        <Link to="/" className={getLinkClass("/")}>
                            🏠 Accueil
                        </Link>
                        
                        <Link to="/affectations" className={getLinkClass("/affectations")}>
                            📅 Affectations
                        </Link>
                        
                        <Link to="/formateurs" className={getLinkClass("/formateurs")}>
                            👨‍🏫 Formateurs
                        </Link>
                        
                        <Link to="/groupes" className={getLinkClass("/groupes")}>
                            🎓 Groupes
                        </Link>

                        {/* --- HADI HIYA LI TZADET --- */}
                        <Link to="/salles" className={getLinkClass("/salles")}>
                            🏫 Salles
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}