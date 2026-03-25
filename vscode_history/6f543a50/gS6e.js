// script.js

function calculer() {
  const noteFinale = parseFloat(document.getElementById('noteFinale').value);
  const lignes = document.querySelectorAll('#modulesTable tr');
  let totalCoef = 0;
  let totalPondere = 0;
  let coefRestant = 0;

  lignes.forEach(ligne => {
    const coef = parseFloat(ligne.querySelector('.coef').value) || 0;
    const cc = ligne.querySelector('.cc').value;
    const efm = ligne.querySelector('.efm').value;

    totalCoef += coef;

    let noteObtenue = 0;
    if (cc !== '') noteObtenue += parseFloat(cc);
    if (efm !== '') noteObtenue += parseFloat(efm);

    if (cc === '' && efm === '') coefRestant += coef;
    else totalPondere += (noteObtenue / 2) / 100 * coef; // Moyenne CC + EFM
  });

  const cible = (noteFinale / 100) * totalCoef;
  const reste = cible - totalPondere;
  const resultat = document.getElementById('result');

  if (coefRestant <= 0) {
    resultat.innerHTML = reste <= 0 ? "Bravo ! Note finale atteinte." : "Impossible d'atteindre la note finale.";
    return;
  }

  const moyenneNecessaire = (reste / coefRestant) * 100;

  if (moyenneNecessaire > 100) resultat.innerHTML = "Impossible : il faudrait plus de 100% dans les modules restants.";
  else if (moyenneNecessaire <= 0) resultat.innerHTML = "Tu as déjà atteint la note finale !";
  else resultat.innerHTML = "Il te faut environ " + moyenneNecessaire.toFixed(2) + "% de moyenne sur les modules restants.";
}
