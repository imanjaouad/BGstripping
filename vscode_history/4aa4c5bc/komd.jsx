import React, { useEffect, useState } from 'react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function StagiaireView() {
    const [groupes, setGroupes] = useState([]);
    const [emploiData, setEmploiData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [gRes, eRes] = await Promise.all([
                fetch('/api/groupes').then(r => r.json()),
                fetch('/api/emploi').then(r => r.json())
            ]);
            setGroupes(gRes);
            if (gRes.length > 0) setSelectedGroup(gRes[0].code_groupe);
            setEmploiData(eRes);
            setLoading(false);
        };
        fetchData();
    }, []);

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return endIdx - startIdx;
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-[#006064]">CHARGEMENT DE L'ESPACE STAGIAIRE...</div>;

    // فلترة لومبلوا حسب القسم المختار (فقط السيمانة 1 كمثال أو الحالية)
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === 1);

    return (
        <div className="flex h-screen bg-[#94aeb0] font-sans text-black overflow-hidden">
            
            {/* --- SIDEBAR: LISTE DES GROUPES --- */}
            <div className="w-64 bg-[#d1dbdc] border-r-2 border-[#004d40] flex flex-col p-4 shadow-xl">
                <div className="bg-[#004d40] text-white p-2 font-black uppercase text-sm mb-4">Groupe :</div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scroll">
                    {groupes.map((g) => (
                        <button 
                            key={g.id_groupe}
                            onClick={() => setSelectedGroup(g.code_groupe)}
                            className={`w-full text-left p-3 font-black uppercase text-sm transition-all ${selectedGroup === g.code_groupe ? 'bg-white border-l-8 border-[#006064] shadow-md' : 'hover:bg-white/50 text-slate-700'}`}
                        >
                            {g.code_groupe}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN AREA: THE GRID (READ ONLY) --- */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="bg-white p-4 border-2 border-[#004d40] shadow-2xl">
                    <div className="text-center mb-4">
                        <h2 className="font-black uppercase text-[#004d40] tracking-widest">Période : Semaine Courante</h2>
                        <div className="text-xs font-bold text-slate-400 uppercase italic">Espace Consultation Stagiaires</div>
                    </div>

                    <table className="w-full border-collapse border-2 border-[#004d40] table-fixed min-w-[900px]">
                        <thead>
                            <tr className="bg-[#004d40] text-white font-black text-[10px] uppercase">
                                <th className="p-3 w-24 border border-[#00332b]">Jour\heure</th>
                                {HEURES.slice(0, -1).map(h => <th key={h} className="border border-[#00332b] p-1">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {JOURS.map(j => {
                                let skip = 0;
                                return (
                                    <tr key={j} className="h-20">
                                        <td className="bg-[#006064] text-white text-center font-black text-xs uppercase border border-[#004d40]">{j}</td>
                                        {HEURES.slice(0, -1).map(h => {
                                            if (skip > 0) { skip--; return null; }
                                            const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                            if (seance) {
                                                const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                skip = span - 1;
                                                return (
                                                    <td key={h} colSpan={span} className="border border-slate-300 bg-white text-center p-1">
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <div className="font-black text-[10px] uppercase border-b border-slate-100 w-full mb-1">{seance.affectation?.module?.code_module}</div>
                                                            <div className="text-[9px] font-bold uppercase text-slate-800">{seance.affectation?.formateur?.nom}</div>
                                                            <div className="text-[9px] font-black text-[#006064] mt-1">📍 {seance.salle?.nom_local}</div>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            return <td key={h} className="border border-slate-200 bg-white/50"></td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`.custom-scroll::-webkit-scrollbar { width: 5px; } .custom-scroll::-webkit-scrollbar-thumb { background: #006064; }`}</style>
        </div>
    );
}