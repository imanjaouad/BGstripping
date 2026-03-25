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
            const [sRes, eRes] = await Promise.all([
                fetch('/api/salles').then(r => r.json()),
                fetch('/api/emploi').then(r => r.json())
            ]);
            setSalles(sRes);
            setSeances(eRes);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-20 text-center font-black animate-pulse">SCANNING ROOMS...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-full mx-auto space-y-8">
                
                {/* --- SMART HEADER --- */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Room <span className="text-[#006064]">Occupancy</span></h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Surveillance en temps réel des locaux</p>
                    </div>

                    {/* SELECTEUR DE JOUR (Innovation) */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 shadow-inner">
                        {JOURS.map(d => (
                            <button key={d} onClick={() => setSelectedDay(d)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedDay === d ? 'bg-[#006064] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-800'}`}>
                                {d.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- OCCUPANCY GRID --- */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed min-w-[1200px]">
                            <thead>
                                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest">
                                    <th className="p-6 w-40 text-left border-r border-white/5">Local / Heure</th>
                                    {HEURES.slice(0, -1).map(h => (
                                        <th key={h} className="p-2 border-r border-white/5">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salles.map((salle, sIdx) => (
                                    <tr key={sIdx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 bg-slate-50 border-r border-slate-200">
                                            <div className="font-black text-slate-800 text-xs uppercase">{salle.nom_local}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{salle.type_local}</div>
                                        </td>
                                        
                                        {HEURES.slice(0, -1).map((h, hIdx) => {
                                            // البحث واش هاد القاعة محجوزة في هاد الساعة والنهار المختار
                                            const occupation = seances.find(s => 
                                                s.id_salle === salle.id_salle && 
                                                s.jour === selectedDay &&
                                                s.heure_debut.substring(0, 5) <= h &&
                                                s.heure_fin.substring(0, 5) > h
                                            );

                                            return (
                                                <td key={hIdx} className="p-1 border-r border-slate-100 relative h-20">
                                                    {occupation ? (
                                                        <div className="absolute inset-1 bg-indigo-600 rounded-xl p-2 text-white shadow-lg flex flex-col justify-center animate-in fade-in duration-500">
                                                            <div className="font-black text-[10px] uppercase truncate leading-none mb-1">
                                                                {occupation.affectation?.groupe?.code_groupe}
                                                            </div>
                                                            <div className="text-[8px] font-bold opacity-70 truncate uppercase tracking-tighter">
                                                                {occupation.affectation?.formateur?.nom}
                                                            </div>
                                                            <div className="mt-1 text-[8px] font-black bg-white/20 w-fit px-1.5 py-0.5 rounded uppercase">
                                                                {occupation.affectation?.module?.code_module}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
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

                {/* --- LEGEND & INFO --- */}
                <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[2rem] shadow-2xl">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupé</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponible</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        Live Tracking System • {selectedDay}
                    </div>
                </div>

            </div>
        </div>
    );
}