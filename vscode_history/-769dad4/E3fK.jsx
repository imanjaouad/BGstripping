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

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">ADAPTING LAYOUT...</div>;

    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const holidays = CALENDRIER_VACANCES.filter(v => v.mois === nomDuMois.toLowerCase());

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-4">
                
                {/* --- HEADER CONTROLS --- */}
                <div className="bg-white border-b-4 border-black p-4 shadow-md rounded-xl flex justify-between items-center gap-4 print:hidden">
                    <h1 className="text-xl font-black uppercase text-[#006064]">Planning {nomDuMois}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black ${selectedWeek === num ? 'bg-black text-white' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrint} className="bg-[#00acc1] text-white px-4 py-2 rounded-xl font-black text-xs uppercase shadow-lg">
                            🖨️ IMPRIMER (1 PAGE)
                        </button>
                    </div>
                    <select className="border-2 border-black p-1.5 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* --- 📄 AREA TO PRINT (Official Document) --- */}
                <div id="printable-area" className="bg-white border-2 border-black shadow-2xl rounded-sm">
                    
                    {/* Header Document */}
                    <div className="header-print">
                        <div className="text-left">
                            <div className="font-black text-[7pt] uppercase leading-tight">Office de la Formation Professionnelle</div>
                            <div className="font-black text-[8pt] uppercase italic text-[#006064]">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            <div className="text-[6pt] font-bold mt-0.5">ANNÉE : {settings?.impression_annee || '2023/2024'}</div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-[14pt] font-black underline uppercase leading-none">Emploi du Temps</h2>
                            <div className="bg-black text-white px-4 py-0.5 text-[9pt] font-black mt-1 rounded-sm uppercase inline-block italic">Groupe : {selectedGroup}</div>
                        </div>
                        <div className="text-right text-[7pt] font-black uppercase">
                            Semaine : {selectedWeek} <br/>
                            Mois : {nomDuMois} {anneeActuelle}
                        </div>
                    </div>

                    {/* The Table */}
                    <div className="table-container-print">
                        <table className="w-full border-collapse border-2 border-black table-fixed">
                            <thead>
                                <tr className="bg-black text-white font-black text-[8pt]">
                                    <th className="p-1 w-16 border-2 border-black bg-[#006064]">Jour</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border-2 border-black p-0.5">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="row-print">
                                            <td className="bg-gray-50 border-2 border-black text-center font-black text-[7pt] uppercase">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    const style = getStyle(seance.id_affectation);
                                                    return (
                                                        <td key={h} colSpan={span} className={`border-2 border-black ${style.bg} text-center`}>
                                                            <div className="flex flex-col items-center justify-center h-full p-0.5">
                                                                <div className="font-black text-[8pt] text-black border-b border-black/10 w-full uppercase leading-none pb-0.5">{seance.affectation?.module?.code_module}</div>
                                                                <div className="text-[7pt] font-black uppercase text-black leading-none mt-0.5">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[7pt] font-black text-blue-900 mt-0.5">📍 {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={h} onClick={() => handleCellClick(j, h)} className="border border-gray-300"></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="footer-print">
                        <div className="text-[7pt] font-black italic mb-2 border-l-4 border-black pl-2 uppercase">
                            NB: {settings?.pied_groupe_nb || 'Document officiel de planification.'}
                        </div>
                        <div className="grid grid-cols-3 gap-10 text-center">
                            <div className="border-t border-black pt-1">
                                <div className="text-[8pt] font-black uppercase">Le Formateur</div>
                                <div className="h-8"></div>
                            </div>
                            <div className="border-t border-black pt-1">
                                <div className="text-[8pt] font-black uppercase">Surveillant Général</div>
                                <div className="h-8"></div>
                            </div>
                            <div className="border-t border-black pt-1">
                                <div className="text-[8pt] font-black uppercase">Le Directeur</div>
                                <div className="h-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 🪄 CSS السحر لجمع لومبلوا فـ ورقة وحدة Landscape --- */}
            <style>{`
                @media print {
                    /* إرغام الطابعة على Landscape */
                    @page { size: A4 landscape; margin: 0.5cm; }
                    
                    body { background: white !important; margin: 0; padding: 0; }
                    nav, .navbar, .print\\:hidden, button, select { display: none !important; }

                    /* ضبط الحاوية لتشغل 100% من طول الورقة */
                    #printable-area { 
                        display: flex !important;
                        flex-direction: column !important;
                        height: 96vh !important; /* فرض الطول الكلي */
                        width: 100% !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    .header-print { display: flex !important; justify-content: space-between; margin-bottom: 5px; }
                    .table-container-print { flex-grow: 1 !important; display: flex; }
                    table { height: 100% !important; width: 100% !important; table-layout: fixed !important; }
                    
                    .row-print { height: 14% !important; } /* تقسيم الطول على 6 أيام */
                    
                    .footer-print { display: block !important; margin-top: 10px; }

                    /* تصغير الخطوط لضمان عدم التمدد */
                    .font-black { font-size: 7.5pt !important; }
                    td div { line-height: 1 !important; }
                }

                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: black; }
            `}</style>
        </div>
    );
}