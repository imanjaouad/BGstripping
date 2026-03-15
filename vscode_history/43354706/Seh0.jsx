import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DragAffectation() {
    const [modules, setModules] = useState([]); // Listes modules à gauche
    const [formateurs, setFormateurs] = useState([]); // Listes profs à droite
    const [assignments, setAssignments] = useState({}); // Chno 3nd kol prof
    const [loading, setLoading] = useState(true);

    // --- 1. CHARGEMENT DATA ---
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const affRes = await fetch('/api/affectations');
                const profRes = await fetch('/api/formateurs');
                const allAff = await affRes.json();
                const allProfs = await profRes.json();

                // Nfer9o: Li 3ndo prof vs Li ma3ndouch
                const unassigned = allAff.filter(a => !a.formateur || a.formateur.id_formateur === null);
                
                // Nsawbo "Snade9" l kol prof
                const profBuckets = {};
                allProfs.forEach(p => {
                    profBuckets[p.id_formateur] = allAff.filter(a => a.formateur && a.formateur.id_formateur === p.id_formateur);
                });

                setModules(unassigned);
                setFormateurs(allProfs);
                setAssignments(profBuckets);
                setLoading(false);
            } catch (error) {
                console.error("Erreur chargement:", error);
            }
        };
        fetchAll();
    }, []);

    // --- 2. LOGIQUE DYAL DROP ---
    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const affectationId = parseInt(draggableId);
        const newProfId = destination.droppableId === "unassigned" ? null : parseInt(destination.droppableId);

        // --- UPDATE VISUEL ---
        let itemMoved;
        if (source.droppableId === "unassigned") {
            const newModules = [...modules];
            itemMoved = newModules.splice(source.index, 1)[0];
            setModules(newModules);
        } else {
            const profId = source.droppableId;
            const newAssign = [...assignments[profId]];
            itemMoved = newAssign.splice(source.index, 1)[0];
            setAssignments(prev => ({ ...prev, [profId]: newAssign }));
        }

        if (destination.droppableId === "unassigned") {
            itemMoved.formateur = null;
            const newModules = [...modules];
            newModules.splice(destination.index, 0, itemMoved);
            setModules(newModules);
        } else {
            const profId = destination.droppableId;
            const profObj = formateurs.find(p => p.id_formateur === parseInt(profId));
            itemMoved.formateur = profObj;

            const newAssign = [...(assignments[profId] || [])];
            newAssign.splice(destination.index, 0, itemMoved);
            setAssignments(prev => ({ ...prev, [profId]: newAssign }));
        }

        // --- SAUVEGARDE DB ---
        await fetch('/api/kanban-drop', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id_affectation: affectationId,
                id_formateur: newProfId
            })
        });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Chargement du Kanban...</div>;

    return (
        <div className="p-4 h-[calc(100vh-100px)] flex flex-col font-sans bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-[#006064] flex items-center gap-2">
                🚀 Affectation Rapide (Glisser-Déposer)
            </h1>
            
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full overflow-hidden">
                    
                    {/* --- ZONE 1: BESOINS (Non Affectés) --- */}
                    <div className="w-1/3 flex flex-col bg-gray-200 rounded-xl p-4 shadow-inner">
                        <h2 className="font-bold text-gray-700 mb-3 flex justify-between items-center bg-white p-2 rounded shadow-sm">
                            <span>📦 NON AFFECTÉS</span>
                            <span className="bg-red-500 text-white px-2 rounded-full text-xs py-1 font-bold">{modules.length}</span>
                        </h2>
                        
                        <Droppable droppableId="unassigned">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 overflow-y-auto p-2 rounded-lg transition-colors border-2 border-dashed ${snapshot.isDraggingOver ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
                                >
                                    {modules.map((item, index) => (
                                        <Card key={item.id_affectation} item={item} index={index} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* --- ZONE 2: FORMATEURS (Ressources) --- */}
                    <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-20">
                        {formateurs.map((prof) => {
                            const profItems = assignments[prof.id_formateur] || [];
                            const totalH = profItems.reduce((sum, i) => sum + parseInt(i.mh_pres) + parseInt(i.mh_fad), 0);
                            const isOverload = totalH > 30;

                            return (
                                <div key={prof.id_formateur} className="flex flex-col h-fit rounded-lg shadow-md overflow-hidden bg-white">
                                    {/* Header Prof */}
                                    <div className={`p-3 text-white flex justify-between items-center ${isOverload ? 'bg-red-500' : 'bg-[#006064]'}`}>
                                        <div className="font-bold text-sm truncate uppercase">{prof.nom} <span className="text-xs capitalize font-normal opacity-80">{prof.prenom}</span></div>
                                        <div className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded font-mono font-bold">
                                            {totalH}h
                                        </div>
                                    </div>

                                    {/* Zone de Drop Prof */}
                                    <Droppable droppableId={prof.id_formateur.toString()}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`p-2 min-h-[120px] transition-colors ${snapshot.isDraggingOver ? 'bg-green-50' : 'bg-gray-50'}`}
                                            >
                                                {profItems.map((item, index) => (
                                                    <Card key={item.id_affectation} item={item} index={index} isCompact={true} />
                                                ))}
                                                {provided.placeholder}
                                                {profItems.length === 0 && !snapshot.isDraggingOver && (
                                                    <div className="text-center text-gray-300 text-xs py-8 italic border-2 border-dashed rounded m-1">
                                                        Glisser un module ici
                                                    </div>
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
    );
}

// --- PETIT COMPOSANT CARTE ---
function Card({ item, index, isCompact }) {
    return (
        <Draggable draggableId={item.id_affectation.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-3 mb-2 rounded shadow-sm border-l-4 border-blue-500 cursor-grab hover:shadow-md transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-blue-400 z-50' : ''}`}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-800 text-sm bg-gray-100 px-1 rounded">{item.groupe?.code_groupe}</span>
                        <span className="text-[10px] font-bold text-blue-600 border border-blue-200 px-1 rounded uppercase tracking-wider">{item.module?.code_module}</span>
                    </div>
                    {!isCompact && (
                        <div className="text-xs text-gray-500 mb-2 line-clamp-2">{item.module?.intitule_module}</div>
                    )}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
                        <div className="text-[10px] font-medium text-gray-400">
                            {item.mh_pres}h P / {item.mh_fad}h F
                        </div>
                        <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 rounded-full">
                            {parseInt(item.mh_pres) + parseInt(item.mh_fad)}h
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}