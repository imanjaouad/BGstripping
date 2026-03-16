import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Years() {
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetch("https://podo.b1.ma/api/years")
      .then(res => res.json())
      .then(data => setYears(data.data)) // structure API
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Years</h1>
      <ul>
        {years.map(year => (
          <li key={year.id}>
            <Link to={`/filieres/${year.id}`}>{year.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Years;
