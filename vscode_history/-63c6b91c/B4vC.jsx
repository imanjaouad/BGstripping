import React from 'react';
import Logo from './components/Logo';
import WelcomeText from './components/WelcomeText';
import Mountains from './components/Mountains';


export default function EtudiaWelcome() {
return (
<div className="relative w-full h-screen bg-gray-50 overflow-hidden">
{/* Forme décorative bleue en haut à droite */}
<div
className="absolute top-0 right-0 bg-blue-600"
style={{
width: '60%',
height: '200px',
clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 100% 100%)'
}}
/>
{/* Forme décorative grise en haut à gauche */}
<div
className="absolute top-0 left-0 bg-gray-100"
style={{
width: '15%',
height: '180px',
clipPath: 'polygon(0% 0%, 100% 0%, 0% 70%)'
}}
/>


{/* Contenu principal */}
<div className="relative z-10 flex flex-col items-start justify-center h-full px-12">
<Logo />
<WelcomeText text="Bienvenue," />
<WelcomeText text="Cher Apprenant," />
</div>


{/* Montagnes décoratives en bas */}
<Mountains />
</div>
);
}