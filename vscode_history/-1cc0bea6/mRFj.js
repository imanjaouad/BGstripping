// src/components/Card.js
export default function Card({ title}) {
  return (
    <div
      style={{
        padding: 20,
        margin: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
      }}
    >
      <h3>{title}</h3>
    </div>
  );
}
