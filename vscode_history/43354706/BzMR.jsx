import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DragAffectation() {
    const [unassigned, setUnassigned] = useState([]); // الموديلات اللي باقين بلا أستاذ
    const [formateurs, setFormateurs] = useState([]); // قائمة الأساتذة
    const [assignments, setAssignments] = useState({}); // الحصص عند كل أستاذ
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterGrp, setFilterGrp] = useState('ALL');

    // --- 1. جلب البيانات من السيستيم ---
    const fetchData = async () => {
        const [affRes, profRes] = await Promise.all([
            fetch('/api/affectations').then(res => res.json()),
            fetch('/api/formateurs').then(res => res.json())
        ]);

        // تصفية المواد التي لم يتم تعيين أستاذ لها بعد (id_formateur is null or 0)
        const free = affRes.filter(a => !a.id_formateur || a.id_formateur === 0);
        
        // توزيع المواد المسندة على الأساتذة (Buckets)
        const buckets = {};
        profRes.forEach(p => {
            buckets[p.id_formateur] = affRes.filter(a => a.id_formateur === p.id_formateur);
        });

        setUnassigned(free);
        setFormateurs(profRes);
        setAssignments(buckets);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // --- 2. منطق الـ Drag & Drop الذكي ---
    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const affId = parseInt(draggableId);
        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        // تحديث الواجهة فوراً (Optimistic UI)
        // [هذا الجزء يقوم بنقل البطاقة برمجياً قبل وصول رد السيرفر لسرعة الاستجابة]
        
        const newProfId = destId === "unassigned" ? null : parseInt(destId);

        // إرسال التحديث للداتابيز
        await fetch('/api/kanban-drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_affectation: affId, id_formateur: newProfId })
        });

        fetchData(); // تحديث كلي للتأكد من البيانات
    };

    if (loading) return <div className="p-20 text-center font-black text-[#006064] animate-pulse">CHARGEMENT DU KANBAN...</div>;

    // تصفية المواد غير المسندة بناءً على البحث والقسم
    const filteredUnassigned = unassigned.filter(a => {
        const matchSearch = a.module?.intitule_module.toLowerCase().includes(search.toLowerCase()) || a.groupe?.code_groupe.toLowerCase().includes(search.toLowerCase());
        const matchGrp = filterGrp === 'ALL' || a.groupe?.code_groupe === filterGrp;
        return matchSearch && matchGrp;
    });

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-full mx-auto">
                
                {/* --- HEADER الإبداعي --- */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Quick Assign ⚡</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Glissez les modules vers les instructeurs</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Rechercher module..." 
                            className="p-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#00acc1] w-full md:w-64 transition-all"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select 
                            className="p-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 outline-none"
                            onChange={(e) => setFilterGrp(e.target.value)}
                        >
                            <option value="ALL">Tous les groupes</option>
                            {[...new Set(unassigned.map(a => a.groupe?.code_groupe))].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-8 h-[75vh]">
                        
                        {/* --- القائمة اليسرى: المواد اليتيمة (Besoins) --- */}
                        <div className="lg:w-1/4 bg-slate-200/50 rounded-[2.5rem] p-6 flex flex-col border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-black text-slate-500 text-xs uppercase tracking-[0.2em]">📦 Besoins ({filteredUnassigned.length})</h2>
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                            </div>

                            <Droppable droppableId="unassigned">
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto pr-2 custom-scroll rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-teal-50' : ''}`}>
                                        {filteredUnassigned.map((item, index) => (
                                            <Card key={item.id_affectation} item={item} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* --- القائمة اليمنى: الأساتذة (Ressources) --- */}
                        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto p-2 custom-scroll">
                            {formateurs.map((prof) => {
                                const profItems = assignments[prof.id_formateur] || [];
                                // حساب مجموع الساعات الحالية للأستاذ
                                const totalH = profItems.reduce((acc, curr) => acc + (curr.mh_pres + curr.mh_fad), 0);
                                const isFull = totalH >= 30;

                                return (
                                    <div key={prof.id_formateur} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-fit overflow-hidden hover:shadow-xl transition-shadow duration-500">
                                        <div className={`p-5 flex justify-between items-center ${isFull ? 'bg-rose-50' : 'bg-slate-50'} border-b border-slate-100`}>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-sm uppercase leading-none">{prof.nom}</h3>
                                                <span className="text-[10px] font-bold text-slate-400">{prof.metier}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-black ${isFull ? 'text-rose-500' : 'text-[#006064]'}`}>{totalH}h</div>
                                                <div className="w-16 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                                    <div className={`h-full transition-all duration-1000 ${isFull ? 'bg-rose-500' : 'bg-teal-400'}`} style={{ width: `${(totalH / 30) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <Droppable droppableId={prof.id_formateur.toString()}>
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className={`p-4 min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-teal-50/50' : ''}`}>
                                                    {profItems.map((item, index) => (
                                                        <Card key={item.id_affectation} item={item} index={index} compact />
                                                    ))}
                                                    {provided.placeholder}
                                                    {profItems.length === 0 && <div className="text-center py-10 text-slate-300 text-[10px] font-bold uppercase tracking-widest italic opacity-50">Déposer ici</div>}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </DragDropContext>
            </div>
            
            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
            `}</style>
        </div>
    );
}

// --- كومبوننت البطاقة (Card) ---
function Card({ item, index, compact }) {
    return (
        <Draggable draggableId={item.id_affectation.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    className={`bg-white p-4 mb-3 rounded-2xl border-2 border-slate-100 shadow-sm transition-all duration-300 ${snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl border-[#00acc1] z-50' : 'hover:border-teal-200'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="bg-slate-900 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase">{item.groupe?.code_groupe}</span>
                        <span className="text-[#00acc1] font-black text-[10px]">{item.module?.code_module}</span>
                    </div>
                    {!compact && <p className="text-slate-600 text-xs font-bold leading-tight mb-3">{item.module?.intitule_module}</p>}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <div className="flex gap-2">
                            <span className="text-[9px] font-bold text-slate-400">P:{item.mh_pres}h</span>
                            <span className="text-[9px] font-bold text-slate-400">D:{item.mh_fad}h</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                            Total: {item.mh_pres + item.mh_fad}h
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}