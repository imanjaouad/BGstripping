// ... داخل useEffect ...
const [avancement, setAvancement] = useState([]);
useEffect(() => {
    fetch('/api/avancement').then(res => res.json()).then(data => setAvancement(data));
}, []);

// ... وسط الـ HTML (تحت الرسوم البيانية) ...
<div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
    <h3 className="font-black text-slate-800 text-lg mb-8 italic">Avancement des Modules (Real-time Sync ⚡)</h3>
    <div className="space-y-6">
        {avancement.slice(0, 5).map((item, i) => (
            <div key={i}>
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-black uppercase text-slate-700">{item.module} ({item.groupe})</span>
                    <span className="text-xs font-bold text-indigo-600">{item.pourcentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000 shadow-lg" 
                        style={{ width: `${item.pourcentage}%` }}
                    ></div>
                </div>
                <div className="text-[9px] text-slate-400 mt-1 font-bold">
                    {item.realise}H RÉALISÉES SUR {item.prevu}H PRÉVUES
                </div>
            </div>
        ))}
    </div>
</div>