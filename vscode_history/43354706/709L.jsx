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

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const affId = parseInt(draggableId);
        const newProfId = destination.droppableId === "unassigned" ? null : parseInt(destination.droppableId);

        await fetch('/api/kanban-drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_affectation: affId, id_formateur: newProfId })
        });
        fetchData();
    };

    if (loading) return <div className="p-10 text-center font-bold text-[#006064] uppercase tracking-widest">Initialisation du système d'affectation...</div>;

    const filteredUnassigned = unassigned.filter(a => {
        const matchSearch = a.module?.intitule_module.toLowerCase().includes(search.toLowerCase()) || a.groupe?.code_groupe.toLowerCase().includes(search.toLowerCase());
        const matchGrp = filterGrp === 'ALL' || a.groupe?.code_groupe === filterGrp;
        return matchSearch && matchGrp;
    });

    return (
        <div className="p-6 bg-[#f4f7f6] min-h-screen font-sans text-slate-800">
            <div className="max-w-full mx-auto">
                
                {/* --- HEADER OFFICIEL --- */}
                <div className="bg-white border-b-4 border-[#006064] p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center rounded-sm">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Directoire d'Affectation Rapide</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Gestion des ressources humaines et pédagogiques</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                        <input 
                            type="text" 
                            placeholder="Rechercher (Module/Groupe)..." 
                            className="p-2 border-2 border-slate-300 rounded-md outline-none focus:border-[#006064] text-sm w-full md:w-64"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select 
                            className="p-2 border-2 border-slate-300 rounded-md font-bold text-slate-700 outline-none text-sm"
                            onChange={(e) => setFilterGrp(e.target.value)}
                        >
                            <option value="ALL">Tous les Groupes</option>
                            {[...new Set(unassigned.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-6 h-[78vh]">
                        
                        {/* --- PANNEAU GAUCHE: MODULES EN ATTENTE --- */}
                        <div className="lg:w-1/4 bg-[#e9eceb] flex flex-col border border-slate-300 rounded-sm">
                            <div className="bg-slate-700 text-white p-3 flex justify-between items-center">
                                <h2 className="font-black text-[10px] uppercase tracking-widest">📋 Besoins à combler ({filteredUnassigned.length})</h2>
                            </div>

                            <Droppable droppableId="unassigned">
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto p-3 custom-scroll ${snapshot.isDraggingOver ? 'bg-teal-100/50' : ''}`}>
                                        {filteredUnassigned.map((item, index) => (
                                            <Card key={item.id_affectation} item={item} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* --- PANNEAU DROIT: FORMATEURS (AFFECTÉS) --- */}
                        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto p-1 custom-scroll">
                            {formateurs.map((prof) => {
                                const profItems = assignments[prof.id_formateur] || [];
                                const totalH = profItems.reduce((acc, curr) => acc + (parseInt(curr.mh_pres) + parseInt(curr.mh_fad)), 0);
                                const isOverloaded = totalH > 30;

                                return (
                                    <div key={prof.id_formateur} className="bg-white border border-slate-300 shadow-sm flex flex-col h-fit rounded-sm group">
                                        {/* Header Formateur */}
                                        <div className={`p-3 flex justify-between items-center ${isOverloaded ? 'bg-red-600 text-white' : 'bg-[#006064] text-white'}`}>
                                            <div>
                                                <h3 className="font-black text-[11px] uppercase truncate w-40">{prof.nom} {prof.prenom}</h3>
                                                <div className="text-[9px] font-bold opacity-80 uppercase">{prof.metier || 'Spécialité'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black">{totalH}h / 30h</div>
                                                <div className="w-12 h-1 bg-white/30 mt-1 rounded-none overflow-hidden">
                                                    <div className="h-full bg-white transition-all duration-700" style={{ width: `${(totalH / 30) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <Droppable droppableId={prof.id_formateur.toString()}>
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className={`p-2 min-h-[120px] transition-colors bg-gray-50/50 ${snapshot.isDraggingOver ? 'bg-teal-50 border-2 border-dashed border-[#006064]' : ''}`}>
                                                    {profItems.map((item, index) => (
                                                        <Card key={item.id_affectation} item={item} index={index} compact />
                                                    ))}
                                                    {provided.placeholder}
                                                    {profItems.length === 0 && !snapshot.isDraggingOver && (
                                                        <div className="text-center py-6 text-slate-300 text-[9px] font-black uppercase tracking-widest opacity-40">Aucun module</div>
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
                .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; }
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
                    className={`bg-white p-3 mb-2 border border-slate-300 shadow-sm transition-all duration-200 ${snapshot.isDragging ? 'scale-105 shadow-xl border-[#00acc1] z-[1000] rotate-1' : 'hover:border-[#00acc1]'}`}
                >
                    <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-100">
                        <span className="font-black text-slate-800 text-[10px] uppercase tracking-tighter">{item.groupe?.code_groupe || 'G-??'}</span>
                        <span className="text-[#00796b] font-black text-[10px] tracking-tight">{item.module?.code_module}</span>
                    </div>
                    
                    {!compact && <div className="text-slate-500 text-[10px] font-bold leading-tight mb-2 uppercase">{item.module?.intitule_module}</div>}
                    
                    <div className="flex justify-between items-center">
                        <div className="text-[9px] font-black text-slate-400">
                            P: {item.mh_pres}H / D: {item.mh_fad}H
                        </div>
                        <div className="text-[10px] font-black text-[#006064] bg-teal-50 px-2 py-0.5 border border-teal-100">
                            {item.mh_pres + item.mh_fad}H
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}