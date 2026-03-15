import React, { useEffect, useState } from 'react';

export default function AffectationTable() {
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/affectations')
            .then(res => res.json())
            .then(data => {
                setAffectations(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="p-5 text-center">Chargement des données...</div>;

    return (
        <div className="font-sans text-sm p-4">
            {/* Header Zre9 */}
            <div className="bg-[#006064] text-white p-3 flex justify-between items-center rounded-t-lg shadow">
                <div className="flex gap-2">
                   <span className="bg-[#00acc1] px-3 py-1 rounded font-bold">Groupe : AA101</span>
                </div>
                <div className="font-bold">ISTA BENGUERIR</div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto shadow-lg">
                <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead className="bg-[#004d40] text-white">
                        <tr>
                            <th className="p-3 text-left">Groupe</th>
                            <th className="p-3 text-left">Module</th>
                            <th className="p-3 text-center">MH Pres</th>
                            <th className="p-3 text-center">MH FAD</th>
                            <th className="p-3 text-left">Formateur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {affectations.map((row, index) => (
                            <tr key={index} className="hover:bg-teal-50 transition-colors">
                                <td className="p-3 font-bold text-gray-700">{row.groupe?.code_groupe}</td>
                                <td className="p-3">
                                    <div className="text-blue-600 font-bold">{row.module?.code_module}</div>
                                    <div className="text-gray-500 text-xs">{row.module?.intitule_module}</div>
                                </td>
                                <td className="p-3 text-center bg-green-50">{row.mh_pres}</td>
                                <td className="p-3 text-center bg-yellow-50">{row.mh_fad}</td>
                                <td className="p-3 font-semibold text-gray-800">
                                    {row.formateur?.nom} {row.formateur?.prenom}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}