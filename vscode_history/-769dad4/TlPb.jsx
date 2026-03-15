import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

const CALENDRIER_VACANCES = [
    { mois: 'janvier', jours: '01', nom: 'Nouvel an' },
    { mois: 'janvier', jours: '11', nom: 'Manifeste de l\'Indépendance' },
    { mois: 'janvier', jours: '14', nom: 'Nouvel an Amazigh' },
    { mois: 'janvier', jours: '19 au 26', nom: 'Vacances Mi-Semestre' },
    { mois: 'mars', jours: '15 au 22', nom: 'Vacances Mi-Trimestre 2' },
    { mois: 'mai', jours: '01', nom: 'Fête du Travail' },
    { mois: 'mai', jours: '03 au 10', nom: 'Vacances Mi-Trimestre 3' },
];

const SESSION_COLORS = [
    { bg: 'bg-[#e0f2f1]', border: 'border-[#00796b]' },
    { bg: 'bg-[#e3f2fd]', border: 'border-[#1976d2]' },
    { bg: 'bg-[#fff3e0]', border: 'border-[#f57c00]' },
    { bg: 'bg-[#f3e5f5]', border: 'border-[#7b1fa2]' },
];

export default function EmploiGrid() {
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedGroup, setSelectedGroup] = useState('AA101');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selection, setSelection] = useState(null);

    const nomDuMois = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());

    const fetchData = async () => {
        try {
            const [emp, sal, aff] = await Promise.all([
                fetch('/api/emploi').then(res => res.json()),
                fetch('/api/salles').then(res => res.json()),
                fetch('/api/affectations').then(res => res.json())
            ]);
            setEmploiData(Array.isArray(emp) ? emp : []);
            setSalles(Array.isArray(sal) ? sal : []);
            setAffectations(Array.isArray(aff) ? aff : []);
            setLoading(false);
        } catch (e) { 
            console.error(e);
            toast.error("Erreur de synchronisation SQL");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    const handleCellClick = (jour, heure) => {
        if (!selection || selection.jour !== jour || selection.end) {
            setSelection({ jour, start: heure, end: null });
        } else {
            const hStart = HEURES.indexOf(selection.start);
            const hEnd = HEURES.indexOf(heure);
            if (hEnd > hStart) setSelection({ ...selection, end: HEURES[hEnd + 1] });
            else setSelection({ jour, start: heure, end: null });
        }
    };

    const getAvailableOptions = () => {
        if (!selection || !selection.end) return { availableSalles: [], availableAffectations: [] };
        const occupied = emploiData.filter(s => 
            s.jour === selection.jour && 
            parseInt(s.id_periode) === selectedWeek &&
            s.heure_debut.substring(0, 5) < selection.end && 
            s.heure_fin.substring(0, 5) > selection.start
        );
        const occupiedSalles = occupied.map(s => s.id_salle);
        const occupiedProfs = occupied.map(s => s.affectation?.id_formateur);
        return {
            availableSalles: salles.filter(s => !occupiedSalles.includes(s.id_salle)),
            availableAffectations: affectations.filter(a => a.groupe?.code_groupe === selectedGroup && !occupiedProfs.includes(a.id_formateur))
        };
    };

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { 
            id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, 
            jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" 
        };
        const res = await fetch('/api/emploi/seance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            toast.success("Hébergé sur le serveur SQL");
            setSelection(null);
            fetchData();
        }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">RECONSTITUTION DU SYSTÈME...</div>;

    const options = getAvailableOptions();
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const holidays = CALENDRIER_VACANCES.filter(v => v.mois === nomDuMois.toLowerCase());

    return (
        <div className="p-6 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-8">
                
                {/* --- HEADER --- */}
                <div className="bg-white border-b-4 border-black p-8 shadow-xl rounded-[2rem] flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#006064]">Planning {nomDuMois} 2025</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-1">S{selectedWeek} • Institutional Workflow</p>
                    </div>

                    <div className="flex bg-gray-200 p-1.5 rounded-[1.5rem] border-2 border-black">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSelectedWeek(num)}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${selectedWeek === num ? 'bg-black text-white shadow-xl scale-110' : 'text-gray-500 hover:text-black'}`}>
                                SEM {num}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-2 rounded-2xl border-2 border-black">
                        <select className="bg-transparent font-black text-xs outline-none uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>Group: {g}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- GRID --- */}
                <div className="bg-white p-2 border-2 border-black shadow-2xl rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 table-fixed min-w-[1200px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[11px] uppercase tracking-widest">
                                    <th className="p-4 w-32 border border-gray-600 bg-[#006064]">JOUR / S{selectedWeek}</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border border-gray-600 p-2">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-28">
                                            <td className="bg-gray-50 border border-gray-400 text-center font-black text-[11px] uppercase text-gray-400">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = SESSION_COLORS[seance.id_affectation % SESSION_COLORS.length];
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg}`}>
                                                            <div className="flex flex-col items-center justify-center text-center h-full p-2">
                                                                <div className="font-black text-xs text-black border-b border-black/10 w-full mb-1 uppercase leading-none pb-1">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[10px] font-black uppercase text-black leading-none">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[10px] font-black text-blue-900 bg-white/30 px-3 py-0.5 rounded-full mt-2 border border-blue-200">📍 {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                const isSelected = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className={`border border-gray-300 transition-colors ${isSelected ? 'bg-yellow-100 animate-pulse border-yellow-400' : 'bg-white hover:bg-teal-50/50'}`}></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- VACATIONS --- */}
                {holidays.length > 0 && (
                    <div className="bg-white border-2 border-black p-6 shadow-[10px_10px_0px_rgba(0,0,0,1)] rounded-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#006064] mb-4 border-l-8 border-[#006064] pl-4">Événements : {nomDuMois}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {holidays.map((v, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
                                    <span className="bg-[#00acc1] text-white p-2 rounded-xl font-black text-xs shadow-md">{v.jours}</span>
                                    <span className="text-xs font-black uppercase text-slate-800">{v.nom}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SMART HUD MODAL --- */}
                {selection && selection.end && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[2000] p-4 text-black">
                        <div className="w-full max-w-3xl bg-white border-4 border-black shadow-[30px_30px_0px_rgba(0,0,0,1)] animate-in zoom-in">
                            <div className="p-6 bg-black text-white flex justify-between items-center font-black uppercase text-xs italic tracking-widest">
                                <span>S{selectedWeek} • {selection.jour} • {selection.start}-{selection.end}</span>
                                <button onClick={() => setSelection(null)} className="text-3xl font-light">&times;</button>
                            </div>
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em] border-b pb-2">1. Select Module</h3>
                                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                                        {options.availableAffectations.map(a => (
                                            <button key={a.id_affectation} onClick={() => { selection.id_aff = a.id_affectation; setSelection({...selection}); }}
                                                className={`w-full text-left p-4 border-2 font-black text-[10px] transition-all ${selection.id_aff === a.id_affectation ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white border-gray-200 hover:border-black uppercase'}`}>
                                                {a.module?.code_module} (Prof: {a.formateur?.nom})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em] border-b pb-2">2. Select Salle</h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                                        {options.availableSalles.map(s => (
                                            <button key={s.id_salle} disabled={!selection.id_aff} onClick={() => confirmPlan(selection.id_aff, s.id_salle)}
                                                className={`p-4 border-2 font-black text-[9px] transition-all ${selection.id_aff ? 'bg-white border-gray-200 hover:bg-[#00acc1] hover:text-white hover:border-[#00acc1] shadow-sm' : 'opacity-20'}`}>
                                                📍 {s.nom_local}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: black; }`}</style>
        </div>
    );
}