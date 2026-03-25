import React, { useEffect, useState } from 'react';

export default function Dashboard() {
    // Dakira bach n7etto fiha l-ar9am
    const [stats, setStats] = useState({
        total_groupes: 0,
        total_formateurs: 0,
        total_salles: 0,
        total_fp: 0,
        total_fv: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Njibo Stats mn Laravel
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Chargement des statistiques...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Tableau de Bord</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- CARD GROUPES --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 transform hover:scale-105 transition duration-300">
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wide">Groupes</h2>
                        <p className="text-5xl font-extrabold text-blue-600 mt-2">{stats.total_groupes}</p>
                        <p className="text-sm text-gray-400 mt-2">Effectifs: 1484 (Fixe)</p>
                    </div>
                </div>

                {/* --- CARD FORMATEURS --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 transform hover:scale-105 transition duration-300">
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 p-4 rounded-full mb-4">
                            <span className="text-4xl">👨‍🏫</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wide">Formateurs</h2>
                        <p className="text-5xl font-extrabold text-green-600 mt-2">{stats.total_formateurs}</p>
                        <div className="flex gap-4 mt-4 text-sm font-semibold">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">FP : {stats.total_fp}</span>
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">FV : {stats.total_fv}</span>
                        </div>
                    </div>
                </div>

                {/* --- CARD SALLES --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 transform hover:scale-105 transition duration-300">
                    <div className="flex flex-col items-center">
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <span className="text-4xl">🏫</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wide">Salles</h2>
                        <p className="text-5xl font-extrabold text-purple-600 mt-2">{stats.total_salles}</p>
                        <p className="text-sm text-gray-400 mt-2">Locaux disponibles</p>
                    </div>
                </div>

            </div>

            {/* --- GRAPHIQUE BASIQUE (Barres CSS) --- */}
            <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-6">Répartition par Type de Contrat</h3>
                <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                        <div 
                            className="bg-green-500 h-6 flex items-center justify-center text-xs text-white font-bold" 
                            style={{ width: `${(stats.total_fp / stats.total_formateurs) * 100}%` }}>
                            {Math.round((stats.total_fp / stats.total_formateurs) * 100)}% FP
                        </div>
                        <div 
                            className="bg-yellow-400 h-6 flex items-center justify-center text-xs text-white font-bold" 
                            style={{ width: `${(stats.total_fv / stats.total_formateurs) * 100}%` }}>
                            {Math.round((stats.total_fv / stats.total_formateurs) * 100)}% FV
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}