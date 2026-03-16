import React, { useEffect, useState } from 'react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function OccupationLocaux() {
    const [seances, setSeances] = useState([]);
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('Lundi');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sRes, eRes] = await Promise.all([
                    fetch('/api/salles').then(r => r.json()),
                    fetch('/api/emploi').then(r => r.json())
                ]);
                setSalles(sRes);
                setSeances(eRes);
                setLoading(false);
            } catch (err) { console.error(err); setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-20 pt-40 text-center font-black animate-pulse text-slate-400">SCANNING INFRASTRUCTURE...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-8">
                
                {/* Header Page */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Radar <span className="text-[#006064]">Locaux</span></h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Occupation des salles en temps réel</p>
                    </div>

                    {/* Selector de Jour */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                        {JOURS.map(d => (
                            <button key={d} onClick={() => setSelectedDay(d)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${selectedDay === d ? 'bg-[#006064] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-800'}`}>
                                {d.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Occupancy Grid */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed min-w-[1200px]">
                            <thead>
                                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest">
                                    <th className="p-6 w-44 text-left border-r border-white/5">Localisation</th>
                                    {HEURES.slice(0, -1).map(h => (
                                        <th key={h} className="p-2 border-l border-white/5">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-bold">
                                {salles.map((salle, sIdx) => (
                                    <tr key={sIdx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 bg-slate-50 border-r border-slate-200">
                                            <div className="text-slate-800 text-xs uppercase font-black">{salle.nom_local}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-tighter">{salle.type_local}</div>
                                        </td>
                                        
                                        {HEURES.slice(0, -1).map((h, hIdx) => {
                                            // البحث عن الحصة
                                            const occupation = seances.find(s => 
                                                s.id_salle === salle.id_salle && 
                                                s.jour === selectedDay &&
                                                s.heure_debut.substring(0, 5) <= h &&
                                                s.heure_fin.substring(0, 5) > h
                                            );

                                            return (
                                                <td key={hIdx} className="p-1 border-r border-slate-100 relative h-20">
                                                    {occupation ? (
                                                        <div className="absolute inset-1 bg-indigo-600 rounded-2xl p-3 text-white shadow-lg flex flex-col justify-center animate-in zoom-in duration-300">
                                                            <div className="font-black text-[10px] uppercase truncate mb-1">{occupation.affectation?.groupe?.code_groupe}</div>
                                                            <div className="text-[8px] font-bold opacity-70 truncate uppercase">{occupation.affectation?.formateur?.nom}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center opacity-20">
                                                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}