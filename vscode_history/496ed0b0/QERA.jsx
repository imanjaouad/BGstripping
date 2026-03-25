// src/components/Years.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Years() {
  const [years, setYears] = useState([]);

  useEffect(() => {
    axios.get("https://podo.b1.ma/api/public/years")
      .then(res => setYears(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Years</h2>
      <ul>
        {years.map(year => (
          <li key={year.id}>
            <Link to={`/filiere/${year.id}`}>{year.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
