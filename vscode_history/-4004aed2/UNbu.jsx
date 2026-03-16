import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-black border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-black uppercase text-xs tracking-widest text-gray-400">Analyse du système...</p>
            </div>
        </div>
    );

    // داتا للرسم الدائري (Permanents vs Vacataires)
    const dataPie = [
        { name: 'Permanents (FP)', value: stats.total_fp },
        { name: 'Vacataires (FV)', value: stats.total_fv },
    ];
    const COLORS = ['#006064', '#00acc1'];

    // داتا للرسم البياني (الموارد)
    const dataBar = [
        { name: 'Salles', total: stats.total_salles },
        { name: 'Groupes', total: stats.total_groupes },
        { name: 'Formateurs', total: stats.total_formateurs }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Dashboard <span className="text-teal-600">Analytics</span></h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Vue d'ensemble en temps réel</p>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-full font-black text-[10px] uppercase">
                    Session 2023-2024
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,96,100,1)] rounded-sm">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest block mb-2">Groupes inscrits</span>
                    <div className="text-6xl font-black text-slate-900">{stats.total_groupes}</div>
                </div>
                <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-sm">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest block mb-2">Formateurs actifs</span>
                    <div className="text-6xl font-black text-slate-900">{stats.total_formateurs}</div>
                </div>
                <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(249,115,22,1)] rounded-sm">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest block mb-2">Locaux de formation</span>
                    <div className="text-6xl font-black text-slate-900">{stats.total_salles}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* PIE CHART */}
                <div className="bg-white border-2 border-black p-8 rounded-sm shadow-sm h-[400px]">
                    <h3 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-gray-400 border-l-4 border-teal-600 pl-3">Structure RH (FP / FV)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie data={dataPie} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                {dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* BAR CHART */}
                <div className="bg-white border-2 border-black p-8 rounded-sm shadow-sm h-[400px]">
                    <h3 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-gray-400 border-l-4 border-black pl-3">Comparaison des Ressources</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{fill: '#94a3b8'}} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '0', border: '2px solid black'}} />
                            <Bar dataKey="total" fill="#000000" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* System Status Footer */}
            <div className="bg-black text-white p-6 rounded-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <span className="font-black uppercase text-xs tracking-widest">Base de données en ligne</span>
                </div>
                <div className="text-[10px] font-bold text-gray-500 italic uppercase">
                    Connecté à ISTA BENGUERIR Server
                </div>
            </div>
        </div>
    );
}