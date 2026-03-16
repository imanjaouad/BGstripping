import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats').then(res => res.json()).then(data => { setStats(data); setLoading(false); });
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.5em]">Analyse du système en cours...</div>;

    const dataPie = [
        { name: 'Permanents (FP)', value: stats.total_fp },
        { name: 'Vacataires (FV)', value: stats.total_fv },
    ];
    const COLORS = ['#006064', '#00acc1']; // التدرج الرسمي للـ Teal

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Official Page Header */}
                <div className="flex justify-between items-end border-l-8 border-[#006064] pl-6 py-2">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tableau de bord de performance</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">ISTA BENGUERIR • Année de formation 2023/2024</p>
                    </div>
                    <div className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Dernière mise à jour: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Structured Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Groupes', val: stats.total_groupes, border: 'border-slate-800' },
                        { label: 'Effectif Formateurs', val: stats.total_formateurs, border: 'border-[#006064]' },
                        { label: 'Capacité Salles', val: stats.total_salles, border: 'border-[#00acc1]' }
                    ].map((card, i) => (
                        <div key={i} className={`bg-white p-8 border-t-4 ${card.border} shadow-sm rounded-sm`}>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{card.label}</span>
                            <div className="text-5xl font-black text-slate-800 mt-2">{card.val}</div>
                        </div>
                    ))}
                </div>

                {/* Analytical Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Pie Chart: Human Resources */}
                    <div className="bg-white p-8 border border-slate-200 shadow-sm rounded-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest border-b-2 border-[#006064] pb-2">Structure des Ressources Humaines</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase italic">Permanents vs Vacataires</span>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataPie} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="#fff" strokeWidth={2}>
                                        {dataPie.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '0px', border: '2px solid #006064', fontWeight: 'bold'}} />
                                    <Legend iconType="rect" formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-600">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Infrastructure */}
                    <div className="bg-white p-8 border border-slate-200 shadow-sm rounded-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest border-b-2 border-slate-800 pb-2">Statistiques de l'Infrastructure</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase italic">Volume Global</span>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Salles', total: stats.total_salles },
                                    { name: 'Groupes', total: stats.total_groupes },
                                    { name: 'Profs', total: stats.total_formateurs }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" tick={{fill: '#475569'}} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="total" fill="#0f172a" barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Bottom Administrative Note */}
                <div className="bg-slate-800 text-white p-6 flex justify-between items-center rounded-sm">
                    <div>
                        <div className="text-[#00acc1] font-black text-[10px] uppercase tracking-widest mb-1">Status du Serveur</div>
                        <div className="text-sm font-bold italic">Système opérationnel • Base de données synchronisée localement.</div>
                    </div>
                    <div className="text-right">
                        <div className="bg-white/10 px-4 py-2 rounded font-black text-[10px] uppercase tracking-tighter border border-white/10 text-slate-300">
                            Propriété de l'ISTA BENGUERIR
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}