import { useLocation, Link } from "react-router-dom";

function FiliereDetail() {
  const { state } = useLocation();
  const filiere = state?.filiere;

  if (!filiere) return <p>No data available.</p>;

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
