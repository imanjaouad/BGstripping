// ... ton code existant ...

const handleContinue = () => {
  if (selectedYear && selectedFiliere) {
    // Navigation avec paramètres dans l'URL
    window.location.href = `/modules?year=${selectedYear.id}&filiere=${selectedFiliere.id}`;
  }
};

// ... reste identique ...