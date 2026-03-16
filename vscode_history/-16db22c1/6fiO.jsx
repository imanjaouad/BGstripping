import React from 'react';


const Mountains = () => {
const mountainHeights = [80, 60, 90, 40, 70, 50, 85, 55, 75, 100];


return (
<div className="absolute bottom-0 left-0 right-0 flex items-end justify-around">
{mountainHeights.map((height, index) => (
<div
key={index}
className="bg-blue-600"
style={{
width: '10%',
height: `${height}px`,
clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
}}
/>
))}
{/* Étoile décorative */}
<div
className="absolute text-black"
style={{
bottom: '100px',
left: '40%',
fontSize: '24px'
}}
>
✦
</div>
</div>
);
};
export default Mountains;