import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function StagiaireView() {
    const [groupes, setGroupes] = useState([]);
    const [emploiData, setEmploiData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gRes, eRes] = await Promise.all([
                    fetch('/api/groupes').then(r => r.json()),
                    fetch('/api/emploi').then(r => r.json())
                ]);
                setGroupes(gRes);
                if (gRes.length > 0) setSelectedGroup(gRes[0].code_groupe);
                setEmploiData(eRes);
                setLoading(false);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    // دالة تسجيل الخروج للمتدرب
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.success("Session terminée");
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">ACCÈS SÉCURISÉ...</div>;

    const filteredEmploi = emploiData.filter(s => 
        s.affectation?.groupe?.code_groupe === selectedGroup && 
        parseInt(s.id_periode) === selectedWeek
    );

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    return (
        <div className="flex h-screen bg-[#f1f5f9] font-sans text-black overflow-hidden">
            
            {/* --- SIDEBAR الأقسام (للإختيار) --- */}
            <div className="w-72 bg-[#004d40] flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-white/10 text-center">
                    <div className="text-white font-black text-xl italic mb-1">ISTA</div>
                    <div className="text-teal-400 text-[9px] font-bold uppercase tracking-widest">Espace Consultation</div>
                </div>
                
                <div className="p-4 bg-black/20 text-teal-200 text-[10px] font-black uppercase">Sélectionnez votre Groupe</div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scroll">
                    {groupes.map(g => (
                        <button key={g.id_groupe} onClick={() => setSelectedGroup(g.code_groupe)}
                            className={`w-full text-left p-4 rounded-xl font-black uppercase text-xs transition-all ${selectedGroup === g.code_groupe ? 'bg-white text-[#004d40] shadow-lg scale-105' : 'text-gray-300 hover:bg-white/10'}`}>
                            🎓 {g.code_groupe}
                        </button>
                    ))}
                </div>

                <button onClick={handleLogout} className="p-6 bg-black/40 text-white font-black uppercase text-[10px] hover:bg-red-600 transition-all">
                    🚪 Quitter l'espace
                </button>
            </div>

            {/* --- MAIN AREA: THE TIMETABLE --- */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                <div className="max-w-6xl mx-auto space-y-6">
                    
                    <div className="bg-white p-6 border-b-4 border-[#006064] rounded-xl shadow-md flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">Tableau de bord : {selectedGroup}</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Affichage en temps réel du planning mensuel</p>
                        </div>

                        {/* سلكتور السيمانة للمتدربين */}
                        <div className="flex bg-gray-100 p-1 rounded-xl border-2 border-black">
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} onClick={() => setSelectedWeek(num)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${selectedWeek === num ? 'bg-black text-white' : 'text-gray-400'}`}>
                                    SEM {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* الجدول (للقراءة فقط) */}
                    <div className="bg-white p-2 border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden">
                        <table className="w-full border-collapse border border-gray-300 table-fixed">
                            <thead>
                                <tr className="bg-black text-white font-black text-[9px] uppercase tracking-widest">
                                    <th className="p-4 w-24 border border-gray-800">JOUR / S{selectedWeek}</th>
                                    {HEURES.slice(0, -1).map(h => <th key={h} className="border border-gray-800 p-2">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {JOURS.map(j => {
                                    let skip = 0;
                                    return (
                                        <tr key={j} className="h-24">
                                            <td className="bg-gray-100 border border-gray-300 text-center font-black text-[10px] uppercase text-gray-500">{j}</td>
                                            {HEURES.slice(0, -1).map(h => {
                                                if (skip > 0) { skip--; return null; }
                                                const s = filteredEmploi.find(x => x.jour === j && x.heure_debut.startsWith(h));
                                                if (s) {
                                                    const span = getColSpan(s.heure_debut, s.heure_fin);
                                                    skip = span - 1;
                                                    return (
                                                        <td key={h} colSpan={span} className="border-2 border-black bg-teal-50 text-center p-2">
                                                            <div className="flex flex-col items-center justify-center h-full text-black">
                                                                <div className="font-black text-[10px] uppercase border-b border-black/10 w-full mb-1 pb-1">{s.affectation.module.code_module}</div>
                                                                <div className="text-[9px] font-black uppercase">{s.affectation.formateur.nom}</div>
                                                                <div className="text-[9px] font-black text-blue-800 mt-2 bg-white/50 px-2 rounded-full">📍 {s.salle.nom_local}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={h} className="border border-gray-200"></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #004d40; }`}</style>
        </div>
    );
}