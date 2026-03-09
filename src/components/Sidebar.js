import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCogs, FaChartBar, FaHistory } from "react-icons/fa";
import image from "../images/image1.jpeg";

function Sidebar() {
  return (
    <div className="col-md-2 p-2 text-center " style={{ backgroundColor: "#15803D", height: '2000px'}}>
      <div className=" mb-4">
        <img 
          src={image}
          alt="Logo Mine"
          width="120"
        />
      </div>

      <ul className="nav flex-column">
        <li className="nav-item mb-2" style={{ fontSize:"20px"}}>
          <Link className="nav-link text-white d-flex align-items-center" to="">
            <FaHome className="me-2"  /> Accueille
          </Link>
        </li>

        <li className="nav-item mb-2" style={{ fontSize:"20px"}}>
          <Link className="nav-link text-white d-flex align-items-center" to="/">
            <FaCogs className="me-2" /> Gestion
          </Link>
        </li>

        <li className="nav-item mb-2" style={{ fontSize:"20px"}}>
          <Link className="nav-link text-white d-flex align-items-center" to="/statistique">
            <FaChartBar className="me-2" /> Statistique
          </Link>
        </li>

        <li className="nav-item mb-2" style={{ fontSize:"20px"}}>
          <Link className="nav-link text-white d-flex align-items-center" to="/historique">
            <FaHistory className="me-2" /> Historique
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;