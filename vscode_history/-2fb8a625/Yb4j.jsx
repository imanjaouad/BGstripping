function Card({ title, prix }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{prix}</p>
      <button>Acheter</button>
    </div>
  )
}

