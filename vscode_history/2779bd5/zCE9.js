import React, { useState } from 'react';

function App() {
  const [target, setTarget] = useState(10);
  const [numControls, setNumControls] = useState(2);
  const [result, setResult] = useState(null);

  const calculateBreakdown = () => {
    // Logic: 2 controls (/20) + 1 Final (/40) = 80 total
    // Logic: 3 controls (/20) + 1 Final (/40) = 100 total
    const totalPointsPossible = (numControls * 20) + 40;
    const totalNeeded = (target / 20) * totalPointsPossible;
    const requiredPercentage = totalNeeded / totalPointsPossible;

    const controlNote = (requiredPercentage * 20).toFixed(2);
    const finalNote = (requiredPercentage * 40).toFixed(2);

    if (controlNote > 20) {
      setResult({ impossible: true });
    } else {
      setResult({
        impossible: false,
        controlNote,
        finalNote
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Planificateur de Notes 🎓</h2>
        
        <div style={styles.field}>
          <label style={styles.label}>Ch7al bghiti tjib f l-module finale (/20)?</label>
          <input 
            type="number" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            style={styles.input}
            max="20"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ina type dyal module hada?</label>
          <div style={styles.btnGroup}>
            <button 
              onClick={() => setNumControls(2)}
              style={{...styles.btn, backgroundColor: numControls === 2 ? '#3498db' : '#f0f0f0', color: numControls === 2 ? 'white' : 'black'}}
            >2 Controls + Final</button>
            <button 
              onClick={() => setNumControls(3)}
              style={{...styles.btn, backgroundColor: numControls === 3 ? '#3498db' : '#f0f0f0', color: numControls === 3 ? 'white' : 'black'}}
            >3 Controls + Final</button>
          </div>
        </div>

        <button onClick={calculateBreakdown} style={styles.btnCalculate}>
          Calculer les notes nécessaires
        </button>

        {result && (
          <div style={styles.result}>
            {result.impossible ? (
              <p style={{color: '#e74c3c', fontWeight: 'bold'}}>❌ Had l-moyen impossible tjibha!</p>
            ) : (
              <div>
                <p style={{marginBottom: '15px'}}>Bach tjib <strong>{target}/20</strong> f l-module, khassk:</p>
                <div style={styles.item}>
                  <span>F kola Control (/20):</span>
                  <span style={styles.badge}>{result.controlNote} / 20</span>
                </div>
                <div style={styles.item}>
                  <span>F l-Exam Final (/40):</span>
                  <span style={styles.badgeFinal}>{result.finalNote} / 40</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles simple
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f6fa', fontFamily: 'Arial, sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', color: '#2f3640', marginBottom: '20px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', marginBottom: '8px', color: '#7f8c8d' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '16px' },
  btnGroup: { display: 'flex', gap: '10px' },
  btn: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' },
  btnCalculate: { width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  result: { marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px', textAlign: 'center' },
  item: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' },
  badge: { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' },
  badgeFinal: { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }
};

export default App;