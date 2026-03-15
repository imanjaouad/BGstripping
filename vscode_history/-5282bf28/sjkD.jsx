import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation(); // Bach n3rfou fina page hna

    // Fonction bach tzyyn lien ila konna f dik page
    const getLinkClass = (path) => {
        const baseClass = "px-4 py-2 rounded-md font-bold transition duration-200";
        return location.pathname === path 
            ? "bg-[#00acc1] text-white shadow-lg" // Ila khtarina page
            : "text-gray-200 hover:bg-[#004d40] hover:text-white"; // Ila la
    };

    return (
        <nav className="bg-[#006064] shadow-md mb-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Titre */}
                    <div className="flex items-center gap-2">
                        <div className="text-white font-bold text-xl tracking-wider">
                            🏫 GESTION ISTA
                        </div>
                    </div>

                    {/* Liens du Menu */}
                    <div className="flex space-x-2">
                        <Link to="/" className={getLinkClass("/")}>🏠 Accueil</Link>
                        <Link to="/affectations" className={getLinkClass("/affectations")}>📅 Affectations</Link>
                        <Link to="/formateurs" className={getLinkClass("/formateurs")}>👨‍🏫 Formateurs</Link>
                        <Link to="/groupes" className={getLinkClass("/groupes")}>🎓 Groupes</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}