import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// --- CONSTANTES ---
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];

// لائحة العطل الرسمية (أوفيت)
const CALENDRIER_VACANCES = [
    { mois: 'janvier', jours: '01', nom: 'Nouvel an' },
    { mois: 'janvier', jours: '11', nom: 'Manifeste de l\'Indépendance' },
    { mois: 'janvier', jours: '14', nom: 'Nouvel an Amazigh' },
    { mois: 'janvier', jours: '19 au 26', nom: 'Vacances Mi-Semestre' },
    { mois: 'mars', jours: '15 au 22', nom: 'Vacances Mi-Trimestre 2' },
    { mois: 'mai', jours: '01', nom: 'Fête du Travail' },
    { mois: 'mai', jours: '03 au 10', nom: 'Vacances Mi-Trimestre 3' },
];

const SESSION_COLORS = [
    { bg: 'bg-[#e0f2f1]', border: 'border-[#00796b]' },
    { bg: 'bg-[#e3f2fd]', border: 'border-[#1976d2]' },
    { bg: 'bg-[#fff3e0]', border: 'border-[#f57c00]' },
    { bg: 'bg-[#f3e5f5]', border: 'border-[#7b1fa2]' },
    { bg: 'bg-[#f1f8e9]', border: 'border-[#689f38]' },
];

export default function EmploiGrid() {
    // --- STATES ---
    const [emploiData, setEmploiData] = useState([]);
    const [salles, setSalles] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedGroup, setSelectedGroup] = useState('AA101');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selection, setSelection] = useState(null); // { jour, start, end, id_aff }

    // التاريخ الآلي
    const moisActuel = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());
    const anneeActuelle = new Date().getFullYear();

    // --- FETCH DATA ---
    const fetchData = async () => {
        try {
            const [emp, sal, aff] = await Promise.all([
                fetch('/api/emploi').then(res => res.json()),
                fetch('/api/salles').then(res => res.json()),
                fetch('/api/affectations').then(res => res.json())
            ]);
            setEmploiData(emp || []);
            setSalles(sal || []);
            setAffectations(aff || []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            toast.error("Erreur de synchronisation SQL");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGIQUE CALCUL ---
    const getColSpan = (hDebut, hFin) => {
        const startIdx = HEURES.indexOf(hDebut.substring(0, 5));
        const endIdx = HEURES.indexOf(hFin.substring(0, 5));
        return (startIdx !== -1 && endIdx !== -1) ? (endIdx - startIdx) : 1;
    };

    // كليك البداية والنهاية
    const handleCellClick = (jour, heure) => {
        if (!selection || selection.jour !== jour || selection.end) {
            setSelection({ jour, start: heure, end: null, id_aff: null });
        } else {
            const hStart = HEURES.indexOf(selection.start);
            const hEnd = HEURES.indexOf(heure);
            if (hEnd > hStart) {
                setSelection({ ...selection, end: HEURES[hEnd + 1] });
            } else {
                setSelection({ jour, start: heure, end: null });
            }
        }
    };

    // كشف التعارض (Anti-Conflict) عزل الأسابيع
    const getAvailableOptions = () => {
        if (!selection || !selection.end) return { availableSalles: [], availableAffectations: [] };
        
        const occupied = emploiData.filter(s => 
            s.jour === selection.jour && 
            parseInt(s.id_periode) === selectedWeek &&
            s.heure_debut.substring(0, 5) < selection.end && 
            s.heure_fin.substring(0, 5) > selection.start
        );

        const occupiedSallesIds = occupied.map(s => s.id_salle);
        const occupiedProfsIds = occupied.map(s => s.affectation?.id_formateur);

        return {
            availableSalles: salles.filter(s => !occupiedSallesIds.includes(s.id_salle)),
            availableAffectations: affectations.filter(a => 
                a.groupe?.code_groupe === selectedGroup && !occupiedProfsIds.includes(a.id_formateur)
            )
        };
    };

    const confirmPlan = async (idAff, idSalle) => {
        const payload = { 
            id_affectation: idAff, id_salle: idSalle, id_periode: selectedWeek, 
            jour: selection.jour, heure_debut: selection.start + ":00", heure_fin: selection.end + ":00" 
        };

        const res = await fetch('/api/emploi/seance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.success("Hébergé sur le serveur SQL ✅");
            setSelection(null);
            fetchData();
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-[#006064]">RECONSTITUTION DE LA GRILLE...</div>;

    const options = getAvailableOptions();
    // تصفية العرض بناءً على القسم والسيمانة المختارة
    const filteredEmploi = emploiData.filter(s => s.affectation?.groupe?.code_groupe === selectedGroup && parseInt(s.id_periode) === selectedWeek);
    const holidays = CALENDRIER_VACANCES.filter(v => v.mois === moisActuel.toLowerCase());

    return (
        <div className="p-4 pt-32 bg-[#f8fafc] min-h-screen font-sans text-black">
            <div className="max-w-full mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="bg-white border-b-4 border-[#006064] p-6 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#006064]">Planning {moisActuel} {anneeActuelle}</h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest tracking-[0.2em]">Semaine {selectedWeek} • Institutional Workflow</p>
                    </div>

                    {/* Week Switcher */}
                    <div className="flex bg-gray-200 p-1 rounded-2xl border-2 border-black">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSelectedWeek(num)}
                                className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 ${selectedWeek === num ? 'bg-black text-white shadow-xl scale-110' : 'text-gray-500 hover:text-black'}`}>
                                SEM {num}
                            </button>
                        ))}
                    </div>

                    {/* Group Selector */}
                    <div className="bg-gray-50 p-2 rounded-2xl border-2 border-black">
                        <select className="bg-transparent font-black text-xs outline-none uppercase" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            {[...new Set(affectations.map(a => a.groupe?.code_groupe))].filter(Boolean).map(g => <option key={g} value={g}>Group: {g}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- GRID SYSTEM --- */}
                <div className="bg-white p-2 border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 table-fixed min-w-[1100px]">
                            <thead>
                                <tr className="bg-black text-white font-black text-[10px] uppercase tracking-widest">
                                    <th className="p-4 w-32 border border-gray-600 bg-[#