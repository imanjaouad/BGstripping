export default function FiliereCard({ filiere }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
      minWidth: "120px",
      textAlign: "center"
    }}>
      <h4>{filiere.name}</h4>
    </div>
  );
}
