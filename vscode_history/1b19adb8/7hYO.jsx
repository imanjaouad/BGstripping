import React from "react";

export default function MainContent() {
  return (
    <main className="w-full p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Contenu Principal
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed">
        Bienvenue dans votre espace d’apprentissage. Ici, vous pouvez accéder aux cours, 
        consulter les ressources et suivre votre progression.
      </p>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">
          Ceci est un exemple de section dans le contenu principal.
        </p>
      </div>
    </main>
  );
}
