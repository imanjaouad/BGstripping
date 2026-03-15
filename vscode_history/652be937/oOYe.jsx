import React, { useEffect, useState } from 'react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function OccupationLocaux() {
    const [seances, setSeances] = useState([]);
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('Lundi');
    const [selectedWeek, setSelectedWeek] = useState(1);

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

    useEffect(() => { fetchData(); }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 text-[#006064] font-black uppercase tracking-[0.5em] animate-pulse">
            Radar Scanning...
        </div>
    );

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-8">
                
                {/* --- SMART CONTROL HEADER --- */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-3">
                            <span className="w-4 h-4 bg-indigo-600 rounded-full animate-ping"></span>
                            Radar <span className="text-[#006064]">Locaux</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Surveillance des ressources de formation</p>
                    </div>

                    {/* Week Selector */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 shadow-inner">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSelectedWeek(num)}
                                className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 ${selectedWeek === num ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}>
                                S{num}
                            </button>
                        ))}
                    </div>

                    {/* Day Selector */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                        {JOURS.map(d => (
                            <button key={d} onClick={() => setSelectedDay(d)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${selectedDay === d ? 'bg-[#006064] text-white shadow-md' : 'text-slate-400 hover:text-slate-800'}`}>
                                {d.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- INTERACTIVE OCCUPANCY GRID --- */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed min-w-[1200px]">
                            <thead>
                                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest">
                                    <th className="p-6 w-44 text-left border-r border-white/5 shadow-xl">Local / Heure</th>
                                    {HEURES.slice(0, -1).map(h => (
                                        <th key={h} className="p-2 border-l border-white/5">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salles.map((salle, sIdx) => (
                                    <tr key={sIdx} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-5 bg-slate-50 border-r border-slate-200 shadow-sm">
                                            <div className="text-slate-800 text-xs font-black uppercase leading-tight">{salle.nom_local}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-tighter font-bold">{salle.type_local}</div>
                                        </td>
                                        
                                        {HEURES.slice(0, -1).map((h, hIdx) => {
                                            const occupation = seances.find(s => 
                                                Number(s.id_salle) === Number(salle.id_salle) && 
                                                s.jour.toLowerCase() === selectedDay.toLowerCase() &&
                                                Number(s.id_periode) === Number(selectedWeek) &&
                                                s.heure_debut.substring(0, 5) <= h &&
                                                s.heure_fin.substring(0, 5) > h
                                            );

                                            return (
                                                <td key={hIdx} className="p-1 border-r border-slate-100 relative h-20 group/cell">
                                                    {occupation ? (
                                                        <div className="absolute inset-1 bg-indigo-600 rounded-2xl p-3 text-white shadow-lg flex flex-col justify-center animate-in zoom-in duration-300 overflow-hidden cursor-help">
                                                            <div className="font-black text-[10px] uppercase truncate leading-none mb-1">
                                                                {occupation.affectation?.groupe?.code_groupe}
                                                            </div>
                                                            <div className="text-[8px] font-bold opacity-70 truncate uppercase tracking-tighter">
                                                                {occupation.affectation?.formateur?.nom}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center relative">
                                                            {/* النقطة الرمادية الافتراضية */}
                                                            <div className="w-1 h-1 bg-slate-200 rounded-full group-hover/cell:opacity-0 transition-opacity"></div>
                                                            
                                                            {/* زر الحجز السريع عند وضع الماوس (إبداع) */}
                                                            <button 
                                                                onClick={() => window.location.href='/emploi'}
                                                                className="absolute inset-2 bg-green-500 text-white rounded-xl shadow-lg opacity-0 group-hover/cell:opacity-100 scale-90 group-hover/cell:scale-100 transition-all duration-300 flex items-center justify-center"
                                                            >
                                                                <span className="text-[8px] font-black uppercase tracking-tighter">+ RÉSERVER</span>
                                                            </button>
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

                {/* --- LEGEND FOOTER --- */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Salle Occupée</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-slate-700 rounded-lg border border-slate-600"></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Local Libre</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.4)]"></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Action : Réserver</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-1">Status : Operationnal</div>
                        <div className="text-slate-500 text-xs font-bold">Scanning week {selectedWeek} • {selectedDay}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}