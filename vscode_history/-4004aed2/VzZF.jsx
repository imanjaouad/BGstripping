import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

export default function Dashboard() {
    const [data, setData] = useState({ stats: null, avancement: [] });
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        try {
            const [s, a] = await Promise.all([
                fetch('/api/stats').then(r => r.json()),
                fetch('/api/avancement').then(r => r.json())
            ]);
            setData({ stats: s, avancement: Array.isArray(a) ? a : [] });
            setLoading(false);
        } catch (e) {
            console.error("Erreur Analytics:", e);
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center font-black animate-pulse text-indigo-600 uppercase tracking-widest">
                Analytics Engine Loading...
            </div>
        </div>
    );

    // داتا الرسوم البيانية مع حماية (Fallback)
    const pieData = [
        { name: 'Permanents', value: data.stats?.total_fp || 0 },
        { name: 'Vacataires', value: data.stats?.total_fv || 0 }
    ];
    const COLORS = ['#6366f1', '#a855f7'];

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans text-slate-900 space-y-10">
            <div className="max-w-7xl mx-auto space-y-10">
                
                <div className="border-l-8 border-indigo-600 pl-6 py-2 bg-white rounded-r-2xl shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">System Overview</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time MySQL Metrics</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {l:'Groups', v:data.stats?.total_groupes || 0}, 
                        {l:'Staff', v:data.stats?.total_formateurs || 0}, 
                        {l:'Rooms', v:data.stats?.total_salles || 0}
                    ].map((c,i)=>(
                        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:-translate-y-1 transition-all">
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{c.l}</span>
                            <div className="text-6xl font-black text-slate-800 mt-2">{c.v}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Donut Chart */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-[450px]">
                        <h3 className="font-black text-xs uppercase mb-8 border-b pb-4">Human Resources Structure</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                    {pieData.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Progress Bars (Avancement) */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                        <h3 className="font-black text-slate-800 text-lg mb-8 italic">Module Advancement ⚡</h3>
                        <div className="space-y-6">
                            {data.avancement.slice(0, 5).map((v, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase text-slate-600">{v.module} ({v.groupe})</span>
                                        <span className="text-xs font-black text-indigo-600">{v.pourcentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${v.pourcentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            {data.avancement.length === 0 && <p className="text-slate-400 italic text-center py-10">Aucune donnée d'avancement.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}