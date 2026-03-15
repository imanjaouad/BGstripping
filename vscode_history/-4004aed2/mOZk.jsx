import React, { useEffect, useState } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    RadialBarChart, RadialBar
} from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats').then(res => res.json()).then(data => { setStats(data); setLoading(false); });
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Génération des analyses...</div>;

    // داتا للـ Donut Chart (Human Resources)
    const dataHR = [
        { name: 'Permanents', value: stats.total_fp, fill: '#006064' },
        { name: 'Vacataires', value: stats.total_fv, fill: '#00acc1' },
    ];

    // داتا للـ Radial Bar (Utilization Rate - Simulated)
    const dataRadial = [
        { name: 'Salles', value: (stats.total_salles / 30) * 100, fill: '#0f172a' },
        { name: 'Groupes', value: (stats.total_groupes / 50) * 100, fill: '#006064' },
        { name: 'Profs', value: (stats.total_formateurs / 40) * 100, fill: '#00acc1' },
    ];

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Official Header Section */}
                <div className="border-l-8 border-[#006064] pl-6 py-2 bg-white shadow-sm rounded-r-xl">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Analyses Stratégiques</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Rapport de performance • ISTA BENGUERIR</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Classes', val: stats.total_groupes, color: 'bg-slate-900' },
                        { label: 'Staff', val: stats.total_formateurs, color: 'bg-[#006064]' },
                        { label: 'Salles', val: stats.total_salles, color: 'bg-[#00acc1]' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${card.color}`}></div>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{card.label}</span>
                            <div className="text-5xl font-black text-slate-800 mt-2">{card.val}</div>
                        </div>
                    ))}
                </div>

                {/* --- CREATIVE CHARTS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Shape 1: Professional Donut Chart */}
                    <div className="bg-white p-10 border border-slate-200 shadow-sm rounded-sm relative">
                        <h3 className="font-black text-slate-800 text-xs uppercase mb-8 border-b-2 border-slate-100 pb-3 tracking-widest">Répartition Administrative RH</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={dataHR} 
                                        innerRadius={85} 
                                        outerRadius={105} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dataHR.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '0', border: '2px solid black'}} />
                                    <Legend verticalAlign="bottom" iconType="rect" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Center Value Labels */}
                        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-4xl font-black text-slate-800">{stats.total_formateurs}</div>
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Staff</div>
                        </div>
                    </div>

                    {/* Shape 2: Modern Radial Bar Chart (Balance Chart) */}
                    <div className="bg-white p-10 border border-slate-200 shadow-sm rounded-sm">
                        <h3 className="font-black text-slate-800 text-xs uppercase mb-8 border-b-2 border-slate-100 pb-3 tracking-widest">Taux d'occupation des Ressources</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    cx="50%" cy="50%" 
                                    innerRadius="30%" outerRadius="100%" 
                                    barSize={15} 
                                    data={dataRadial}
                                    startAngle={90} endAngle={450}
                                >
                                    <RadialBar
                                        minAngle={15}
                                        label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                        background
                                        clockWise
                                        dataKey="value"
                                        cornerRadius={10}
                                    />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Shape 3: Clean Rounded Bar Chart (Infrastructure) */}
                    <div className="lg:col-span-2 bg-white p-10 border border-slate-200 shadow-sm rounded-sm">
                        <h3 className="font-black text-slate-800 text-xs uppercase mb-8 border-b-2 border-slate-100 pb-3 tracking-widest text-center">Volume des Infrastructures de formation</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Salles', val: stats.total_salles },
                                    { name: 'Groupes', val: stats.total_groupes },
                                    { name: 'Enseignants', val: stats.total_formateurs }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    {/* العمود بنهاية دائرية (Radius) */}
                                    <Bar dataKey="val" fill="#006064" radius={[20, 20, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Footer System Info */}
                <div className="bg-slate-900 text-white p-8 flex justify-between items-center rounded-sm">
                    <div>
                        <div className="text-teal-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Architecture du Système</div>
                        <div className="text-sm font-bold">Base de données MySQL optimisée • Interface Réactive</div>
                    </div>
                    <div className="border-l border-white/20 pl-8 hidden md:block">
                        <div className="text-slate-500 font-black text-[10px] uppercase mb-1 tracking-widest">Local Date</div>
                        <div className="text-sm font-black italic">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}