import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Filieres() {
  const { yearID } = useParams();
  const [filieres, setFilieres] = useState([]);

  useEffect(() => {
    axios.get(`https://podo.b1.ma/api/public/years/${yearID}/filieres`)
      .then(res => setFilieres(res.data.data || res.data))
      .catch(err => console.log(err));
  }, [yearID]);

  const handleClick = (filiere) => {
    alert(`Vous avez cliqué sur: ${filiere.name}`);
  }

  return (
    <div>
      <h2>Filieres</h2>
      {filieres.length === 0 ? (
        <p>Loading filieres...</p>
      ) : (
        <ul>
          {filieres.map(f => (
            <li key={f.id}>
              <pre>{JSON.stringify(f, null, 2)}</pre>
              <button onClick={() => handleClick(f)}>Click Me</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
