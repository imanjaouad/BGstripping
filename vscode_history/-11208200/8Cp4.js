import axios from "axios";

const lon = 113.2;
const lat = 23.1;

async function getWeather() {
  try {
    const response = await axios.get(
      `https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`
    );
    
    console.log("Données météo :", response.data);

    console.log("Première entrée dataseries :", response.data.dataseries[0]);

  } catch (error) {
    console.error("Erreur Axios :", error);
  }
}

getWeather();
