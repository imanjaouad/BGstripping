import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function FiliereDetail() {
  const { id } = useParams();
  const [filiere, setFiliere] = useState(null);

  useEffect(() => {
    fetch(`https://podo.b1.ma/api/public/filieres/${id}`)
      .then(res => res.json())
      .then(data => setFiliere(data.data)) // حسب structure ديال API
      .catch(err => console.log(err));
  }, [id]);

  if (!filiere) return <p>Loading...</p>;

  return (
    <div>
      <h1>{filiere.name}</h1>
      <p>ID: {filiere.id}</p>
      <p>Description: {filiere.description || "No description"}</p>
      <Link to={`/filieres/${filiere.year_id}`}>Back to filieres</Link>
    </div>
  );
}

export default FiliereDetail;
