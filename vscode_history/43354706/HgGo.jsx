import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DragAffectation() {
    const [unassigned, setUnassigned] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterGrp, setFilterGrp] = useState('ALL');

    const fetchData = async () => {
        try {
            const [affRes, profRes] = await Promise.all([
                fetch('/api/affectations').then(res => res.json()),
                fetch('/api/formateurs').then(res => res.json())
            ]);

            const free = affRes.filter(a => !a.id_formateur || a.id_formateur === 0);
            const buckets = {};
            profRes.forEach(p => {
                buckets[p.id_formateur] = affRes.filter(a => a.id_formateur === p.id_formateur);
            });

            setUnassigned(free);
            setFormateurs(profRes);
            setAssignments(buckets);
            setLoading(false);
        } catch (e) { console.error("Erreur Sync:", e); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- الـسّـر فـي الـمـرونـة: التحديث اللحظي (Optimistic UI) ---
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // إذا طاحت البطاقة برا المجال أو رجعات لبلاصتها
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        const startId = source.droppableId;
        const endId = destination.droppableId;

        // نسخ البيانات للقيام بتحديث محلي فوري
        let newUnassigned = [...unassigned];
        let newAssignments = { ...assignments };
        let draggedItem;

        // 1. سحب العنصر من المصدر
        if (startId === "unassigned") {
            draggedItem = newUnassigned.splice(source.index, 1)[0];
        } else {
            const sourceList = [...newAssignments[startId]];
            draggedItem = sourceList.splice(source.index, 1)[0];
            newAssignments[startId] = sourceList;
        }

        // 2. حط العنصر في الوجهة
        if (endId === "unassigned") {
            newUnassigned.splice(destination.index, 0, draggedItem);
        } else {
            const destList = [...(newAssignments[endId] || [])];
            destList.splice(destination.index, 0, draggedItem);
            newAssignments[endId] = destList;
        }

        // 3. تحديث الواجهة فوراً (بسرعة البرق ⚡)
        setUnassigned(newUnassigned);
        setAssignments(newAssignments);

        // 4. مزامنة مع الداتابيز في الخلفية (Silent Sync)
        const affId = parseInt(draggableId);
        const newProfId = endId === "unassigned" ? null : parseInt(endId);

        fetch('/api/kanban-drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_affectation: affId, id_formateur: newProfId })
        }).catch(err => {
            console.error("Échec de synchronisation");
            fetchData(); // في حالة فشل السيرفر، نعيد تحميل البيانات الأصلية
        });
    };

    if (loading) return <div className="p-10 text-center font-black text-[#006064] animate-pulse uppercase">Chargement du Système d'Affectation Officiel...</div>;

    const filteredUnassigned = unassigned.filter(a => {
        const matchSearch = a.module?.intitule_module.toLowerCase().includes(search.toLowerCase()) || a.groupe?.code_groupe.toLowerCase().includes(search.toLowerCase());
        const matchGrp = filterGrp === 'ALL' || a.groupe?.code_groupe === filterGrp;
        return matchSearch && matchGrp;
    });

    return (
        <div className="p-6 bg-slate-100 min-h-screen font-sans text-slate-900">
            <div className="max-w-full mx-auto">
                
                {/* --- OFFICIAL HEADER --- */}
                <div className="bg-white border-b-4 border-[#006064] p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 rounded-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#006064] text-white p-2 font-black text-xl italic px-4">ISTA</div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight text-slate-800 leading-none">Affectation Administrative</h1>
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Plateforme de gestion des masses horaires</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Recherche rapide..." 
                            className="p-2 border border-slate-300 rounded-sm outline-none focus:border-[#006064] text-xs w-full md:w-48"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select 
                            className="p-2 border border-slate-300 rounded-sm font-black text-[10px] text-slate-600 outline-none bg-slate-50"
                            onChange={(e) => setFilterGrp(e.target.value)}
                        >
                            <option value="ALL">TOUS LES GROUPES</option>
                            {[...new Set(unassigned.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-6 h-[78vh]">
                        
                        {/* --- COLONNE DES BESOINS (LEFT) --- */}
                        <div className="lg:w-1/4 bg-slate-200/60 flex flex-col border border-slate-300 rounded-sm">
                            <div className="bg-slate-700 text-white p-3 text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
                                📋 Banque de Modules ({filteredUnassigned.length})
                            </div>

                            <Droppable droppableId="unassigned">
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto p-3 custom-scroll ${snapshot.isDraggingOver ? 'bg-teal-50' : ''}`}>
                                        {filteredUnassigned.map((item, index) => (
                                            <Card key={item.id_affectation} item={item} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* --- GRILLE DES FORMATEURS (RIGHT) --- */}
                        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto p-1 custom-scroll">
                            {formateurs.map((prof) => {
                                const profItems = assignments[prof.id_formateur] || [];
                                const totalH = profItems.reduce((acc, curr) => acc + (parseInt(curr.mh_pres) + parseInt(curr.mh_fad)), 0);
                                const isFull = totalH > 30;

                                return (
                                    <div key={prof.id_formateur} className="bg-white border border-slate-300 shadow-sm flex flex-col h-fit rounded-sm overflow-hidden border-t-4 border-t-[#006064]">
                                        <div className={`p-3 flex justify-between items-center ${isFull ? 'bg-red-50' : 'bg-slate-50'} border-b border-slate-200`}>
                                            <div>
                                                <h3 className="font-black text-[10px] text-slate-800 uppercase truncate w-32">{prof.nom} {prof.prenom}</h3>
                                                <div className="text-[8px] font-black text-[#006064] uppercase tracking-tighter">{prof.metier || 'Formateur'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs font-black ${isFull ? 'text-red-600' : 'text-slate-800'}`}>{totalH}h / 30h</div>
                                                <div className="w-16 h-1 bg-slate-200 mt-1 rounded-none overflow-hidden">
                                                    <div className={`h-full transition-all duration-700 ${isFull ? 'bg-red-600' : 'bg-[#00acc1]'}`} style={{ width: `${Math.min((totalH / 30) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <Droppable droppableId={prof.id_formateur.toString()}>
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className={`p-2 min-h-[140px] transition-colors ${snapshot.isDraggingOver ? 'bg-teal-50' : 'bg-white'}`}>
                                                    {profItems.map((item, index) => (
                                                        <Card key={item.id_affectation} item={item} index={index} compact />
                                                    ))}
                                                    {provided.placeholder}
                                                    {profItems.length === 0 && !snapshot.isDraggingOver && (
                                                        <div className="text-center py-10 text-slate-300 text-[8px] font-black uppercase tracking-widest opacity-40">Affectation vide</div>
                                                    )}
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
                .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 0px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}

function Card({ item, index, compact }) {
    return (
        <Draggable draggableId={item.id_affectation.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    className={`bg-white p-3 mb-2 border border-slate-300 shadow-sm transition-all duration-100 ${snapshot.isDragging ? 'shadow-2xl border-[#00acc1] z-[1000] rotate-1 scale-105 bg-slate-50' : 'hover:border-slate-500'}`}
                >
                    <div className="flex justify-between items-center border-b border-slate-100 mb-2 pb-1">
                        <span className="font-black text-slate-900 text-[9px] uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 border border-slate-200">{item.groupe?.code_groupe || 'G-??'}</span>
                        <span className="text-[#00796b] font-black text-[9px] tracking-tight">{item.module?.code_module}</span>
                    </div>
                    
                    {!compact && <div className="text-slate-600 text-[9px] font-black uppercase leading-tight mb-2 h-6 overflow-hidden line-clamp-2">{item.module?.intitule_module}</div>}
                    
                    <div className="flex justify-between items-center">
                        <div className="text-[8px] font-bold text-slate-400">P:{item.mh_pres}H / D:{item.mh_fad}H</div>
                        <div className="text-[10px] font-black text-black">
                            {item.mh_pres + item.mh_fad}H
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}