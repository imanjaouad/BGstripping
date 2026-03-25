import { useEffect, useState } from "react";
import axios from "axios";

export default function Years() {
  const [years, setYears] = useState([]);

  useEffect(() => {
    axios.get("https://podo.b1.ma/api/public/years")
      .then(res => setYears(res.data.data || res.data))
      .catch(err => console.log(err));
  }, []);

  const handleClick = (year) => {
    alert(`Vous avez cliqué sur: ${year.name}`);
  }

  return (
    <div>
      <h2>Years</h2>
        <ul>
          {years.map(year => (
            <li key={year.id}>
              <pre>{JSON.stringify(year, null, 2)}</pre>
              <button onClick={() => handleClick(year)}>Click Me</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
