import React from 'react';


const WelcomeText = ({ text }) => {
return (
<div className="mb-8">
<h2 className="text-4xl font-bold text-gray-900 mb-2">{text}</h2>
<div className="w-32 h-1 bg-blue-600"></div>
</div>
);
};


export default WelcomeText;