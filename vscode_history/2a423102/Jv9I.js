import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Filieres() {
  const { yearId } = useParams();  // مثلا 1
  const [filieres, setFilieres] = useState([]);

  useEffect(() => {
    fetch(`https://podo.b1.ma/api/public/years/${yearId}/filieres`)
      .then(res => res.json())
      .then(data => {
        console.log(data); // باش تشوف response structure
        setFilieres(data.data); // data.data = list ديال filières
      })
      .catch(err => console.log(err));
  }, [yearId]);

  return (
    <div>
      <h1>Filieres for Year {yearId}</h1>
      <ul>
        {filieres.map(f => (
          <li key={f.id}>
            <p>{f.name}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Filieres;
