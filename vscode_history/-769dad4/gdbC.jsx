import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function EmploiGrid() {
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [settings, setSettings] = useState(null); // جلب إعدادات البروفايل
    const [loading, setLoading] = useState(true);
    
    const [selectedGroup, setSelectedGroup] = useState('AA101');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selection, setSelection] = useState(null);

    const nomDuMois = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());

    const fetchData = async () => {
        try {
            const [emp, sal, aff, set] = await Promise.all([
                fetch('/api/emploi').then(res => res.json()),
                fetch('/api/salles').then(res => res.json()),
                fetch('/api/affectations').then(res => res.json()),
                fetch('/api/settings').then(res => res.json())
            ]);
            setEmploiData(emp || []);
            setSalles(sal || []);
            setAffectations(aff || []);
            setSettings(set);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- دالة الطباعة السحرية ---
    const handlePrint = () => {
        window.print();
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
        if (res.ok) { toast.success("S1 synchronisée sur le mois ! ✨"); setSelection(null); fetchData(); }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">GENERATING PRINT ENGINE...</div>;

    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER CONTROLS (Hide when printing) --- */}
                <div className="bg-white border-b-4 border-black p-6 shadow-xl rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-6 print:hidden">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic text-[#006064]">Planning {nomDuMois}</h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Gestion Hebdomadaire</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === num ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>

                        {/* زر الطباعة الإبداعي */}
                        <button 
                            onClick={handlePrint}
                            className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-lg flex items-center gap-2 transition-all active:scale-95"
                        >
                            🖨️ Imprimer l'Emploi
                        </button>
                    </div>

                    <select className="border-2 border-black p-2 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* --- 📄 AREA TO PRINT (Official Layout) --- */}
                <div id="printable-area" className="bg-white p-4 border-2 border-black shadow-2xl rounded-sm print:shadow-none print:border-none print:p-0">
                    
                    {/* Official Document Header (Visible only when printing) */}
                    <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                        <div className="text-left">
                            <div className="font-black text-sm uppercase">Office de la Formation Professionnelle</div>
                            <div className="font-black text-sm uppercase italic text-[#006064]">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            <div className="text-[10px] font-bold mt-1 uppercase">Année: {settings?.impression_annee || '2023/2024'}</div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-black underline uppercase">Emploi du Temps</h2>
                            <div className="bg-black text-white px-4 py-1 text-xs font-black mt-2 rounded-sm">
                                GROUPE : {selectedGroup}
                            </div>
                        </div>
                        <div className="text-right text-[10px] font-bold uppercase">
                            Semaine : {selectedWeek} <br/>
                            Mois : {nomDuMois}
                        </div>
                    </div>

                    {/* The Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black table-fixed">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] print:bg-gray-200 print:text-black">
                                    <th className="border-2 border-black p-3 w-32 uppercase">Jour</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-black p-2">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-28 print:h-20">
                                            <td className="bg-gray-100 border-2 border-black text-center font-black text-[10px] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    return (
                                                        <td key={h} colSpan={span} className="border-2 border-black bg-teal-50 text-center p-2 print:bg-white">
                                                            <div className="flex flex-col items-center justify-center text-center h-full">
                                                                <div className="font-black text-[11px] text-black border-b border-black/10 w-full mb-1 uppercase tracking-tighter leading-none pb-1">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[10px] font-black uppercase text-black leading-none">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[10px] font-black text-blue-800 mt-2">📍 {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={h} className="border border-gray-300 print:border-black"></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer (Visible only when printing) */}
                    <div className="hidden print:block mt-8">
                        <div className="text-[10px] font-black italic mb-6 border-l-4 border-black pl-3">
                            NB: {settings?.pied_groupe_nb || 'Ce document est une pièce officielle de planification.'}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="border-t border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_gauche || 'Formateur'}</div>
                                <div className="h-20 italic text-[9px] text-gray-300 flex items-end justify-center">Signature</div>
                            </div>
                            <div className="border-t border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_milieu || 'Surveillant Général'}</div>
                                <div className="h-20 italic text-[9px] text-gray-300 flex items-end justify-center">Cachet</div>
                            </div>
                            <div className="border-t border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_droit || 'Directeur'}</div>
                                <div className="h-20 italic text-[9px] text-gray-300 flex items-end justify-center">Signature</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS لضبط الطباعة */}
            <style>{`
                @media print {
                    body { background: white !important; margin: 0; padding: 0; }
                    .navbar, .print\\:hidden { display: none !important; }
                    #printable-area { border: none !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; }
                    @page { size: A4 landscape; margin: 1cm; }
                }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: black; }
            `}</style>
        </div>
    );
}