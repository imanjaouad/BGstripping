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

    // دالة الطباعة
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
            toast.success(selectedWeek === 1 ? "Mois complet planifié ! ✨" : "Séance ajoutée !");
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
                
                {/* --- HEADER (Hidden on Print) --- */}
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
                        {/* زر الطباعة */}
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
                    
                    {/* Official Document Header (Visible only when printing) */}
                    <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                        <div className="text-left">
                            <div className="font-black text-sm uppercase leading-tight">Office de la Formation Professionnelle</div>
                            <div className="font-black text-sm uppercase italic text-[#006064]">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            <div className="text-[9px] font-bold mt-1">ANNÉE : {settings?.impression_annee || '2023/2024'}</div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-black underline uppercase">Emploi du Temps</h2>
                            <div className="bg-black text-white px-6 py-1 text-xs font-black mt-2 rounded-sm uppercase italic">Groupe : {selectedGroup}</div>
                        </div>
                        <div className="text-right text-[9px] font-black uppercase">
                            Semaine : {selectedWeek} <br/>
                            Mois : {nomDuMois} {anneeActuelle}
                        </div>
                    </div>

                    {/* THE GRID */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black table-fixed min-w-[1000px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] print:bg-gray-100 print:text-black">
                                    <th className="p-4 w-32 border-2 border-black bg-[#006064] print:bg-gray-200">JOUR / S{selectedWeek}</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-black p-2">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-28 print:h-24">
                                            <td className="bg-gray-50 border-2 border-black text-center font-black text-[11px] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = getStyle(seance.id_affectation);
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} print:bg-white`}>
                                                            <div className="flex flex-col items-center justify-center text-center h-full p-2">
                                                                <div className="font-black text-xs text-black border-b border-black/10 w-full mb-1 uppercase leading-none pb-1">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[10px] font-black uppercase text-black leading-none">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[10px] font-black text-blue-900 bg-white/40 px-3 py-0.5 rounded-full mt-2 border border-blue-200">📍 {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                const isSel = selection && selection.jour === j && (selection.end ? (h >= selection.start && h < selection.end) : h === selection.start);
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className={`border border-gray-300 print:border-black ${isSel ? 'bg-yellow-100 animate-pulse' : 'hover:bg-teal-50/50'}`}></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer (Visible only when printing) */}
                    <div className="hidden print:block mt-8">
                        <div className="text-[9px] font-black italic mb-8 border-l-4 border-black pl-3 uppercase tracking-tighter">
                            NB: {settings?.pied_groupe_nb || 'Ce document est une pièce officielle de planification pédagogique.'}
                        </div>
                        <div className="grid grid-cols-3 gap-10 text-center">
                            <div className="border-t-2 border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_gauche || 'Le Formateur'}</div>
                            </div>
                            <div className="border-t-2 border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_milieu || 'Surveillant Général'}</div>
                            </div>
                            <div className="border-t-2 border-black pt-2">
                                <div className="text-[10px] font-black uppercase">{settings?.pied_groupe_droit || 'Le Directeur'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- VACATIONS --- */}
                {holidays.length > 0 && (
                    <div className="bg-white border-2 border-black p-6 shadow-[10px_10px_0px_rgba(0,0,0,1)] rounded-xl print:hidden">
                        <h3 className="text-xs font-black uppercase text-[#006064] mb-4 border-l-8 border-[#006064] pl-4">Événements {nomDuMois}</h3>
                        <div className="flex gap-4">{holidays.map((v, i) => (<div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3"><span className="bg-[#00acc1] text-white p-1 rounded font-black text-[10px]">{v.jours}</span><span className="text-[10px] font-black uppercase">{v.nom}</span></div>))}</div>
                    </div>
                )}
            </div>

                        {/* --- 🖨️ CSS الخاص بالطباعة الإدارية الاحترافية --- */}
            <style>{`
                @media print {
                    /* 1. إخفاء العناصر غير الضرورية */
                    body { background: white !important; font-size: 9pt !important; }
                    nav, .navbar, .print\\:hidden, button, select { display: none !important; }
                    
                    /* 2. ضبط الحاوية لتأخذ الورقة كاملة */
                    #printable-area { 
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100% !important; 
                        height: 98% !important; /* لضمان عدم الخروج لورقة ثانية */
                        border: none !important; 
                        box-shadow: none !important; 
                        padding: 0 !important;
                        margin: 0 !important;
                        display: flex;
                        flex-direction: column;
                    }

                    /* 3. ضغط الجدول ليناسب الارتفاع */
                    table { 
                        width: 100% !important; 
                        table-layout: fixed !important; 
                        border-collapse: collapse !important;
                        flex-grow: 1; /* كياخد المساحة المتبقية */
                    }

                    th, td { 
                        border: 1.5pt solid black !important; 
                        padding: 2px !important; 
                        word-wrap: break-word !important;
                    }

                    /* تقليص طول السطر ليناسب الورقة */
                    tr { height: auto !important; }
                    tbody tr { height: 12% !important; } /* تقسيم الارتفاع على الأيام الستة */

                    /* 4. إعدادات الصفحة (أفقي A4) */
                    @page { 
                        size: A4 landscape; 
                        margin: 0.5cm !important; 
                    }

                    /* 5. تصغير الخطوط داخل الخلايا المبرمجة */
                    .font-black { font-size: 8pt !important; }
                    .text-[10px] { font-size: 7pt !important; }
                }

                /* ستايل للشاشة العادية */
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: black; }
            `}
            </style>

            <style>{`
                @media print {
                    body { background: white !important; }
                    .navbar, .print\\:hidden { display: none !important; }
                    #printable-area { border: none !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; }
                    @page { size: A4 landscape; margin: 1cm; }
                }
            `}</style>
        </div>
    );
}