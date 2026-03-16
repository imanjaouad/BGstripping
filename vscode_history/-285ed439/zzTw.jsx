import React, { useEffect, useState } from 'react';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);

    useEffect(() => {
        fetch('/api/groupes').then(res => res.json()).then(data => setGroupes(data));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-[#006064]">Liste des Groupes</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupes.map((g, i) => (
                    <div key={i} className="bg-white p-4 rounded shadow border-l-4 border-teal-500">
                        <div className="text-xl font-bold text-gray-800">{g.code_groupe}</div>
                        <div className="text-sm text-gray-500">Année: {g.annee_formation}</div>
                        <div className="text-sm text-gray-500">Effectif: {g.effectif}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}