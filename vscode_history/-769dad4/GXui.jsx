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
    const anneeActuelle = new Date().getFullYear();

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
            toast.error("Erreur de synchronisation SQL");
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

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" };
        const res = await fetch('/api/emploi/seance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { toast.success("Planifié !"); setSelection(null); fetchData(); }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">PREPARING PORTRAIT...</div>;

    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-4">
                
                {/* --- HEADER (Hidden on Print) --- */}
                <div className="bg-white border-b-4 border-black p-4 shadow-md rounded-xl flex justify-between items-center gap-4 print:hidden">
                    <h1 className="text-xl font-black uppercase text-[#006064]">Planning {nomDuMois}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-3 py-1 rounded-lg text-xs font-black ${selectedWeek === num ? 'bg-black text-white' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrint} className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black text-xs uppercase">
                            🖨️ Imprimer Portrait
                        </button>
                    </div>
                    <select className="border-2 border-black p-1.5 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* --- 📄 AREA TO PRINT (Portrait Mode) --- */}
                <div id="printable-area" className="bg-white p-2 border-2 border-black shadow-lg rounded-sm print:p-0 print:border-none print:shadow-none">
                    
                    {/* Official Header */}
                    <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-2 mb-2">
                        <div className="text-left w-1/3">
                            <div className="font-black text-[7pt] uppercase leading-tight">OFPPT</div>
                            <div className="font-black text-[8pt] uppercase italic text-[#006064]">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                        </div>
                        <div className="text-center w-1/3">
                            <h2 className="text-[12pt] font-black underline uppercase">Emploi du Temps</h2>
                            <div className="text-[8pt] font-black italic">{selectedGroup} | Semaine {selectedWeek}</div>
                        </div>
                        <div className="text-right w-1/3 text-[7pt] font-black uppercase">
                            {nomDuMois} {anneeActuelle}
                        </div>
                    </div>

                    {/* THE GRID (Condensed) */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black table-fixed">
                            <thead>
                                <tr className="bg-black text-white font-black text-[7pt] print:text-black print:bg-gray-100">
                                    <th className="p-1 w-14 border-2 border-black bg-[#006064] print:bg-gray-200">Jour</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-black p-0.5">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-16 print:h-[2.5cm]">
                                            <td className="bg-gray-50 border-2 border-black text-center font-black text-[7pt] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = SESSION_COLORS[seance.id_affectation % SESSION_COLORS.length];
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} print:bg-white text-center`}>
                                                            <div className="flex flex-col items-center justify-center h-full p-0.5">
                                                                <div className="font-black text-[8pt] text-black border-b border-black/10 w-full uppercase leading-none pb-0.5">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[7pt] font-black uppercase text-black leading-none mt-0.5">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[7pt] font-black text-blue-900 leading-none mt-0.5">S:{seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className="border border-gray-300 print:border-black"></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer */}
                    <div className="hidden print:grid grid-cols-3 gap-4 mt-6 text-center">
                        <div className="border-t border-black pt-1">
                            <div className="text-[7pt] font-black uppercase">Formateur</div>
                            <div className="h-10"></div>
                        </div>
                        <div className="border-t border-black pt-1">
                            <div className="text-[7pt] font-black uppercase">Surveillant</div>
                            <div className="h-10"></div>
                        </div>
                        <div className="border-t border-black pt-1">
                            <div className="text-[7pt] font-black uppercase">Directeur</div>
                            <div className="h-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 🖨️ CSS نظام الصفحة الواحدة العمودية (Portrait) --- */}
            <style>{`
                @media print {
                    /* إعدادات الصفحة Portrait */
                    @page { 
                        size: A4 portrait; 
                        margin: 0.5cm; 
                    }

                    body { background: white !important; -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
                    nav, .navbar, .print\\:hidden, button, select { display: none !important; }
                    
                    #printable-area { 
                        width: 100% !important; 
                        height: auto !important;
                        margin: 0 !important; 
                        padding: 0 !important;
                    }

                    /* ضغط الجدول ليتناسب مع عرض الورقة العمودية */
                    table { 
                        width: 100% !important; 
                        table-layout: fixed !important;
                        border-collapse: collapse !important;
                    }

                    th, td { 
                        border: 0.8pt solid black !important; 
                        padding: 1px !important; 
                        word-wrap: break-word !important; 
                    }

                    /* تصغير الخطوط لأقصى حد ليتناسب العرض */
                    .font-black { font-size: 6.5pt !important; }
                    .text-[7pt], .text-[8pt], .text-[9pt] { font-size: 6pt !important; }
                }
            `}</style>
        </div>
    );
}