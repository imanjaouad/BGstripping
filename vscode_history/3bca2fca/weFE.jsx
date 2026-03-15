import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function FormateurView() {
    const [emploiData, setEmploiData] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [viewMode, setViewMode] = useState('perso'); // 'perso' أو 'groupes'
    const [loading, setLoading] = useState(true);

    const instructorId = localStorage.getItem('userId'); // الـ ID اللي تجاب من الداتابيز
    const instructorName = localStorage.getItem('userName');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const [eRes, gRes] = await Promise.all([
                fetch('/api/emploi').then(r => r.json()),
                fetch('/api/groupes').then(r => r.json())
            ]);
            setEmploiData(eRes);
            setGroupes(gRes);
            if (gRes.length > 0) setSelectedGroup(gRes[0].code_groupe);
            setLoading(false);
        };
        fetchData();
    }, []);

    // 1. فلترة لومبلوا الشخصي للأستاذ (فقط حصصه هو)
    const mySchedule = emploiData.filter(s => parseInt(s.affectation?.id_formateur) === parseInt(instructorId));
    
    // 2. فلترة لومبلوا الأقسام (للاستشارة فقط)
    const groupSchedule = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup);

    if (loading) return <div className="p-40 text-center font-black animate-pulse">SYNCHRONISATION DU PROFIL...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-black">
            {/* Header */}
            <div className="bg-[#006064] text-white p-6 shadow-2xl flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter">Instructor Workspace</h1>
                    <p className="text-teal-300 text-[10px] font-bold uppercase tracking-widest">Connecté : {instructorName}</p>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-white/10 px-4 py-2 rounded-lg text-xs font-black border border-white/20 hover:bg-red-600 transition-all">LOGOUT</button>
            </div>

            {/* View Selector */}
            <div className="flex bg-white border-b shadow-sm">
                <button onClick={() => setViewMode('perso')} className={`flex-1 p-4 font-black text-xs uppercase transition-all ${viewMode === 'perso' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}>📅 Mon Emploi du Temps</button>
                <button onClick={() => setViewMode('groupes')} className={`flex-1 p-4 font-black text-xs uppercase transition-all ${viewMode === 'groupes' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}>🔍 Consulter les Groupes</button>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                {viewMode === 'perso' ? (
                    <div className="bg-white p-6 border-4 border-black shadow-[15px_15px_0px_black] rounded-sm">
                        <h2 className="text-xl font-black uppercase text-indigo-600 mb-6 border-l-8 border-indigo-600 pl-4 italic">Récapitulatif Personnel</h2>
                        <EmploiGrid data={mySchedule} showType="groupe" />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-64 bg-white border-2 border-black p-4 rounded-xl shadow-lg h-fit">
                            <h3 className="font-black text-[10px] uppercase text-slate-400 mb-4 border-b pb-2">Liste des Groupes</h3>
                            <div className="space-y-1 max-h-[50vh] overflow-y-auto custom-scroll">
                                {groupes.map(g => (
                                    <button key={g.id_groupe} onClick={() => setSelectedGroup(g.code_groupe)}
                                        className={`w-full text-left p-3 rounded-lg font-black text-xs transition-all ${selectedGroup === g.code_groupe ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}>
                                        {g.code_groupe}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-6 border-4 border-black shadow-[15px_15px_0px_black] rounded-sm">
                            <h2 className="text-xl font-black uppercase text-indigo-600 mb-6 border-l-8 border-indigo-600 pl-4 italic">Emploi : {selectedGroup}</h2>
                            <EmploiGrid data={groupSchedule} showType="formateur" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// كومبوننت الجدول (للقراءة فقط)
function EmploiGrid({ data, showType }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black table-fixed">
                <thead>
                    <tr className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest">
                        <th className="p-3 w-24 border border-white/10">Jour</th>
                        {HEURES.slice(0, -1).map(h => <th key={h} className="border border-white/10 p-1">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {JOURS.map(j => (
                        <tr key={j} className="h-20">
                            <td className="bg-slate-50 border border-slate-300 text-center font-black text-[10px] uppercase text-gray-400">{j}</td>
                            {HEURES.slice(0, -1).map(h => {
                                const s = data.find(x => x.jour === j && x.heure_debut.startsWith(h));
                                if (s) {
                                    return (
                                        <td key={h} className="border-2 border-black bg-indigo-50 text-center p-1">
                                            <div className="font-black text-[10px] uppercase text-indigo-700 leading-none mb-1">{s.affectation.module.code_module}</div>
                                            <div className="text-[9px] font-bold uppercase text-slate-800 leading-none">
                                                {showType === 'groupe' ? `G: ${s.affectation.groupe.code_groupe}` : `Prof: ${s.affectation.formateur.nom}`}
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 mt-2 bg-white/50 px-1 rounded">📍 {s.salle.nom_local}</div>
                                        </td>
                                    );
                                }
                                return <td key={h} className="border border-slate-200"></td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}