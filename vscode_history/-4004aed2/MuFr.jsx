import React from 'react';

export default function Dashboard() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord</h1>
            
            {/* Cards Stats (Bhal Image 1) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500 flex flex-col items-center">
                    <span className="text-4xl mb-2">🎓</span>
                    <h2 className="text-xl font-bold text-gray-700">Groupes</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-2">46</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500 flex flex-col items-center">
                    <span className="text-4xl mb-2">👨‍🏫</span>
                    <h2 className="text-xl font-bold text-gray-700">Formateurs</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">29</p>
                    <div className="text-xs text-gray-500 mt-1">FP: 29 | FV: 8</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500 flex flex-col items-center">
                    <span className="text-4xl mb-2">🏫</span>
                    <h2 className="text-xl font-bold text-gray-700">Salles</h2>
                    <p className="text-3xl font-bold text-purple-600 mt-2">24</p>
                </div>
            </div>
        </div>
    );
}