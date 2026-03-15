import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

export default function FormateurView() {
    const [emploiData, setEmploiData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // جلب معلومات الأستاذ من الجلسة (localStorage)
    const instructorId = localStorage.getItem('userId'); 
    const instructorName = localStorage.getItem('userName');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/emploi')
            .then(res => res.json())
            .then(data => {
                // فلترة لومبلوا باش يبانو غير السوايع ديال هاد الأستاذ بوحدو
                const myOnly = data.filter(s => parseInt(s.affectation?.id_formateur) === parseInt(instructorId));
                setEmploiData(myOnly);
                setLoading(false);
            });
    }, [instructorId]);

    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return endIdx - startIdx;
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-[#006064]">CHARGEMENT DE VOTRE PLANNING...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-black">
            {/* Header الأستاذ */}
            <div className="bg-[#006064] text-white p-6 shadow-xl flex justify-between items-center border-b-4 border-black">
                <div>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter text-teal-300">Mon Espace de Travail</h1>
                    <p className="text-white text-sm font-bold uppercase tracking-widest">Formateur : {instructorName}</p>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-black text-white px-4 py-2 rounded-lg font-black text-[10px] border border-white/20 hover:bg-red-600 transition-all">DECONNEXION</button>
            </div>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* إحصائيات سريعة للأستاذ */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_black] text-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre de séances</span>
                        <div className="text-4xl font-black">{emploiData.length}</div>
                    </div>
                    <div className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_#006064] text-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Groupes pris en charge</span>
                        <div className="text-4xl font-black text-[#006064]">
                            {[...new Set(emploiData.map(s => s.affectation?.groupe?.code_groupe))].length}
                        </div>
                    </div>
                </div>

                {/* جدول الحصص الشخصي */}
                <div className="bg-white p-2 border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden">
                    <table className="w-full border-collapse border border-gray-300 table-fixed">
                        <thead>
                            <tr className="bg-black text-white font-black text-[9px] uppercase tracking-widest">
                                <th className="p-4 w-24">Jour</th>
                                {HEURES.slice(0, -1).map(h => <th key={h} className="border border-white/10 p-1">{h} - {HEURES[HEURES.indexOf(h)+1]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {JOURS.map(j => {
                                let skip = 0;
                                return (
                                    <tr key={j} className="h-20">
                                        <td className="bg-slate-50 border border-slate-300 text-center font-black text-[10px] uppercase text-gray-400">{j}</td>
                                        {HEURES.slice(0, -1).map(h => {
                                            if (skip > 0) { skip--; return null; }
                                            const seance = emploiData.find(x => x.jour === j && x.heure_debut.startsWith(h));
                                            if (seance) {
                                                const span = getColSpan(seance.heure_debut, seance.heure_fin);
                                                skip = span - 1;
                                                return (
                                                    <td key={h} colSpan={span} className="border-2 border-black bg-teal-50 text-center p-1">
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <div className="font-black text-[11px] uppercase text-[#006064] border-b border-black/10 w-full mb-1">{seance.affectation.module.code_module}</div>
                                                            <div className="text-[10px] font-black uppercase text-black leading-none">Groupe: {seance.affectation.groupe.code_groupe}</div>
                                                            <div className="text-[9px] font-black text-blue-800 mt-2 bg-white/50 px-2 rounded-full">📍 {seance.salle.nom_local}</div>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            return <td key={h} className="border border-slate-100"></td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}