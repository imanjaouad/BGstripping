
import React from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import image from "../images/image3.webp";


function Historique() {

  const poussages = useSelector((state) => state.poussage?.list || []);

  const exportExcel = () => {

    const data = poussages.map((p) => ({
      Date: p.date,
      Panneau: p.panneau,
      Tranchee: p.tranchee,
      Profendeur: p.profendeur,
      Equipements: p.equipements?.join(", "),
      Conducteur: p.conducteur,
      Matricule: p.matricule,
      Volume: p.volume_soté,
      Temps: p.temps,
      Rendement:
        p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });

    saveAs(fileData, "historique_poussage.xlsx");

  };

  return (

    <div>

      <div className="d-flex align-items-center justify-content-between mb-4">
  <h2 className="mb-0">Historique de Décapage</h2>
  <img 
    src={image}
    alt="Logo Mine"
    width="70"
  />
</div>
      <div className="card shadow p-3">

        <div className="d-flex justify-content-between align-items-center">

          <h5>Liste Historique</h5>

          <button
            className="btn btn" style={{  backgroundColor :"#16A34A" , color:"white"}}
            onClick={exportExcel}
          >
            Télécharger Excel
          </button>

        </div>

        <table className="table table-striped mt-3">

          <thead className="table-dark">

            <tr>
              <th>Date</th>
              <th>Panneau</th>
              <th>Tranchée</th>
              <th>Profendeur</th>
              <th>Équipements</th>
              <th>Conducteur</th>
              <th>Matricule</th>
              <th>Volume</th>
              <th>Heures de Marche</th>
              <th>Rendement</th>
            </tr>

          </thead>

          <tbody>

            {poussages.map((p, index) => (

              <tr key={index}>

                <td>{p.date}</td>
                <td>{p.panneau}</td>
                <td>{p.tranchee}</td>
                <td>{p.profendeur}</td>

                <td>
                  {p.equipements?.join(", ")}
                </td>

                <td>{p.conducteur}</td>
                <td>{p.matricule}</td>
                <td>{p.volume_soté}</td>
                <td>{p.temps}</td>

                <td>
                  {p.temps > 0
                    ? (p.volume_soté / p.temps).toFixed(2)
                    : 0} t/h
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Historique;

