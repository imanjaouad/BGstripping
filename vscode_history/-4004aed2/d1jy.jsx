import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

// --- لائحة العطل الرسمية المأخوذة من وثيقة OFPPT 2025-2026 ---
const CALENDRIER_OFPPT = [
    { mois: 8, jours: '12 et 13', nom: 'Aïd Al Mawlid Annabaoui' }, // Septembre 2025
    { mois: 10, jours: '06', nom: 'Anniversaire de la Marche Verte' }, // Novembre 2025
    { mois: 10, jours: '18', nom: 'Fête de l\'Indépendance' }, // Novembre 2025
    { mois: 11, jours: '07 au 14', nom: 'Vacances du 1er Trimestre' }, // Décembre 2025
    { mois: 0, jours: '01', nom: 'Nouvel an (1er Janvier)' }, // Janvier 2026
    { mois: 0, jours: '11', nom: 'Manifeste de l\'Indépendance' }, // Janvier 2026
    { mois: 0, jours: '14', nom: 'Nouvel an Amazigh' }, // Janvier 2026
    { mois: 0, jours: '25 au 01 fév', nom: 'Vacances de mi-année' }, // Janvier 2026
    { mois: 1, jours: '01', nom: 'Vacances de mi-année (Suite)' }, // Février 2026
    { mois: 2, jours: '15 au 22', nom: 'Vacances du 2ème Trimestre' }, // Mars 2026
    { mois: 2, jours: '29 au 02 chaw', nom: 'Aïd Al Fitr (Estimé)' }, // Mars 2026
    { mois: 4, jours: '01', nom: 'Fête du Travail' }, // Mai 2026
    { mois: 4, jours: '03 au 10', nom: 'Vacances du 3ème Trimestre' }, // Mai 2026
    { mois: 4, jours: '09 au 11', nom: 'Aïd Al Adha (Estimé)' }, // Mai 2026
    { mois: 5, jours: '01', nom: '1er Moharram (1448)' }, // Juin 2026
];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [avancement, setAvancement] = useState([]);
    const [loading, setLoading] = useState(true);

    // تحديد الشهر الحالي
    const dateNow = new Date();
    const moisIndex = dateNow.getMonth(); // 0 = Jan, 1 = Feb...
    const nomMois = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(dateNow);

    // تصفية العطل حسب الشهر الحالي
    const vacancesMois = CALENDRIER_OFPPT.filter(v => v.mois === moisIndex);

    const fetchData = async () => {
        try {
            const [sRes, aRes] = await Promise.all([
                fetch('/api/stats').then(r => r.json()),
                fetch('/api/avancement').then(r => r.json())
            ]);
            setStats(sRes);
            setAvancement(aRes);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-indigo-600">CHARGEMENT DES ANALYTIQUES 2026...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- 📢 ALERT PANEL: VACANCES OFFICIELLES --- */}
                {vacancesMois.length > 0 && (
                    <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_rgba(245,158,11,1)] rounded-sm animate-in slide-in-from-top duration-500">
                        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-400 p-2 border-2 border-black shadow-[4px_4px_0px_black]">
                                    <svg width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M19 19H5V8h14v11zM16 1V3H8V1H6V3H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                                </div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">Agenda Officiel : {nomMois} 2026</h2>
                            </div>
                            <span className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">Alerte DRH</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vacancesMois.map((v, i) => (
                                <div key={i} className="bg-slate-50 border-2 border-slate-200 p-4 flex justify-between items-center group hover:border-black transition-all">
                                    <div>
                                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Interruption de cours</div>
                                        <div className="text-sm font-black text-black uppercase leading-none">{v.nom}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-gray-400">Période</div>
                                        <div className="text-xs font-black text-black">{v.jours} {nomMois.substring(0,3)}.</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {l:'Groupes', v:stats.total_groupes, c:'border-indigo-600'},
                        {l:'Formateurs', v:stats.total_formateurs, c:'border-[#006064]'},
                        {l:'Locaux', v:stats.total_salles, c:'border-orange-500'}
                    ].map((card, i) => (
                        <div key={i} className={`bg-white border-2 border-black p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] border-t-[12px] ${card.c} hover:-translate-y-1 transition-all`}>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{card.l}</span>
                            <div className="text-6xl font-black text-slate-800 mt-2">{card.v}</div>
                        </div>
                    ))}
                </div>

                {/* --- ANALYTICS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white border-2 border-black p-10 h-[400px]">
                        <h3 className="font-black text-xs uppercase mb-8 border-b-2 border-black pb-2 w-fit">Structure du Personnel</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie 
                                    data={[{name:'Permanents', value:stats.total_fp}, {name:'Vacataires', value:stats.total_fv}]} 
                                    innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none"
                                >
                                    <Cell fill="#006064" /><Cell fill="#00acc1" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white border-2 border-black p-10">
                        <h3 className="font-black text-xs uppercase mb-8 border-b-2 border-black pb-2 w-fit">Progression des Modules ⚡</h3>
                        <div className="space-y-6">
                            {avancement.slice(0, 4).map((v, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase text-slate-600">{v.module}</span>
                                        <span className="text-xs font-black text-indigo-600">{v.pourcentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 border border-slate-200">
                                        <div className="h-full bg-black transition-all duration-1000" style={{ width: `${v.pourcentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}