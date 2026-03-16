import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Imports des Composants
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AffectationTable from './components/AffectationTable';
import Formateurs from './components/Formateurs';
import Groupes from './components/Groupes';
import Salles from './components/Salles';
import DragAffectation from './components/DragAffectation';
import EmploiGrid from './components/EmploiGrid';
import OccupationLocaux from './components/OccupationLocaux';
import Profile from './components/Profile';
import Login from './components/Login';
import StagiaireView from './components/StagiaireView';

// كومبوننت مطور لحماية المسارات بناءً على الـ Role
const PrivateRoute = ({ children, roleRequired }) => {
    const role = localStorage.getItem('userRole'); // 'admin' أو 'stagiaire'
    
    if (!role) {
        return <Navigate to="/login" />;
    }

    if (roleRequired && role !== roleRequired) {
        // إذا كان المستخدم داخل ولكن كيحاول يدخل لبلاصة ماشي ديالو
        return role === 'admin' ? <Navigate to="/" /> : <Navigate to="/consultation" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" /> 

            <Routes>
                {/* 1. صفحة اللوغان: عامة */}
                <Route path="/login" element={<Login />} />

                {/* 2. صفحة المتدربين: محمية (للمتدربين فقط) */}
                <Route path="/consultation" element={
                    <PrivateRoute roleRequired="stagiaire">
                        <StagiaireView />
                    </PrivateRoute>
                } />

                {/* 3. صفحات الإدارة: محمية (للأدمن فقط) */}
                <Route path="/*" element={
                    <PrivateRoute roleRequired="admin">
                        <div className="min-h-screen bg-slate-50">
                            <Navbar />
                            <div className="pt-4">
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/affectations" element={<AffectationTable />} />
                                    <Route path="/drag" element={<DragAffectation />} />
                                    <Route path="/emploi" element={<EmploiGrid />} />
                                    <Route path="/formateurs" element={<Formateurs />} />
                                    <Route path="/groupes" element={<Groupes />} />
                                    <Route path="/salles" element={<Salles />} />
                                    <Route path="/locaux" element={<OccupationLocaux />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </div>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById('app')) {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
}