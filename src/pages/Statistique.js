
import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import image from "../images/image3.webp";

function Statistique() {

  const poussages = useSelector((state) => state.poussage?.list || []);

  // ======================
  // Calculs globaux
  // ======================

  const totalVolume = poussages.reduce(
    (acc, item) => acc + Number(item.volume_soté || 0),
    0
  );

  const totalTemps = poussages.reduce(
    (acc, item) => acc + Number(item.temps || 0),
    0
  );

  // Rendement moyen

  const rendementMoyen =
    poussages.length > 0
      ? (
          poussages.reduce((acc, p) => {

            const volume = Number(p.volume_soté || 0);
            const temps = Number(p.temps || 0);

            return acc + (temps > 0 ? volume / temps : 0);

          }, 0) / poussages.length
        ).toFixed(2)
      : 0;

  // ======================
  // Groupe par Tranchée
  // ======================

  const trancheeGroups = {};

  poussages.forEach((p) => {

    const tranchee = p.tranchee || "Non défini";

    if (!trancheeGroups[tranchee]) {
      trancheeGroups[tranchee] = [];
    }

    trancheeGroups[tranchee].push(p);

  });

  // ======================
  // Groupe par Engin
  // ======================

  const enginStats = {};

  poussages.forEach((p) => {

    if (p.equipements && p.equipements.length > 0) {

      p.equipements.forEach((eq) => {

        if (!enginStats[eq]) {
          enginStats[eq] = 0;
        }

        enginStats[eq] += Number(p.volume_soté || 0);

      });

    }

  });

  const enginLabels = Object.keys(enginStats);
  const enginVolumes = Object.values(enginStats);

  const enginData = {
    labels: enginLabels,
    datasets: [
      {
        label: "Volume par Engin (t)",
        data: enginVolumes,
        backgroundColor: "#0d6efd",
        borderRadius: 6
      }
    ]
  };

  return (

    <div className="container" >

     <div className="d-flex align-items-center justify-content-between mb-4">
  <h2 className="mb-0">Statistiques de Décapage</h2>
  <img 
    src={image}
    alt="Logo Mine"
    width="70"
  />
</div>


      {/* Cartes résumé */}

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card shadow text-center p-3"  style={{  borderLeft :"3px solid #16A34A" }}>
            <h5>Volume Total</h5>
            <h3 className="text-success">{totalVolume} t</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3" style={{  borderLeft :"3px solid #16A34A"}}>
            <h5>Temps Total</h5>
            <h3 className="text-primary">{totalTemps} h</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3" style={{  borderLeft :"3px solid #16A34A"}}>
            <h5>Rendement Moyen</h5>
            <h3 className="text-warning">{rendementMoyen} t/h</h3>
          </div>
        </div>

      </div>

      {/* Graphe par Engin */}

      <div className="card shadow p-4 mb-5" style={{  borderLeft :"3px solid #16A34A"}}>

        <h5 className="mb-3">
          Rapport Graphique par Engin
        </h5>

        {enginLabels.length > 0 ? (
          <Bar data={enginData} />
        ) : (
          <p className="text-center text-muted">
            Aucun données disponible
          </p>
        )}

      </div>

      {/* Graphes par Tranchée */}

      <div className="row">

        {Object.keys(trancheeGroups).map((tranchee, index) => {

          const operations = trancheeGroups[tranchee];

          const labels = operations.map(
            (op, i) => `Op ${i + 1}`
          );

          const volumes = operations.map(
            (op) => Number(op.volume_soté || 0)
          );

          const data = {
            labels: labels,
            datasets: [
              {
                label: `Volume - Tranchée ${tranchee}`,
                data: volumes,
                backgroundColor: "#16A34A",
                borderRadius: 6
              }
            ]
          };

          return (

            <div
              key={index}
              className="col-md-6 mb-4"
            >

              <div className="card shadow p-4">

                <h6 className="mb-3">
                  Tranchée {tranchee}
                </h6>

                <Bar data={data} />

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default Statistique;

