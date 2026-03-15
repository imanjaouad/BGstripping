import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

export default function Dashboard() {
    const [data, setData] = useState({ stats: null, avancement: [] });
    useEffect(() => {
        const fetchAll = async () => {
            const [s, a] = await Promise.all([fetch('/api/stats').then(r=>r.json()), fetch('/api/avancement').then(r=>r.json())]);
            setData({ stats: s, avancement: a });
        };
        fetchAll();
    }, []);

    if (!data.stats) return <div className="p-20 text-center font-black">ANALYTICS ENGINE...</div>;

    const pieData = [{ name: 'FP', value: data.stats.total_fp }, { name: 'FV', value: data.stats.total_fv }];
    const COLORS = ['#006064', '#00acc1'];

    return (
        <div className="p-8 pt-32 bg-slate-50 min-h-screen font-sans text-slate-900 space-y-10">
            <div className="flex justify-between items-end border-l-8 border-[#006064] pl-6 py-2 bg-white rounded-r-2xl shadow-sm border border-slate-100">
                <div><h1 className="text-4xl font-black uppercase italic tracking-tighter">Live System Status</h1><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Direct MySQL Connection</p></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {[{l:'Groups', v:data.stats.total_groupes}, {l:'Staff', v:data.stats.total_formateurs}, {l:'Rooms', v:data.stats.total_salles}].map((c,i)=>(
                    <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 group hover:-translate-y-1 transition-all">
                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{c.l}</span>
                        <div className="text-6xl font-black text-slate-800 mt-2">{c.v}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-[400px]">
                    <h3 className="font-black text-xs uppercase mb-8 border-b pb-4">Human Resources Structure</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart><Pie data={pieData} innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                            {pieData.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie><Tooltip /><Legend /></PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <h3 className="font-black text-slate-800 text-lg mb-8 italic">Module Advancement (Real-time ⚡)</h3>
                    <div className="space-y-6">
                        {data.avancement.slice(0, 4).map((v, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2"><span className="text-[10px] font-black uppercase">{v.module} ({v.groupe})</span><span className="text-xs font-black">{v.pourcentage}%</span></div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-indigo-600 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${v.pourcentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}