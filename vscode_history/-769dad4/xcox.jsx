import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function EmploiGrid() {
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [selectedGroup, setSelectedGroup] = useState('AA101');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selection, setSelection] = useState(null);

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
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePrint = () => { window.print(); };

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    // حساب مجموع الساعات لهذا القسم في هذه السيمانة
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const totalHeures = filteredEmploi.reduce((sum, s) => sum + getColSpan(s.heure_debut, s.heure_fin), 0);

    if (loading) return <div className="p-40 text-center font-black animate-pulse">Chargement de l'interface officielle...</div>;

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-4">
                
                {/* --- HEADER CONTROLS (Hidden on Print) --- */}
                <div className="bg-white border-b-4 border-[#006064] p-4 shadow-md rounded-xl flex justify-between items-center gap-4 print:hidden">
                    <h1 className="text-xl font-black uppercase text-[#006064]">Gestion de l'emploi</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-3 py-1 rounded-lg text-xs font-black ${selectedWeek === num ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}>
                                    S{num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrint} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xs uppercase shadow-lg">
                            🖨️ IMPRIMER L'OFFICIEL
                        </button>
                    </div>
                    <select className="border-2 border-black p-1.5 rounded-xl font-black text-xs uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* --- 📄 AREA TO PRINT (Official Portrait Style) --- */}
                <div id="printable-area" className="bg-white p-6 border border-gray-300 shadow-2xl print:p-0 print:border-none print:shadow-none">
                    
                    {/* Official Document Header (Matches Image) */}
                    <div className="hidden print:block mb-6">
                        <div className="flex justify-between items-start">
                            <div className="text-left">
                                {/* لوغو OFPPT افتراضي */}
                                <div className="w-16 h-16 border-2 border-gray-400 flex items-center justify-center font-black text-xs mb-2">LOGO</div>
                                <div className="text-xs font-bold leading-tight">Marrakech-Safi</div>
                                <div className="text-xs font-black uppercase">{settings?.efp_name || 'ISTA BENGUERIR'}</div>
                            </div>
                            <div className="text-center">
                                <h1 className="text-xl font-medium mt-4">Emploi du temps par groupe</h1>
                            </div>
                            <div className="w-16"></div> {/* Spacer */}
                        </div>
                        <div className="flex justify-between mt-4 border-b border-black pb-1 text-[9pt]">
                            <div className="font-medium italic">Filière : {filteredEmploi[0]?.affectation?.groupe?.filiere?.intitule_filiere || 'Électricité d-Entretien Industriel'}</div>
                            <div className="font-bold">Groupe : {selectedGroup} | Total : {totalHeures}H</div>
                        </div>
                    </div>

                    {/* THE GRID */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-black table-fixed">
                            <thead>
                                <tr className="text-[9pt] font-medium">
                                    <th className="border border-black p-1 w-20 bg-gray-50 uppercase">Jour \ Horaire</th>
                                    {HEURES.slice(0, -1).map(h => (
                                        <th key={h} className="border border-black p-1 relative">
                                            {h} | {HEURES[HEURES.indexOf(h)+1]}
                                            {/* الخطوط الملونة (إبداع) */}
                                            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-blue-500 opacity-50"></div>
                                            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-500 opacity-30"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-16 print:h-[2.2cm]"> 
                                            <td className="border border-black text-left pl-2 font-medium text-[10pt] bg-gray-50">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const seance = filteredEmploi.find(s => s.jour === j && s.heure_debut.startsWith(h));
                                                if (seance) {
                                                    const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                    skip = span - 1;
                                                    return (
                                                        <td key={h} colSpan={span} className="border border-black bg-white text-center p-1">
                                                            <div className="flex flex-col items-center justify-center h-full leading-tight">
                                                                <div className="font-bold text-[10pt] uppercase">{seance.affectation?.formateur?.nom}</div>
                                                                <div className="text-[9pt] italic mt-1">AT {seance.salle?.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={h} className="border border-black relative">
                                                    {/* تكرار الخطوط الملونة في الخلايا الفارغة */}
                                                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-blue-500 opacity-20"></div>
                                                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-500 opacity-10"></div>
                                                </td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Official Footer (Matches Image) */}
                    <div className="hidden print:grid grid-cols-3 gap-10 mt-8 text-center border-t border-black pt-6">
                        <div className="flex flex-col h-24">
                            <div className="text-[9pt] font-black uppercase">Le Formateur</div>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted border-gray-400 pt-1">Signature</div>
                        </div>
                        <div className="flex flex-col h-24">
                            <div className="text-[9pt] font-black uppercase">Le Surveillant Général</div>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted border-gray-400 pt-1">Cachet</div>
                        </div>
                        <div className="flex flex-col h-24">
                            <div className="text-[9pt] font-black uppercase">Le Directeur</div>
                            <div className="mt-auto italic text-[8pt] text-gray-300 border-t border-dotted border-gray-400 pt-1">Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 🪄 CSS نظام الطباعة الرسمي (Portrait + One Page) --- */}
            <style>{`
                @media print {
                    /* إرغام الطابعة على Portrait (واقفة) */
                    @page { 
                        size: A4 portrait; 
                        margin: 0.8cm; 
                    }
                    
                    body { background: white !important; margin: 0; padding: 0; font-family: Arial, sans-serif !important; }
                    nav, .navbar, .print\\:hidden, button, select { display: none !important; }

                    #printable-area { 
                        display: flex !important;
                        flex-direction: column !important;
                        width: 100% !important;
                        height: 96vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        justify-content: space-between;
                    }

                    table { 
                        width: 100% !important; 
                        table-layout: fixed !important; 
                        border-collapse: collapse !important;
                    }

                    th, td { 
                        border: 0.5pt solid black !important; 
                        padding: 0 !important; 
                    }

                    /* الألوان المائية للخطوط العمودية في الطباعة */
                    th div, td div { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}