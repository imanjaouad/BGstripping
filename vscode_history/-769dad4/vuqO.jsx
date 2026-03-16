import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

const SESSION_COLORS = [
    { bg: 'bg-[#e0f2f1]', border: 'border-[#00796b]' }, 
    { bg: 'bg-[#e3f2fd]', border: 'border-[#1976d2]' }, 
    { bg: 'bg-[#fff3e0]', border: 'border-[#f57c00]' }, 
    { bg: 'bg-[#f3e5f5]', border: 'border-[#7b1fa2]' }, 
    { bg: 'bg-[#f1f8e9]', border: 'border-[#689f38]' }, 
];

export default function EmploiGrid() {
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [selectedGroup, setSelectedGroup] = useState('AA101');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selection, setSelection] = useState(null);

    const nomDuMois = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());

    const fetchData = async () => {
        try {
            const [emp, sal, aff, sett] = await Promise.all([
                fetch('/api/emploi').then(res => res.json()),
                fetch('/api/salles').then(res => res.json()),
                fetch('/api/affectations').then(res => res.json()),
                fetch('/api/settings').then(res => res.json())
            ]);
            setEmploiData(emp || []);
            setSalles(sal || []);
            setAffectations(aff || []);
            setSettings(sett);
            setLoading(false);
        } catch (e) { 
            console.error(e);
            toast.error("Erreur de synchronisation");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePrint = () => { window.print(); };

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    const handleCellClick = (jour, heure) => {
        if (!selection || selection.jour !== jour || selection.end) setSelection({ jour, start: heure, end: null, id_aff: null });
        else setSelection({ ...selection, end: HEURES[HEURES.indexOf(heure) + 1] });
    };

    const getAvailableOptions = () => {
        if (!selection || !selection.end) return { availableSalles: [], availableAffectations: [] };
        const occupied = emploiData.filter(s => 
            parseInt(s.id_periode) === selectedWeek && 
            s.jour.toLowerCase() === selection.jour.toLowerCase() &&
            s.heure_debut.substring(0, 5) < selection.end && 
            s.heure_fin.substring(0, 5) > selection.start
        );
        const occupiedSallesIds = occupied.map(s => parseInt(s.id_salle));
        const occupiedProfsIds = occupied.map(s => s.affectation?.id_formateur).filter(id => id !== null);
        return {
            availableSalles: salles.filter(s => !occupiedSallesIds.includes(parseInt(s.id_salle))),
            availableAffectations: affectations.filter(a => a.groupe?.code_groupe === selectedGroup && !occupiedProfsIds.includes(a.id_formateur))
        };
    };

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" };
        const res = await fetch('/api/emploi/seance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { toast.success("Planifié ! ✅"); setSelection(null); fetchData(); }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">SYSTEM SYNC...</div>;

    const options = getAvailableOptions();
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const totalH = filteredEmploi.reduce((sum, s) => sum + getColSpan(s.heure_debut, s.heure_fin), 0);

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER CONTROLS (Hidden on Print) --- */}
                <div className="bg-white border-b-4 border-black p-6 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center gap-6 print:hidden">
                    <h1 className="text-2xl font-black uppercase italic text-[#006064]">Emploi du Temps</h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === num ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrint} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-all">
                            🖨️ Imprimer l'Officiel
                        </button>
                    </div>

                    <select className="border-2 border-black p-2 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* --- 📄 AREA TO PRINT --- */}
                <div id="printable-area" className="bg-white p-6 border-2 border-black shadow-2xl rounded-sm print:p-0 print:border-none print:shadow-none">
                    
                    {/* Official Document Header (Visible only on print) */}
                    <div className="hidden print:block mb-6">
                        <div className="flex justify-between items-start">
                            <div className="text-left w-1/3">
                                <div className="w-12 h-12 bg-[#006064] text-white flex items-center justify-center font-black italic mb-1">ISTA</div>
                                <div className="text-[8pt] font-bold">Marrakech-Safi</div>
                                <div className="text-[8pt] font-black uppercase">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            </div>
                            <div className="text-center w-1/3">
                                <h2 className="text-[14pt] font-black underline uppercase">Emploi du temps par groupe</h2>
                            </div>
                            <div className="w-1/3"></div>
                        </div>
                        <div className="flex justify-between mt-4 border-b border-black pb-1 text-[9pt]">
                            <div className="italic">Filière: {filteredEmploi[0]?.affectation?.groupe?.filiere?.intitule_filiere || 'Formation Professionnelle'}</div>
                            <div className="font-bold uppercase tracking-tighter">Groupe : {selectedGroup} | Total : {totalH}H</div>
                        </div>
                    </div>

                    {/* THE GRID */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black table-fixed min-w-[1000px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] print:bg-white print:text-black print:text-[8pt]">
                                    <th className="p-4 w-28 border border-gray-500 bg-[#006064] print:bg-gray-100 print:border-black uppercase">Jour \ Horaire</th>
                                    {HEURES.slice(0, -1).map(h => (
                                        <th key={h} className="border border-gray-500 print:border-black p-2 relative">
                                            {h} | {HEURES[HEURES.indexOf(h)+1]}
                                            {/* الخطوط الزرقاء والخضراء كما في الصورة */}
                                            <div className="hidden print:block absolute right-0 top-0 bottom-0 w-[1px] bg-blue-500 opacity-40"></div>
                                            <div className="hidden print:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-500 opacity-20"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-24 print:h-[2.2cm]">
                                            <td className="bg-gray-50 border border-gray-400 print:border-black text-center font-black text-[10px] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = SESSION_COLORS[seance.id_affectation % SESSION_COLORS.length];
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} print:bg-white`}>
                                                            <div className="flex flex-col items-center justify-center text-center h-full p-1 leading-none">
                                                                <div className="font-black text-[10px] text-black border-b border-black/10 w-full uppercase pb-1 mb-1">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[9px] font-black uppercase text-black">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[9px] font-black text-blue-800 italic mt-1">AT {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                const isSel = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className={`border border-gray-300 print:border-black relative ${isSel ? 'bg-yellow-100 animate-pulse' : 'hover:bg-teal-50/50'}`}>
                                                    <div className="hidden print:block absolute right-0 top-0 bottom-0 w-[1px] bg-blue-500 opacity-20"></div>
                                                    <div className="hidden print:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-500 opacity-10"></div>
                                                </td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer (Visible only on print) */}
                    <div className="hidden print:grid grid-cols-3 gap-10 mt-8 text-center border-t border-black pt-6">
                        <div className="flex flex-col h-24 uppercase font-black text-[9pt]">
                            <span>Le Formateur</span>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted pt-1">Signature</div>
                        </div>
                        <div className="flex flex-col h-24 uppercase font-black text-[9pt]">
                            <span>Surveillant Général</span>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted pt-1">Cachet</div>
                        </div>
                        <div className="flex flex-col h-24 uppercase font-black text-[9pt]">
                            <span>Le Directeur</span>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted pt-1">Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL HUD (يبقى كما هو للإضافة) */}
            {selection && selection.end && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[3000] p-4 text-black font-bold">
                    <div className="w-full max-w-4xl bg-white border-4 border-black shadow-[30px_30px_0px_rgba(0,0,0,1)] animate-in zoom-in">
                        <div className="p-5 bg-black text-white flex justify-between items-center font-black uppercase text-xs">
                            <span>Planification S{selectedWeek} • {selection.jour} • {selection.start}-{selection.end}</span>
                            <button onClick={() => setSelection(null)} className="text-3xl">&times;</button>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 border-b pb-2">1. Select Module</h3>
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                                    {options.availableAffectations.map(a => (
                                        <button key={a.id_affectation} onClick={() => { selection.id_aff = a.id_affectation; setSelection({...selection}); }}
                                            className={`w-full text-left p-4 border-2 font-black text-[10px] transition-all ${selection.id_aff === a.id_affectation ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black uppercase'}`}>
                                            {a.module?.code_module} (Prof: {a.formateur?.nom})
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 border-b pb-2 text-center italic">2. Select Salle</h3>
                                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                                    {options.availableSalles.map(s => (
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

            {/* --- 🖨️ CSS نظام الصفحة الواحدة العمودية (Portrait) --- */}
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0.8cm !important; }
                    body { background: white !important; -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
                    nav, .navbar, .print\\:hidden, button, select, .Toaster { display: none !important; }
                    
                    #printable-area { 
                        display: flex !important;
                        flex-direction: column !important;
                        width: 100% !important; 
                        height: 96vh !important;
                        margin: 0 !important; padding: 0 !important;
                        justify-content: space-between;
                    }

                    table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; flex-grow: 1; }
                    th, td { border: 1pt solid black !important; padding: 0 !important; }
                    .font-black { font-size: 8pt !important; }
                }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: black; }
            `}</style>
        </div>
    );
}