import React, { useEffect, useState } from 'react';

export default function AffectationTable() {
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recherche, setRecherche] = useState(''); // <-- Hna fin ghankhbbiw text d recherche

    useEffect(() => {
        fetch('/api/affectations')
            .then(res => res.json())
            .then(data => {
                setAffectations(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Hada howa Logic dyal Recherche (S7er 🪄)
    // Kan-filtriw data 3la 7sab chno mktoub f 'recherche'
    const resultatFiltre = affectations.filter(item => {
        const textRecherche = recherche.toLowerCase();
        
        return (
            // N9ellbo f smiyet Module
            item.module?.intitule_module.toLowerCase().includes(textRecherche) ||
            // Ola Code Module
            item.module?.code_module.toLowerCase().includes(textRecherche) ||
            // Ola Smiyet Formateur
            item.formateur?.nom.toLowerCase().includes(textRecherche) ||
            // Ola Code Groupe
            item.groupe?.code_groupe.toLowerCase().includes(textRecherche)
        );
    });

    // N7sbo Total d Sa3at d hadchi li affiché
    const totalHeures = resultatFiltre.reduce((sum, item) => sum + item.mh_pres + item.mh_fad, 0);

    if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Chargement des données...</div>;

    return (
        <div className="font-sans text-sm p-6 max-w-6xl mx-auto">
            
            {/* --- STATS CARDS (LFOU9) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="text-gray-500">Total Affectations</div>
                    <div className="text-2xl font-bold">{resultatFiltre.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="text-gray-500">Total Heures</div>
                    <div className="text-2xl font-bold">{totalHeures} H</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="text-gray-500">Formateurs Trouvés</div>
                    {/* Hna kan7sbo chhal mn formateur unique */}
                    <div className="text-2xl font-bold">
                        {[...new Set(resultatFiltre.map(i => i.formateur?.id_formateur))].length}
                    </div>
                </div>
            </div>

            {/* --- BARRE DE RECHERCHE --- */}
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="🔍 Rechercher (Ex: Arabe, Ouatouch, AA101...)" 
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
            </div>

            {/* --- HEADER DU TABLEAU --- */}
            <div className="bg-[#006064] text-white p-3 flex justify-between items-center rounded-t-lg shadow">
                <div className="flex gap-2">
                   <span className="bg-[#00acc1] px-3 py-1 rounded font-bold text-xs uppercase">
                        Résultats : {resultatFiltre.length}
                   </span>
                </div>
                <div className="font-bold tracking-wider">ISTA BENGUERIR</div>
            </div>

            {/* --- TABLEAU --- */}
            <div className="overflow-x-auto shadow-lg rounded-b-lg">
                <table className="w-full border-collapse border border-gray-200 bg-white">
                    <thead className="bg-[#004d40] text-white uppercase text-xs tracking-wide">
                        <tr>
                            <th className="p-3 text-left">Groupe</th>
                            <th className="p-3 text-left">Module</th>
                            <th className="p-3 text-center">MH Pres</th>
                            <th className="p-3 text-center">MH FAD</th>
                            <th className="p-3 text-center">Total</th>
                            <th className="p-3 text-left">Formateur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {resultatFiltre.length > 0 ? (
                            resultatFiltre.map((row, index) => (
                                <tr key={index} className="hover:bg-teal-50 transition-colors group">
                                    <td className="p-3 font-bold text-gray-700 border-r">{row.groupe?.code_groupe}</td>
                                    <td className="p-3 border-r">
                                        <div className="text-blue-600 font-bold group-hover:underline cursor-pointer">
                                            {row.module?.code_module}
                                        </div>
                                        <div className="text-gray-500 text-xs">{row.module?.intitule_module}</div>
                                    </td>
                                    <td className="p-3 text-center text-gray-600 border-r">{row.mh_pres}</td>
                                    <td className="p-3 text-center text-gray-600 border-r">{row.mh_fad}</td>
                                    <td className="p-3 text-center font-bold text-teal-700 border-r">
                                        {parseInt(row.mh_pres) + parseInt(row.mh_fad)}
                                    </td>
                                    <td className="p-3 font-semibold text-gray-800">
                                        {row.formateur ? (
                                            <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded text-xs border border-gray-300">
                                                {row.formateur.nom} {row.formateur.prenom}
                                            </span>
                                        ) : (
                                            <span className="text-red-400 italic">Non Affecté</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                                    Aucun résultat trouvé pour "{recherche}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}