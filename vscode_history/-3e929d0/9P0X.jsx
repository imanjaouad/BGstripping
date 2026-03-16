import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import des Composants
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AffectationTable from './components/AffectationTable';
import Formateurs from './components/Formateurs';
import Groupes from './components/Groupes';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar kayban dima lfou9 */}
                <Navbar />

                {/* Hna fin kaytbddlo les pages */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/affectations" element={<AffectationTable />} />
                    <Route path="/formateurs" element={<Formateurs />} />
                    <Route path="/groupes" element={<Groupes />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

if (document.getElementById('app')) {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
}