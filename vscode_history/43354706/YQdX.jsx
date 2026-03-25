import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DragAffectation() {
    const [unassigned, setUnassigned] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [groupes, setGroupes] = useState([]); // لجلب قائمة الأقسام
    const [modules, setModules] = useState([]); // لجلب قائمة المواد
    const [loading, setLoading] = useState(true);
    
    // حالات البحث والفلترة
    const [search, setSearch] = useState('');
    const [filterGrp, setFilterGrp] = useState('ALL');

    // حالة نافذة الإضافة (Modal)
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ id_groupe: '', id_module: '', mh_pres: 30, mh_fad: 10 });

    const fetchData = async () => {
        try {
            const [affRes, profRes, grpRes, modRes] = await Promise.all([
                fetch('/api/affectations').then(res => res.json()),
                fetch('/api/formateurs').then(res => res.json()),
                fetch('/api/groupes').then(res => res.json()),
                fetch('/api/modules').then(res => res.json())
            ]);

            const free = affRes.filter(a => !a.id_formateur || a.id_formateur === 0);
            const buckets = {};
            profRes.forEach(p => {
                buckets[p.id_formateur] = affRes.filter(a => a.id_formateur === p.id_formateur);
            });

            setUnassigned(free);
            setFormateurs(profRes);
            setAssignments(buckets);
            setGroupes(grpRes);
            setModules(modRes);
            setLoading(false);
        } catch (e) { console.error("Erreur Sync:", e); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- إضافة مادة جديدة للبنك (سجل في الداتابيز) ---
    const handleAddToBank = async (e) => {
        e.preventDefault();
        const payload = { ...formData, id_formateur: null }; // NULL باش تحط في البنك

        await fetch('/api/affectations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setShowAddModal(false);
        setFormData({ id_groupe: '', id_module: '', mh_pres: 30, mh_fad: 10 });
        fetchData(); // تحديث القائمة باش تبان المادة الجديدة في البنك
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        const startId = source.droppableId;
        const endId = destination.droppableId;

        let newUnassigned = [...unassigned];
        let newAssignments = { ...assignments };
        let draggedItem;

        if (startId === "unassigned") {
            draggedItem = newUnassigned.splice(source.index, 1)[0];
        } else {
            const sourceList = [...newAssignments[startId]];
            draggedItem = sourceList.splice(source.index, 1)[0];
            newAssignments[startId] = sourceList;
        }

        if (endId === "unassigned") {
            newUnassigned.splice(destination.index, 0, draggedItem);
        } else {
            const destList = [...(newAssignments[endId] || [])];
            destList.splice(destination.index, 0, draggedItem);
            newAssignments[endId] = destList;
        }

        setUnassigned(newUnassigned);
        setAssignments(newAssignments);

        fetch('/api/kanban-drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_affectation: parseInt(draggableId), id_formateur: endId === "unassigned" ? null : parseInt(endId) })
        });
    };

    if (loading) return <div className="p-10 text-center font-black text-[#006064] animate-pulse">CHARGEMENT...</div>;

    const filteredUnassigned = unassigned.filter(a => {
        const matchSearch = a.module?.intitule_module.toLowerCase().includes(search.toLowerCase()) || a.groupe?.code_groupe.toLowerCase().includes(search.toLowerCase());
        const matchGrp = filterGrp === 'ALL' || a.groupe?.code_groupe === filterGrp;
        return matchSearch && matchGrp;
    });

    return (
        <div className="p-6 bg-slate-100 min-h-screen font-sans">
            <div className="max-w-full mx-auto">
                
                {/* --- HEADER --- */}
                <div className="bg-white border-b-4 border-[#006064] p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#006064] text-white p-2 font-black italic px-4">ISTA</div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Affectation & Ressources</h1>
                    </div>

                    <div className="flex gap-2">
                        {/* زر الإضافة للبنك */}
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase hover:bg-slate-800 transition shadow-md"
                        >
                            + Nouveau Besoin
                        </button>
                        <input type="text" placeholder="Rechercher..." className="p-2 border border-slate-300 text-xs w-40 outline-none" onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-6 h-[78vh]">
                        {/* عمود البنك */}
                        <div className="lg:w-1/4 bg-slate-200/60 flex flex-col border border-slate-300">
                            <div className="bg-slate-700 text-white p-3 text-[10px] font-black uppercase tracking-widest text-center">
                                📋 Banque de Modules ({filteredUnassigned.length})
                            </div>
                            <Droppable droppableId="unassigned">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-3 custom-scroll">
                                        {filteredUnassigned.map((item, index) => <Card key={item.id_affectation} item={item} index={index} />)}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* شبكة الأساتذة */}
                        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto p-1 custom-scroll">
                            {formateurs.map((prof) => {
                                const profItems = assignments[prof.id_formateur] || [];
                                const totalH = profItems.reduce((acc, curr) => acc + (parseInt(curr.mh_pres) + parseInt(curr.mh_fad)), 0);
                                return (
                                    <div key={prof.id_formateur} className="bg-white border border-slate-300 shadow-sm flex flex-col h-fit border-t-4 border-t-[#006064]">
                                        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                            <span className="font-black text-[10px] uppercase truncate w-32">{prof.nom}</span>
                                            <span className="text-xs font-black text-slate-800">{totalH}h</span>
                                        </div>
                                        <Droppable droppableId={prof.id_formateur.toString()}>
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="p-2 min-h-[140px] bg-white">
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

            {/* --- MODAL: AJOUTER AU BANQUE --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[2000] p-4">
                    <div className="bg-white border-4 border-black w-full max-w-md shadow-[15px_15px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-150">
                        <div className="p-4 bg-black text-white flex justify-between items-center">
                            <span className="font-black uppercase text-xs italic tracking-widest">Nouveau Besoin Pédagogique</span>
                            <button onClick={() => setShowAddModal(false)} className="text-2xl font-light">&times;</button>
                        </div>
                        <form onSubmit={handleAddToBank} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">1. Sélectionner Groupe</label>
                                <select required className="w-full p-2 border-2 border-black font-bold text-xs" 
                                    onChange={e => setFormData({...formData, id_groupe: e.target.value})}>
                                    <option value="">Choisir...</option>
                                    {groupes.map(g => <option key={g.id_groupe} value={g.id_groupe}>{g.code_groupe}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">2. Sélectionner Module</label>
                                <select required className="w-full p-2 border-2 border-black font-bold text-xs"
                                    onChange={e => setFormData({...formData, id_module: e.target.value})}>
                                    <option value="">Choisir...</option>
                                    {modules.map(m => <option key={m.id_module} value={m.id_module}>{m.code_module} - {m.intitule_module}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">MH Présentiel</label>
                                    <input type="number" className="w-full p-2 border-2 border-black font-bold text-xs" value={formData.mh_pres} onChange={e => setFormData({...formData, mh_pres: e.target.value})} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">MH Distanciel</label>
                                    <input type="number" className="w-full p-2 border-2 border-black font-bold text-xs" value={formData.mh_fad} onChange={e => setFormData({...formData, mh_fad: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-black text-white p-3 font-black uppercase text-xs hover:bg-[#006064] transition mt-4 shadow-md">
                                Ajouter à la Banque 📥
                            </button>
                        </form>
                    </div>
                </div>
            )}
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
                    className={`bg-white p-3 mb-2 border border-slate-300 shadow-sm ${snapshot.isDragging ? 'border-[#00acc1] shadow-2xl scale-105 z-[1000] rotate-1' : ''}`}
                >
                    <div className="flex justify-between items-center border-b border-slate-100 mb-1 pb-1">
                        <span className="font-black text-slate-800 text-[9px] uppercase">{item.groupe?.code_groupe || 'N/A'}</span>
                        <span className="text-[#00796b] font-black text-[9px]">{item.module?.code_module}</span>
                    </div>
                    {!compact && <div className="text-slate-500 text-[9px] font-bold uppercase leading-tight mb-2 truncate">{item.module?.intitule_module}</div>}
                    <div className="text-[10px] font-black text-right text-[#006064]">
                        {item.mh_pres + item.mh_fad}H
                    </div>
                </div>
            )}
        </Draggable>
    );
}