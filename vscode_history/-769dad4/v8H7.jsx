import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// --- الثوابت الإدارية ---
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

const CALENDRIER_VACANCES = [
    { mois: 'janvier', jours: '11', nom: 'Manifeste Indépendance' },
    { mois: 'janvier', jours: '14', nom: 'Nouvel an Amazigh' },
    { mois: 'janvier', jours: '19 au 26', nom: 'Vacances Mi-Semestre' },
    { mois: 'mars', jours: '15 au 22', nom: 'Vacances Printemps' },
];

const SESSION_COLORS = [
    { bg: 'bg-[#e0f2f1]', border: 'border-[#00796b]' }, 
    { bg: 'bg-[#e3f2fd]', border: 'border-[#1976d2]' }, 
    { bg: 'bg-[#fff3e0]', border: 'border-[#f57c00]' }, 
    { bg: 'bg-[#f3e5f5]', border: 'border-[#7b1fa2]' }, 
    { bg: 'bg-[#f1f8e9]', border: 'border-[#689f38]' }, 
    { bg: 'bg-[#fff9c4]', border: 'border-[#fbc02d]' }, 
    { bg: 'bg-[#ffebee]', border: 'border-[#d32f2f]' }, 
    { bg: 'bg-[#fce4ec]', border: 'border-[#c2185b]' }, 
    { bg: 'bg-[#e8eaf6]', border: 'border-[#303f9f]' }, 
    { bg: 'bg-[#f5f5f5]', border: 'border-[#616161]' }, 
];

export default function EmploiGrid() {
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [settings, setSettings] = useState(null); // لإحضار معلومات المؤسسة والطباعة
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

    const getStyle = (idAff) => SESSION_COLORS[idAff % SESSION_COLORS.length];

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
        if (res.ok) {
            toast.success("Séance ajoutée !");
            setSelection(null);
            fetchData();
        }
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">ENGINE BOOTING...</div>;

    const options = getAvailableOptions();
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const holidays = CALENDRIER_VACANCES.filter(v => v.mois === nomDuMois.toLowerCase());

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="bg-white border-b-4 border-black p-6 shadow-md rounded-xl flex flex-col lg:flex-row justify-between items-center gap-6 print:hidden">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic text-[#006064]">Planning {nomDuMois}</h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">S{selectedWeek} • Institutional Workflow</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${selectedWeek === num ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrint} className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all">
                            🖨️ Imprimer
                        </button>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-2xl border-2 border-black">
                        <select className="bg-transparent font-black text-xs outline-none uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- AREA TO PRINT (Official Document) --- */}
                <div id="printable-area" className="bg-white p-4 border-2 border-black shadow-2xl rounded-sm print:p-0 print:border-none print:shadow-none">
                    
                    {/* Official Document Header */}
                    <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-2 mb-4">
                        <div className="text-left">
                            <div className="font-black text-[10px] uppercase leading-tight">Office de la Formation Professionnelle</div>
                            <div className="font-black text-[10px] uppercase italic text-[#006064]">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            <div className="text-[9px] font-bold mt-1 uppercase">Année : {settings?.impression_annee || '2023/2024'}</div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-black underline uppercase">Emploi du Temps</h2>
                            <div className="text-[10px] font-black italic">Groupe : {selectedGroup} | S{selectedWeek}</div>
                        </div>
                        <div className="text-right text-[9px] font-black uppercase">
                            {nomDuMois} {anneeActuelle}
                        </div>
                    </div>

                    {/* THE GRID */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black table-fixed print:w-[94%] print:mx-auto">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] print:text-black print:bg-gray-100">
                                    <th className="p-2 w-20 border-2 border-black bg-[#006064] print:bg-gray-200">Jour</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-black p-1 text-[9px]">{h}-{HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-24 print:h-16">
                                            <td className="bg-gray-50 border-2 border-black text-center font-black text-[9px] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = getStyle(seance.id_affectation);
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} print:bg-white`}>
                                                            <div className="flex flex-col items-center justify-center text-center h-full p-1">
                                                                <div className="font-black text-[9px] text-black border-b border-black/10 w-full uppercase leading-none pb-1">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[8px] font-black uppercase text-black leading-none mt-1">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[8px] font-black text-blue-900 mt-1">📍 {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                const isSel = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className={`border border-gray-300 print:border-black ${isSel ? 'bg-yellow-100' : ''}`}></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer */}
                    <div className="hidden print:grid grid-cols-3 gap-10 mt-6 text-center print:w-[94%] print:mx-auto">
                        <div className="border-t border-black pt-1 text-[9px] font-black uppercase">{settings?.pied_groupe_gauche || 'Formateur'}</div>
                        <div className="border-t border-black pt-1 text-[9px] font-black uppercase">{settings?.pied_groupe_milieu || 'Surveillant'}</div>
                        <div className="border-t border-black pt-1 text-[9px] font-black uppercase">{settings?.pied_groupe_droit || 'Directeur'}</div>
                    </div>
                </div>
            </div>

            {/* --- 🖨️ نظام التحكم في العرض والحجم (Compact Mode) --- */}
            <style>{`
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; }
                    .navbar, .print\\:hidden, nav { display: none !important; }
                    
                    /* تحجيم الحاوية (نقصنا العرض لـ 94%) */
                    #printable-area { 
                        width: 100% !important;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    /* ضغط الجدول ليكون أصغر */
                    table { 
                        width: 94% !important; /* الجدول غايكون مجموع للوسط */
                        margin: 0 auto !important; 
                        border-collapse: collapse !important; 
                    }

                    th, td { 
                        border: 0.5pt solid black !important; 
                        height: 1.1cm !important; /* ارتفاع مضغوط */
                        padding: 1px !important;
                    }

                    /* تصغير نصوص الهيدر لربح المساحة */
                    .print\\:flex { width: 94% !important; margin: 0 auto 0.5cm auto !important; }

                    /* إعدادات الصفحة */
                    @page { size: A4 landscape; margin: 0.6cm; }

                    /* ضبط الخطوط لتكون Compact */
                    .font-black { font-size: 8pt !important; }
                    .text-[8px], .text-[9px], .text-[10px] { font-size: 7pt !important; }
                }

                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: black; }
            `}</style>
        </div>
    );
}