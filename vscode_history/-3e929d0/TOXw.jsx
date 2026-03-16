import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DragAffectation from './components/DragAffectation';
import EmploiGrid from './components/EmploiGrid'; // <--- Zid hada


// Import des Composants
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AffectationTable from './components/AffectationTable';
import Formateurs from './components/Formateurs';
import Groupes from './components/Groupes';
import Salles from './components/Salles'; 

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/affectations" element={<AffectationTable />} />
                    <Route path="/formateurs" element={<Formateurs />} />
                    <Route path="/groupes" element={<Groupes />} />
                    
                    {/* <--- HADI DARORIYA --- */}
                    <Route path="/salles" element={<Salles />} /> 
                    <Route path="/drag" element={<DragAffectation />} />
                    <Route path="/emploi" element={<EmploiGrid />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

if (document.getElementById('app')) {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
}