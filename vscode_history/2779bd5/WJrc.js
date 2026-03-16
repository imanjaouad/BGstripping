import React, { useState, useEffect } from 'react';

const App = () => {
  const [target, setTarget] = useState(15);
  const [numControls, setNumControls] = useState(2); // Default 2 controls
  const [notes, setNotes] = useState({ c1: '', c2: '', c3: '' });
  const [result, setResult] = useState({});

  useEffect(() => {
    // 1. Hisab l-majmou3 l-a9sa d l-ni9at (80 points f 2 controls, 100 points f 3)
    const totalMax = (numControls * 20) + 40;
    
    // 2. Ch7al d l-points khassna n-jme3 f l-total bach n-wslo l-target
    const totalNeeded = (target / 20) * totalMax;

    // 3. Ch7al jma3na f les controls (li dkhlo)
    const sumDone = (parseFloat(notes.c1) || 0) + 
                    (parseFloat(notes.c2) || 0) + 
                    (numControls === 3 ? (parseFloat(notes.c3) || 0) : 0);

    // 4. Ch7al b9a khass (Remaining)
    const remaining = totalNeeded - sumDone;
    const finalNeeded = remaining > 0 ? remaining : 0;

    // 5. Stress Level Logic
    let stress = { label: 'Relax', color: '#2ecc71', emoji: '😎' };
    const ratio = finalNeeded / 40; // Proportional difficulty based on Final exam

    if (ratio > 1) stress = { label: 'IMPOSSIBLE', color: '#e74c3c', emoji: '🚫' };
    else if (ratio > 0.85) stress = { label: 'GOD MODE', color: '#e74c3c', emoji: '💀' };
    else if (ratio > 0.7) stress = { label: 'HARDCORE', color: '#e67e22', emoji: '🔥' };
    else if (ratio > 0.5) stress = { label: 'FOCUS', color: '#f1c40f', emoji: '📚' };

    setResult({
      finalNeeded: finalNeeded.toFixed(2),
      stress: stress,
      isPossible: ratio <= 1,
      safety: ((10/20)*totalMax - sumDone).toFixed(2) // Ch7al khass bach i-jib 10/20
    });
  }, [target, notes, numControls]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Grade Planner Pro 🎓</h2>

        {/* Target Slider */}
        <div style={styles.section}>
          <label style={styles.label}>Target Finale: <span style={{color: result.stress?.color, fontSize: '20px'}}>{target}/20</span></label>
          <input type="range" min="10" max="20" step="0.5" value={target} onChange={(e)=>setTarget(e.target.value)} style={styles.range} />
        </div>

        {/* Mode Selector (2 or 3 Controls) */}
        <div style={styles.modeSection}>
          <p style={styles.label}>Ch7al mn control f had l-module?</p>
          <div style={styles.btnGroup}>
            <button 
              onClick={() => {setNumControls(2); setNotes({...notes, c3: ''})}} 
              style={{...styles.modeBtn, backgroundColor: numControls === 2 ? '#3498db' : '#ecf0f1', color: numControls === 2 ? '#fff' : '#333'}}
            >2 Controls</button>
            <button 
              onClick={() => setNumControls(3)} 
              style={{...styles.modeBtn, backgroundColor: numControls === 3 ? '#3498db' : '#ecf0f1', color: numControls === 3 ? '#fff' : '#333'}}
            >3 Controls</button>
          </div>
        </div>

        {/* Dynamic Inputs */}
        <div style={styles.grid}>
          <div style={styles.inputBox}>
            <label>C1 (/20)</label>
            <input type="number" value={notes.c1} onChange={(e)=>setNotes({...notes, c1: e.target.value})} placeholder="0" style={styles.input} />
          </div>
          <div style={styles.inputBox}>
            <label>C2 (/20)</label>
            <input type="number" value={notes.c2} onChange={(e)=>setNotes({...notes, c2: e.target.value})} placeholder="0" style={styles.input} />
          </div>
          {numControls === 3 && (
            <div style={styles.inputBox}>
              <label>C3 (/20)</label>
              <input type="number" value={notes.c3} onChange={(e)=>setNotes({...notes, c3: e.target.value})} placeholder="0" style={styles.input} />
            </div>
          )}
        </div>

        {/* Results with Stress Meter */}
        <div style={{...styles.stressBar, backgroundColor: result.stress?.color}}>
          <span style={{fontSize: '25px'}}>{result.stress?.emoji}</span>
          <div>
            <h4 style={{margin: 0}}>{result.stress?.label}</h4>
            <small>Situation dyalk f had l-module</small>
          </div>
        </div>

        <div style={styles.resContainer}>
          <div style={styles.mainRes}>
            <p>Khassk tjib f l-final (/40):</p>
            <h1 style={{margin: '5px 0'}}>{result.isPossible ? result.finalNeeded : '---'}</h1>
            {result.isPossible && <small>Ya3ni: {(result.finalNeeded / 2).toFixed(2)} / 20</small>}
          </div>
          
          <div style={styles.safetyRes}>
            <p>Marge de Sécurité (Validation):</p>
            <strong>{result.safety > 0 ? `${result.safety}/40` : 'Dmaniti l-vantage! ✅'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', fontFamily: 'Arial' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px' },
  title: { textAlign: 'center', color: '#2d3436', marginBottom: '20px' },
  section: { marginBottom: '20px' },
  label: { fontWeight: 'bold', color: '#636e72', fontSize: '14px' },
  range: { width: '100%', marginTop: '10px' },
  modeSection: { marginBottom: '25px', textAlign: 'center' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  modeBtn: { flex: 1, padding: '10px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  grid: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  inputBox: { flex: '1 1 100px', display: 'flex', flexDirection: 'column' },
  input: { padding: '12px', borderRadius: '12px', border: '2px solid #f1f2f6', marginTop: '5px', fontSize: '16px' },
  stressBar: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', color: '#fff', marginBottom: '20px' },
  resContainer: { backgroundColor: '#fdfdfd', borderRadius: '15px', border: '1px solid #eee' },
  mainRes: { padding: '20px', textAlign: 'center', borderBottom: '1px solid #eee' },
  safetyRes: { padding: '15px', textAlign: 'center', backgroundColor: '#f0fff4', borderRadius: '0 0 15px 15px', color: '#27ae60' }
};

export default App;