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
    };

    useEffect(() => { fetchData(); }, []);

    // --- الـسّـر في الـسّـرعـة: تحديث محلي فوري (Instant Local Update) ---
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        // 1. تحديد المصدر والوجهة
        const startListId = source.droppableId;
        const endListId = destination.droppableId;

        let newUnassigned = [...unassigned];
        let newAssignments = { ...assignments };

        // 2. سحب العنصر من القائمة الأصلية
        let draggedItem;
        if (startListId === "unassigned") {
            draggedItem = newUnassigned.splice(source.index, 1)[0];
        } else {
            const list = [...newAssignments[startListId]];
            draggedItem = list.splice(source.index, 1)[0];
            newAssignments[startListId] = list;
        }

        // 3. وضع العنصر في القائمة الجديدة
        if (endListId === "unassigned") {
            newUnassigned.splice(destination.index, 0, draggedItem);
        } else {
            const list = [...(newAssignments[endListId] || [])];
            list.splice(destination.index, 0, draggedItem);
            newAssignments[endListId] = list;
        }

        // 4. تحديث الواجهة فوراً (بسرعة البرق ⚡)
        setUnassigned(newUnassigned);
        setAssignments(newAssignments);

        // 5. إرسال الطلب للسيرفر في الخلفية (Silent Sync)
        const affId = parseInt(draggableId);
        const newProfId = endListId === "unassigned" ? null : parseInt(endListId);

        fetch('/api/kanban-drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_affectation: affId, id_formateur: newProfId })
        });
    };

    if (loading) return <div className="p-10 text-center font-black text-[#006064] animate-pulse">OPTIMIZING WORKSPACE...</div>;

    const filteredUnassigned = unassigned.filter(a => {
        const matchSearch = a.module?.intitule_module.toLowerCase().includes(search.toLowerCase()) || a.groupe?.code_groupe.toLowerCase().includes(search.toLowerCase());
        const matchGrp = filterGrp === 'ALL' || a.groupe?.code_groupe === filterGrp;
        return matchSearch && matchGrp;
    });

    return (
        <div className="p-4 bg-gray-100 min-h-screen font-sans">
            <div className="max-w-full mx-auto">
                
                {/* Header الإداري السريع */}
                <div className="bg-white border-b-4 border-black p-4 mb-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-xl font-black uppercase tracking-tighter italic text-slate-800">Assign-Flow ⚡</h1>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Recherche rapide..." className="p-2 border-2 border-gray-200 rounded outline-none focus:border-black text-xs w-48" onChange={(e) => setSearch(e.target.value)} />
                        <select className="border-2 border-gray-200 p-2 font-bold text-xs outline-none" onChange={(e) => setFilterGrp(e.target.value)}>
                            <option value="ALL">Groupes</option>
                            {[...new Set(unassigned.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-4 h-[82vh]">
                        
                        {/* عمود الاحتياجات (Besoins) */}
                        <div className="lg:w-1/5 bg-gray-200/50 flex flex-col border-2 border-gray-300 rounded-lg">
                            <div className="bg-gray-800 text-white p-2 text-[9px] font-black uppercase text-center tracking-widest">Modules Libres</div>
                            <Droppable droppableId="unassigned">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-2 custom-scroll">
                                        {filteredUnassigned.map((item, index) => <Card key={item.id_affectation} item={item} index={index} />)}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* شبكة الأساتذة (Grid) */}
                        <div className="lg:w-4/5 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto p-1 custom-scroll">
                            {formateurs.map((prof) => {
                                const profItems = assignments[prof.id_formateur] || [];
                                const totalH = profItems.reduce((acc, curr) => acc + (parseInt(curr.mh_pres) + parseInt(curr.mh_fad)), 0);
                                return (
                                    <div key={prof.id_formateur} className="bg-white border-2 border-black flex flex-col h-fit shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        <div className="p-2 bg-[#006064] text-white flex justify-between items-center border-b-2 border-black">
                                            <span className="font-black text-[10px] uppercase truncate w-24">{prof.nom}</span>
                                            <span className="text-[10px] font-black bg-black/20 px-1">{totalH}h</span>
                                        </div>
                                        <Droppable droppableId={prof.id_formateur.toString()}>
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className={`p-1 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-teal-50' : 'bg-white'}`}>
                                                    {profItems.map((item, index) => <Card key={item.id_affectation} item={item} index={index} compact />)}
                                                    {provided.placeholder}
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
            <style>{`.custom-scroll::-webkit-scrollbar { width: 3px; } .custom-scroll::-webkit-scrollbar-thumb { background: black; }`}</style>
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
                    className={`bg-white p-2 mb-1 border-2 border-gray-100 shadow-sm ${snapshot.isDragging ? 'border-black shadow-lg scale-105 z-[1000] rotate-1' : 'hover:border-black'}`}
                >
                    <div className="flex justify-between items-center border-b border-gray-100 mb-1 pb-1">
                        <span className="font-black text-[9px] uppercase">{item.groupe?.code_groupe || 'N/A'}</span>
                        <span className="text-[#00796b] font-black text-[9px] tracking-tighter">{item.module?.code_module}</span>
                    </div>
                    {!compact && <div className="text-[9px] font-bold text-gray-500 uppercase leading-none truncate mb-1">{item.module?.intitule_module}</div>}
                    <div className="text-[8px] font-black text-right text-gray-400">{item.mh_pres + item.mh_fad}H TOTAL</div>
                </div>
            )}
        </Draggable>
    );
}