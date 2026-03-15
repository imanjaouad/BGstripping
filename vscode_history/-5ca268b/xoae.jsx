import React from 'react';
import { GraduationCap } from 'lucide-react';


const Logo = () => {
return (
<div className="flex flex-col items-center mb-16">
<div className="bg-indigo-600 text-white p-4 rounded-lg mb-3">
<GraduationCap size={40} />
</div>
<h1 className="text-2xl font-bold text-gray-900">Etudia</h1>
<p className="text-sm italic text-gray-700">Learn more</p>
</div>
);
};


export default Logo;