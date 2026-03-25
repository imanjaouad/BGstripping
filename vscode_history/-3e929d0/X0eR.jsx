import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // استيراد التنبيهات

// Imports des Composants
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AffectationTable from './components/AffectationTable';
import Formateurs from './components/Formateurs';
import Groupes from './components/Groupes';
import Salles from './components/Salles';
import DragAffectation from './components/DragAffectation';
import EmploiGrid from './components/EmploiGrid';
<Route path="/locaux" element={<OccupationLocaux />} />


function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                
                {/* هاد السطر هو المسؤول على إظهار التنبيهات في الزاوية */}
                <Toaster position="top-right" reverseOrder={false} /> 

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/affectations" element={<AffectationTable />} />
                    <Route path="/formateurs" element={<Formateurs />} />
                    <Route path="/groupes" element={<Groupes />} />
                    <Route path="/salles" element={<Salles />} />
                    <Route path="/drag" element={<DragAffectation />} />
                    <Route path="/emploi" element={<EmploiGrid />} />
                    <Route path="/groupes" element={<Groupes />} />
                    <Route path="/locaux" element={<OccupationLocaux />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

if (document.getElementById('app')) {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
}