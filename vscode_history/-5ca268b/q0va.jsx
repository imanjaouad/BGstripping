// File: src/components/Logo.jsx
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


// File: src/components/WelcomeText.jsx
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


// File: src/components/Mountains.jsx
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


// File: src/EtudiaWelcome.jsx
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


// Usage notes:
// - Place the 4 files exactly in the paths shown above.
// - Ensure you have `lucide-react` installed for the GraduationCap icon:
//     npm install lucide-react
// - If you use a .jsx or .js extension consistently, import paths don't need extensions.
// - To render the component in your app, import EtudiaWelcome from './EtudiaWelcome' in App.js.
//
// Exemple dans src/App.js:
// import React from 'react';
// import EtudiaWelcome from './EtudiaWelcome';
//
// function App() {
//   return <EtudiaWelcome />;
// }
//
// export default App;
