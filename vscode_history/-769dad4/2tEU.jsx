import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

// --- 🎨 باليت ألوان إدارية احترافية (Professional Pastel Palette) ---
const PALETTE_COULEURS = [
    { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-900', icon: 'text-blue-600' },
    { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-900', icon: 'text-emerald-600' },
    { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-900', icon: 'text-amber-600' },
    { bg: 'bg-rose-100', border: 'border-rose-500', text: 'text-rose-900', icon: 'text-rose-600' },
    { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-900', icon: 'text-indigo-600' },
    { bg: 'bg-violet-100', border: 'border-violet-500', text: 'text-violet-900', icon: 'text-violet-600' },
    { bg: 'bg-cyan-100', border: 'border-cyan-500', text: 'text-cyan-900', icon: 'text-cyan-600' },
    { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-900', icon: 'text-orange-600' },
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
            setEmploiData(emp || []);
            setSalles(sal || []);
            setAffectations(aff || []);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- 🪄 دالة جلب اللون بناءً على المادة (بشكل تابث) ---
    const getSessionStyle = (idAff) => {
        const index = idAff % PALETTE_COULEURS.length;
        return PALETTE_COULEURS[index];
    };

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    const handleCellClick = (jour, heure) => {
        if (!selection || selection.jour !== jour || selection.end) setSelection({ jour, start: heure, end: null });
        else setSelection({ ...selection, end: HEURES[HEURES.indexOf(heure) + 1] });
    };

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" };
        const res = await fetch('/api/emploi/seance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { 
            toast.success(selectedWeek === 1 ? "Mois complet planifié ! ✨" : "Séance ajoutée !"); 
            setSelection(null); 
            fetchData(); 
        }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">GENERATING COLORS...</div>;

    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);

    return (
        <div className="p-6 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-8">
                
                {/* Header */}
                <div className="bg-white border-b-4 border-black p-8 shadow-xl rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic text-[#006064] tracking-tighter">Planning {nomDuMois}</h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Management Multi-Couleurs Dynamique</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-black">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSelectedWeek(num)}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === num ? 'bg-black text-white shadow-xl scale-110' : 'text-gray-500'}`}>
                                S{num}
                            </button>
                        ))}
                    </div>

                    <select className="border-2 border-black p-2 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* Grid */}
                <div className="bg-white p-2 border-2 border-black shadow-2xl rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 table-fixed min-w-[1100px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[11px] uppercase tracking-widest">
                                    <th className="p-4 w-32 border border-gray-600 bg-[#006064]">S{selectedWeek} / JOUR</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border border-gray-500 p-2">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
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
                                                    
                                                    // --- استدعاء ستايل اللون المخصص ---
                                                    const style = getSessionStyle(seance.id_affectation);

                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} transition-all`}>
                                                            <div className="flex flex-col items-center justify-center text-center h-full p-2">
                                                                {/* العنوان بالكحل والخط غليظ */}
                                                                <div className={`font-black text-xs uppercase border-b border-black/10 w-full mb-1 leading-none pb-1 ${style.text}`}>
                                                                    {seance.affectation?.module?.code_module}
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase text-black">
                                                                    {seance.affectation?.formateur?.nom}
                                                                </div>
                                                                <div className="text-[10px] font-black text-slate-600 bg-white/40 px-3 py-0.5 rounded-full mt-2 border border-black/5 shadow-sm">
                                                                    📍 {seance.salle?.nom_local}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                
                                                const isSel = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className={`border border-gray-300 transition-colors cursor-cell ${isSel ? 'bg-yellow-100 animate-pulse border-yellow-400' : 'hover:bg-teal-50/50'}`}></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal HUD (يبقى كما هو) */}
        </div>
    );
}