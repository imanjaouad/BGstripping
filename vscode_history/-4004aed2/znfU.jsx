import React, { useEffect, useState } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [avancement, setAvancement] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- جلب البيانات ديناميكياً من MySQL ---
    const fetchDashboardData = async () => {
        try {
            const [statsRes, avancementRes] = await Promise.all([
                fetch('/api/stats').then(res => res.json()),
                fetch('/api/avancement').then(res => res.json()) // تأكد أن هاد الـ Route كاين في Laravel
            ]);
            setStats(statsRes);
            setAvancement(avancementRes);
            setLoading(false);
        } catch (e) {
            console.error("Erreur de synchronisation SQL:", e);
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Calcul des indicateurs...</p>
            </div>
        </div>
    );

    // داتا الرسوم البيانية
    const dataHR = [
        { name: 'Permanents', value: stats?.total_fp || 0, fill: '#006064' },
        { name: 'Vacataires', value: stats?.total_fv || 0, fill: '#00acc1' },
    ];

    const dataResources = [
        { name: 'Salles', total: stats?.total_salles || 0 },
        { name: 'Groupes', total: stats?.total_groupes || 0 },
        { name: 'Staff', total: stats?.total_formateurs || 0 }
    ];

    return (
        <div className="p-8 pt-32 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* --- OFFICIAL HEADER --- */}
                <div className="flex justify-between items-end border-l-8 border-[#006064] pl-6 py-2 bg-white p-6 rounded-r-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">System Analytics<span className="text-indigo-600">.</span></h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">ISTA BENGUERIR • Rapports de performance réels</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernier Sync SQL</div>
                        <div className="text-sm font-black text-indigo-600">{new Date().toLocaleTimeString()}</div>
                    </div>
                </div>

                {/* --- METRIC CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Classes & Groupes', val: stats.total_groupes, color: 'from-slate-900 to-slate-700' },
                        { label: 'Ressources Humaines', val: stats.total_formateurs, color: 'from-[#006064] to-[#00acc1]' },
                        { label: 'Infrastructure', val: stats.total_salles, color: 'from-indigo-600 to-violet-500' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${card.color}`}></div>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{card.label}</span>
                            <div className="text-6xl font-black text-slate-800 mt-2">{card.val}</div>
                            <div className="mt-4 text-[10px] font-bold text-green-500 uppercase tracking-tighter flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live from Database
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CHARTS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Donut Chart Modern */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative">
                        <h3 className="font-black text-slate-800 text-xs uppercase mb-8 border-b pb-4 tracking-widest">Répartition Administrative</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataHR} innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                        {dataHR.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip cornerRadius={10} contentStyle={{border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-3xl font-black text-slate-800">{stats.total_formateurs}</div>
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Staff</div>
                        </div>
                    </div>

                    {/* Bar Chart Clean */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h3 className="font-black text-slate-800 text-xs uppercase mb-8 border-b pb-4 tracking-widest">Volume Global des Ressources</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataResources}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" tick={{fill: '#94a3b8'}} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                                    <Bar dataKey="total" fill="#6366f1" radius={[15, 15, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* --- MODULE AVANCEMENT SECTION (Inspired by Image 5) --- */}
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="font-black text-slate-800 text-xl italic">Avancement des Modules ⚡</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Progression réelle basée sur l'emploi du temps</p>
                        </div>
                        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase">
                            Real-time Tracking
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        {avancement.length > 0 ? avancement.slice(0, 5).map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <div className="text-[10px] font-black text-indigo-600 uppercase mb-1 tracking-tighter">{item.groupe}</div>
                                        <div className="text-sm font-black text-slate-700 uppercase leading-none">{item.module}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-900 leading-none">{item.pourcentage}%</div>
                                        <div className="text-[9px] font-bold text-slate-300 uppercase italic">{item.realise}h / {item.prevu}h</div>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400 rounded-full transition-all duration-1000 shadow-md shadow-indigo-200/50" 
                                        style={{ width: `${item.pourcentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 italic">Aucune donnée d'avancement disponible.</p>
                        )}
                    </div>
                </div>

                {/* --- FOOTER STATUS --- */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        <span className="text-indigo-300 font-black text-xs uppercase tracking-widest">Database Node: ISTA_BENGUERIR_SRV</span>
                    </div>
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-tighter relative z-10">
                        SmartPlan Engine v2.4 • Created by Kamal
                    </div>
                </div>

            </div>
        </div>
    );
}