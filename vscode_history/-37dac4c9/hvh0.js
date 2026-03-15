import React from "react";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">Etudia</h1>

      <nav className="flex gap-6 text-gray-700">
        <a href="#" className="hover:text-blue-600">
          Accueil
        </a>
        <a href="#" className="hover:text-blue-600">
          Cours
        </a>
        <a href="#" className="hover:text-blue-600">
          Contact
        </a>
      </nav>
    </header>
  );
}
