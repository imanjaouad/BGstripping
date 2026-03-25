import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // زدت Navigate هنا
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

// كومبوننت لحماية الصفحات (بسيط وناجح)
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAdmin') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            {/* التنبيهات خدامة في الموقع كامل */}
            <Toaster position="top-right" /> 

            <Routes>
                {/* 1. صفحة اللوغان: معزولة بلا ناخبار */}
                <Route path="/login" element={<Login />} />

                {/* 2. باقي الموقع: محمي بالـ PrivateRoute */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <div className="min-h-screen bg-slate-50">
                            <Navbar />
                            <div className="pt-4"> {/* مساحة تحت الناخبار */}
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
                                    
                                    {/* إلا مشى لشي رابط غلط يرجعو لـ Dashboard */}
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