import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

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

    // --- 🪄 حالة الاقتراح الذكي (Smart Suggestion State) ---
    const [suggestedModule, setSuggestedModule] = useState(null);

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

    // --- دالة فحص الإمكانية (هل هذا السلوت متاح للمادة المختارة؟) ---
    const isSlotPossible = (jour, heure) => {
        if (!suggestedModule) return false;
        
        const hEnd = HEURES[HEURES.indexOf(heure) + 1];
        const profId = suggestedModule.id_formateur;

        // 1. واش هاد القسم ديجا كيقرا شي حاجة تما؟
        const grpOccupied = emploiData.some(s => s.affectation?.id_groupe === suggestedModule.id_groupe && s.jour === jour && parseInt(s.id_periode) === selectedWeek && s.heure_debut.substring(0, 5) < hEnd && s.heure_fin.substring(0, 5) > heure);
        if (grpOccupied) return false;

        // 2. واش الأستاذ مشغول في هاد السيمانة والوقت؟
        const profOccupied = emploiData.some(s => s.affectation?.id_formateur === profId && s.jour === jour && parseInt(s.id_periode) === selectedWeek && s.heure_debut.substring(0, 5) < hEnd && s.heure_fin.substring(0, 5) > heure);
        if (profOccupied) return false;

        // 3. واش كاين على الأقل قاعة وحدة خاوية؟
        const occupiedSallesCount = emploiData.filter(s => s.jour === jour && parseInt(s.id_periode) === selectedWeek && s.heure_debut.substring(0, 5) < hEnd && s.heure_fin.substring(0, 5) > heure).length;
        if (occupiedSallesCount >= salles.length) return false;

        return true;
    };

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    const handleCellClick = (jour, heure) => {
        // إذا كنا في "وضع الاقتراح"، كليك وحدة كافية للاختيار
        if (suggestedModule) {
            setSelection({ jour, start: heure, end: HEURES[HEURES.indexOf(heure) + 1], id_aff: suggestedModule.id_affectation });
            return;
        }
        if (!selection || selection.jour !== jour || selection.end) setSelection({ jour, start: heure, end: null, id_aff: null });
        else setSelection({ ...selection, end: HEURES[HEURES.indexOf(heure) + 1] });
    };

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" };
        const res = await fetch('/api/emploi/seance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { 
            toast.success("Placé avec succès ! ✨"); 
            setSelection(null); 
            setSuggestedModule(null); // حيد الاقتراح مّلي نساليو
            fetchData(); 
        }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse">SMART ENGINE BOOTING...</div>;

    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const besoinsDuGroupe = affectations.filter(a => a.groupe?.code_groupe === selectedGroup && !emploiData.some(s => s.id_affectation === a.id_affectation));

    return (
        <div className="p-6 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black flex gap-6">
            
            {/* --- 📦 SIDE DRAWER: BANK OF MODULES (Innovation) --- */}
            <div className="w-80 bg-white border-2 border-black p-6 shadow-[10px_10px_0px_black] h-fit sticky top-32 rounded-xl">
                <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4 flex justify-between">
                    <span>Bank Modules</span>
                    <span className="bg-indigo-600 text-white px-2 rounded-full">{besoinsDuGroupe.length}</span>
                </h3>
                <p className="text-[9px] text-gray-400 font-bold mb-4 uppercase">Cliquez pour voir les disponibilités</p>
                
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
                    {besoinsDuGroupe.map(a => (
                        <button 
                            key={a.id_affectation} 
                            onClick={() => setSuggestedModule(suggestedModule?.id_affectation === a.id_affectation ? null : a)}
                            className={`w-full text-left p-4 border-2 transition-all group ${suggestedModule?.id_affectation === a.id_affectation ? 'bg-black text-white border-black scale-105 shadow-lg' : 'bg-slate-50 border-slate-200 hover:border-black'}`}
                        >
                            <div className="font-black text-[10px] uppercase">{a.module?.code_module}</div>
                            <div className={`text-[8px] font-bold ${suggestedModule?.id_affectation === a.id_affectation ? 'text-teal-400' : 'text-slate-400'}`}>
                                Instructor: {a.formateur?.nom}
                            </div>
                        </button>
                    ))}
                    {besoinsDuGroupe.length === 0 && <p className="text-center text-[10px] font-bold text-gray-300 py-10 uppercase">Tout est planifié ! ✅</p>}
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <div className="flex-1 space-y-6">
                <div className="bg-white border-b-4 border-black p-6 shadow-xl rounded-2xl flex justify-between items-center">
                    <h1 className="text-2xl font-black uppercase italic text-[#006064]">Smart Scheduler S{selectedWeek}</h1>
                    <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-black">
                        {[1, 2, 3, 4].map(n => <button key={n} onClick={() => setSelectedWeek(n)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === n ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}>S{n}</button>)}
                    </div>
                    <select className="border-2 border-black p-2 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div className="bg-white p-2 border-2 border-black shadow-2xl rounded-3xl overflow-hidden relative">
                    {/* طبقة الإرشاد (Suggestion Overlay) */}
                    {suggestedModule && (
                        <div className="absolute top-2 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase animate-bounce z-50 shadow-lg">
                            ✨ Mode Suggestion: {suggestedModule.formateur.nom}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 table-fixed min-w-[1000px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] uppercase">
                                    <th className="p-4 w-32 bg-[#006064]">S{selectedWeek}</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="p-2 border border-gray-600">{h}-{HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-28">
                                            <td className="bg-gray-50 border border-gray-400 text-center font-black text-[10px] uppercase text-gray-400">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    return <td key={h} colSpan={span} className="border-2 border-black bg-teal-100 text-center p-2">
                                                        <div className="font-black text-[10px] uppercase border-b border-black/10 w-full mb-1">{seance.affectation?.module?.code_module}</div>
                                                        <div className="text-[10px] font-black uppercase">{seance.affectation?.formateur?.nom}</div>
                                                        <div className="text-[9px] font-black text-blue-800 italic">📍 {seance.salle?.nom_local}</div>
                                                    </td>
                                                }

                                                // هل هذا السلوت ممكن؟ (Glowing Logic)
                                                const possible = isSlotPossible(j, h);
                                                const isSel = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);

                                                return (
                                                    <td key={h} 
                                                        onClick={() => handleCellClick(j, h)} 
                                                        className={`border border-gray-300 transition-all cursor-cell relative
                                                            ${possible ? 'bg-green-100/50 hover:bg-green-300 border-2 border-green-500 shadow-inner animate-pulse' : ''}
                                                            ${isSel ? 'bg-yellow-100' : ''}
                                                        `}
                                                    >
                                                        {possible && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-green-700 opacity-30">DISPO</div>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL (HUD) --- */}
            {selection && selection.end && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[3000] p-4 text-black">
                    <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[25px_25px_0px_rgba(0,0,0,1)]">
                        <div className="p-5 bg-black text-white flex justify-between items-center font-black uppercase text-xs italic tracking-widest">
                            <span>Assign S{selectedWeek} • {selection.jour}</span>
                            <button onClick={() => setSelection(null)} className="text-3xl">&times;</button>
                        </div>
                        <div className="p-10 grid grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 border-b-2 pb-2">1. Module Selection</h3>
                                {/* إذا كنا في وضع الاقتراح، المادة ديجا مختارة */}
                                <div className="space-y-2">
                                    {(suggestedModule ? [suggestedModule] : affectations.filter(a => a.groupe?.code_groupe === selectedGroup)).map(a => (
                                        <button key={a.id_affectation} onClick={() => { selection.id_aff = a.id_affectation; setSelection({...selection}); }}
                                            className={`w-full text-left p-4 border-2 font-black text-[10px] ${selection.id_aff === a.id_affectation ? 'bg-black text-white border-black' : 'bg-white border-gray-200'}`}>
                                            {a.module?.code_module} (Prof: {a.formateur?.nom})
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 border-b-2 pb-2 tracking-widest text-center italic">2. Finalize Room</h3>
                                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                                    {/* هنا كنشوفو غير القاعات اللي خاوية فعلياً في هاد الوقت */}
                                    {salles.filter(s => !emploiData.some(seance => seance.id_salle === s.id_salle && seance.jour === selection.jour && parseInt(seance.id_periode) === selectedWeek && seance.heure_debut.substring(0, 5) < selection.end && seance.heure_fin.substring(0, 5) > selection.start)).map(s => (
                                        <button key={s.id_salle} disabled={!selection.id_aff} onClick={() => confirmPlan(selection.id_aff, s.id_salle)}
                                            className={`p-4 border-2 font-black text-[9px] transition-all ${selection.id_aff ? 'bg-white border-black hover:bg-[#00acc1] hover:text-white' : 'opacity-20'}`}>
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
    );
}