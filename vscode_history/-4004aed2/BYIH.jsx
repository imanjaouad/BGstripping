import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats').then(res => res.json()).then(data => { setStats(data); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
    );

    const dataPie = [
        { name: 'Permanents', value: stats.total_fp },
        { name: 'Vacataires', value: stats.total_fv },
    ];
    const COLORS = ['#6366f1', '#a855f7']; // Indigo & Purple

    return (
        <div className="pt-32 pb-12 px-6 bg-slate-50 min-h-screen font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Modern Header */}
                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-black text-slate-800 tracking-tighter">System <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Overview.</span></h1>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mt-4">Real-time Performance Analytics</p>
                    </div>
                </div>

                {/* Glassmorphism Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Groups', val: stats.total_groupes, color: 'from-blue-500 to-cyan-400' },
                        { label: 'Staff', val: stats.total_formateurs, color: 'from-indigo-600 to-violet-500' },
                        { label: 'Rooms', val: stats.total_salles, color: 'from-fuchsia-500 to-pink-500' }
                    ].map((card, i) => (
                        <div key={i} className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{card.label}</span>
                            <div className="text-6xl font-black text-slate-800 mt-2">{card.val}</div>
                            <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
                                <span>↑ 12%</span> <span className="text-slate-300 font-medium">vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Donut Chart Modern */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white h-[450px] relative">
                        <h3 className="font-black text-slate-800 text-lg mb-8 italic">Human Resources</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie data={dataPie} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none">
                                    {dataPie.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                                </Pie>
                                <Tooltip cornerRadius={15} contentStyle={{border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
                            <div className="text-3xl font-black text-slate-800">{stats.total_formateurs}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Staff</div>
                        </div>
                    </div>

                    {/* Area Chart Modern */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white h-[450px]">
                        <h3 className="font-black text-slate-800 text-lg mb-8 italic">Operational Load</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={[
                                { name: 'S1', val: 40 }, { name: 'S2', val: 70 }, { name: 'S3', val: 55 }, { name: 'S4', val: 90 }
                            ]}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* Footer Message */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-2">Cloud Synced</div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Your workplace is safe and up to date.</h2>
                    </div>
                    <button className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                        Download Report PDF
                    </button>
                </div>
            </div>
        </div>
    );
}