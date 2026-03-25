import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Filieres() {
  const { yearID } = useParams();
  const [filieres, setFilieres] = useState([]);

  useEffect(() => {
    axios.get(`https://podo.b1.ma/api/public/years/${yearID}/filieres`)
      .then(res => setFilieres(res.data.data))
      .catch(err => console.log(err));
  }, [yearID]);

  return (
    <div>
      <h2>Filieres</h2>
      <ul>
        {filieres.map(f => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
}
