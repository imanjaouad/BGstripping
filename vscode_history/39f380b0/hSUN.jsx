import React, { useEffect, useState } from 'react';

export default function Formateurs() {
    const [formateurs, setFormateurs] = useState([]);

    useEffect(() => {
        fetch('/api/formateurs').then(res => res.json()).then(data => setFormateurs(data));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-[#006064]">Liste des Formateurs</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 text-left">Matricule</th>
                            <th className="p-3 text-left">Nom & Prénom</th>
                            <th className="p-3 text-center">Type</th>
                            <th className="p-3 text-center">Spécialité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formateurs.map((f, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-blue-600">{f.matricule}</td>
                                <td className="p-3 font-bold">{f.nom} {f.prenom}</td>
                                <td className="p-3 text-center"><span className="bg-gray-200 px-2 rounded text-xs">{f.type_contrat}</span></td>
                                <td className="p-3 text-center">{f.metier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}