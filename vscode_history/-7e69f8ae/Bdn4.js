import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Years() {
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then(res => res.json())
      .then(data => setYears(data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Years</h1>
      <ul>
        {years.map(year => (
          <li key={year.id}>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Years;
