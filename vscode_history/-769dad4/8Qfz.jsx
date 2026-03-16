import React, { useEffect, useState } from 'react';


const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

// --- اللائحة الرسمية مأخوذة من وثيقة OFPPT ---
const CALENDRIER_VACANCES = [
    { mois: 'septembre', jours: '12 et 13', nom: 'Aïd Al Mawlid' },
    { mois: 'novembre', jours: '06', nom: 'Marche Verte' },
    { mois: 'novembre', jours: '18', nom: 'Fête de l\'Indépendance' },
    { mois: 'décembre', jours: '08 au 15', nom: 'Vacances Mi-Trimestre 1' },
    { mois: 'janvier', jours: '01', nom: 'Nouvel an' },
    { mois: 'janvier', jours: '11', nom: 'Manifeste de l\'Indépendance' },
    { mois: 'janvier', jours: '14', nom: 'Nouvel an Amazigh' },
    { mois: 'janvier', jours: '19 au 26', nom: 'Vacances Mi-Semestre' },
    { mois: 'mars', jours: '15 au 22', nom: 'Vacances Mi-Trimestre 2' },
    { mois: 'mars', jours: '30*', nom: 'Aïd Al Fitr (estimé)' },
    { mois: 'mai', jours: '01', nom: 'Fête du Travail' },
    { mois: 'mai', jours: '03 au 10', nom: 'Vacances Mi-Trimestre 3' },
    { mois: 'juin', jours: '06*', nom: 'Aïd Al Adha (estimé)' },
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
    
    // اكتشاف الشهر الحالي آلياً
    const moisActuel = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date()).toLowerCase();
    const [viewMonth, setViewMonth] = useState(moisActuel);

    const fetchData = async () => {
        try {
            const [emp, sal, aff] = await Promise.all([
                fetch('/api/emploi').then(res => res.json()),
                fetch('/api/salles').then(res => res.json()),
                fetch('/api/affectations').then(res => res.json())
            ]);
            setEmploiData(emp);
            setSalles(sal);
            setAffectations(aff);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    // تصفية العطل حسب الشهر المعروض
    const holidays = CALENDRIER_VACANCES.filter(v => v.mois === viewMonth);

    const getColSpan = (hDebut, hFin) => HEURES.indexOf(hFin.substring(0, 5)) - HEURES.indexOf(hDebut.substring(0, 5));

    if (loading) return <div className="p-10 text-center font-bold">Chargement du calendrier OFPPT...</div>;

    const filteredEmploi = emploiData.filter(s => 
        s.affectation?.groupe?.code_groupe === selectedGroup && 
        parseInt(s.id_periode) === selectedWeek
    );

    return (
        <div className="p-4 bg-[#f1f5f9] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto">
                
                {/* --- BARRE DE TITRE OFFICIELLE --- */}
                <div className="bg-white border-b-4 border-[#006064] p-6 mb-4 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#006064] text-white p-3 rounded-lg font-black text-xl italic shadow-md">EFP</div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Emploi du Temps : {viewMonth} 2025</h1>
                            <p className="text-gray-400 text-[10px] font-bold uppercase">Système de planification certifié OFPPT</p>
                        </div>
                    </div>

                    {/* SELECTEUR SEMAINE */}
                    <div className="flex bg-gray-200 p-1 rounded-2xl border-2 border-black">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSelectedWeek(num)}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === num ? 'bg-black text-white shadow-xl scale-110' : 'text-gray-500 hover:text-black'}`}>
                                S{num}
                            </button>
                        ))}
                    </div>

                    {/* SELECTEUR GROUPE */}
                    <div className="bg-white px-4 py-2 rounded-2xl border-2 border-black shadow-sm flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Groupe</span>
                        <select className="font-black text-sm outline-none uppercase cursor-pointer" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- GRID (L'OFFICIEL) --- */}
                <div className="bg-white p-2 border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden rounded-lg">
                    <table className="w-full border-collapse border border-gray-400 table-fixed min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#005f73] text-white">
                                <th className="border-2 border-gray-400 p-3 w-32 text-[10px] font-black uppercase">Jour \ Heure</th>
                                {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-gray-400 p-2 text-[10px] font-black">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {JOURS.map(j => {
                                let skip = 0;
                                return (
                                    <tr key={j} className="h-24">
                                        <td className="bg-gray-100 border-2 border-gray-400 text-center font-black text-[10px] uppercase text-gray-500">{j}</td>
                                        {HEURES.slice(0, -1).map(h => {
                                            if (skip > 0) { skip--; return null; }
                                            const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                            if (seance) {
                                                const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                skip = span - 1;
                                                const style = SESSION_COLORS[seance.id_affectation % SESSION_COLORS.length];
                                                return (
                                                    <td key={h} colSpan={span} className={`border-2 border-gray-500 ${style.bg} transition-all`}>
                                                        <div className="flex flex-col items-center justify-center text-center h-full p-2">
                                                            <div className="font-black text-xs text-black border-b border-black/10 w-full mb-1 leading-none uppercase">{seance.affectation?.module?.code_module}</div>
                                                            <div className="text-[10px] font-black text-black uppercase leading-none">{seance.affectation?.formateur?.nom}</div>
                                                            <div className="text-[10px] font-black text-blue-800 bg-white/30 px-2 rounded-full mt-2 border border-blue-200">📍 {seance.salle?.nom_local}</div>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            return <td key={h} className="border border-gray-300"></td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* --- BLOC DES VACANCES (D'APRES L'IMAGE) --- */}
                <div className="mt-8 bg-white border-2 border-black p-8 shadow-[10px_10px_0px_rgba(0,0,0,1)] rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#006064] border-l-8 border-[#006064] pl-4">
                            Légende des Vacances : {viewMonth.toUpperCase()}
                        </h3>
                        <div className="text-[9px] font-bold bg-gray-100 px-3 py-1 rounded border border-gray-200 uppercase">Document Officiel DRH</div>
                    </div>
                    
                    {holidays.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {holidays.map((v, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 border-2 border-gray-100 hover:border-[#00acc1] transition-all bg-gray-50/50 group">
                                    <div className="bg-[#00acc1] text-white p-2 rounded-lg font-black text-xs shadow-sm group-hover:rotate-6 transition-transform">
                                        {v.jours}
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-gray-800 uppercase tracking-tighter">{v.nom}</div>
                                        <div className="text-[9px] font-bold text-[#00acc1] uppercase mt-1">Interruption de cours</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Aucune vacance programmée pour ce mois</p>
                    )}
                </div>

            </div>
        </div>
    );
}