import React, { useState } from 'react';

const App = () => {
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);
  const [numControls, setNumControls] = useState(2);
  const [target, setTarget] = useState(15);
  const [notes, setNotes] = useState({ c1: '', c2: '', c3: '', final: '' });

  // --- LOGIC DIAL L-PLANNER (Ch7al khassni njib) ---
  const calculateNeeded = () => {
    const totalMax = (numControls * 20) + 40;
    const totalNeededPoints = (target / 20) * totalMax;
    const currentPoints = (parseFloat(notes.c1) || 0) + (parseFloat(notes.c2) || 0) + (numControls === 3 ? (parseFloat(notes.c3) || 0) : 0);
    const needed = totalNeededPoints - currentPoints;
    
    if (needed > 40) return { val: needed.toFixed(2), status: 'Impossible', color: '#e74c3c' };
    if (needed <= 0) return { val: '0', status: 'Dmanitiha!', color: '#2ecc71' };
    return { val: needed.toFixed(2), status: 'Possible', color: '#3498db' };
  };

  // --- LOGIC DIAL L-CHECKER (Ch7al jbt bse7) ---
  const calculateFinalScore = () => {
    const totalMax = (numControls * 20) + 40;
    const sum = (parseFloat(notes.c1) || 0) + (parseFloat(notes.c2) || 0) + (numControls === 3 ? (parseFloat(notes.c3) || 0) : 0) + (parseFloat(notes.final) || 0);
    return ((sum / totalMax) * 20).toFixed(2);
  };

  const resPlanner = calculateNeeded();
  const resChecker = calculateFinalScore();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header b Switch dyal l-Mode */}
        <div style={styles.header}>
          <h2 style={{margin: 0}}>{isCalculatorMode ? "Calculateur d Résultat 📊" : "Planner d l-Module 🎯"}</h2>
          <button 
            onClick={() => setIsCalculatorMode(!isCalculatorMode)} 
            style={styles.switchBtn}
          >
            {isCalculatorMode ? "Rje3 l Planner" : "7seb nuqttek"}
          </button>
        </div>

        {/* Settings: 2 aw 3 controls */}
        <div style={styles.settingRow}>
          <label>Type dyal l-Module: </label>
          <select value={numControls} onChange={(e)=>setNumControls(parseInt(e.target.value))} style={styles.select}>
            <option value={2}>2 Controls + Final</option>
            <option value={3}>3 Controls + Final</option>
          </select>
        </div>

        {/* Planner Mode: Target Input */}
        {!isCalculatorMode && (
          <div style={styles.targetBox}>
            <label>Target (Ch7al bghiti tjib /20): </label>
            <input type="number" value={target} onChange={(e)=>setTarget(e.target.value)} style={styles.inputTarget} />
          </div>
        )}

        {/* Inputs dyal l-nuqat */}
        <div style={styles.grid}>
          <div style={styles.inputBox}>
            <label>C1 (/20)</label>
            <input type="number" value={notes.c1} onChange={(e)=>setNotes({...notes, c1: e.target.value})} style={styles.input} placeholder="0" />
          </div>
          <div style={styles.inputBox}>
            <label>C2 (/20)</label>
            <input type="number" value={notes.c2} onChange={(e)=>setNotes({...notes, c2: e.target.value})} style={styles.input} placeholder="0" />
          </div>
          {numControls === 3 && (
            <div style={styles.inputBox}>
              <label>C3 (/20)</label>
              <input type="number" value={notes.c3} onChange={(e)=>setNotes({...notes, c3: e.target.value})} style={styles.input} placeholder="0" />
            </div>
          )}
          {isCalculatorMode && (
            <div style={styles.inputBox}>
              <label>FINAL (/40)</label>
              <input type="number" value={notes.final} onChange={(e)=>setNotes({...notes, final: e.target.value})} style={{...styles.input, borderColor: '#3498db'}} placeholder="0" />
            </div>
          )}
        </div>

        {/* Result Area */}
        <div style={styles.resultArea}>
          {!isCalculatorMode ? (
            <div style={{...styles.resultCard, borderLeft: `6px solid ${resPlanner.color}`}}>
              <p style={{margin: 0, color: '#666'}}>Khassk tjib f l-final:</p>
              <h1 style={{color: resPlanner.color, margin: '5px 0'}}>{resPlanner.val} / 40</h1>
              <span style={{fontWeight: 'bold', color: resPlanner.color}}>{resPlanner.status}</span>
            </div>
          ) : (
            <div style={{...styles.resultCard, borderLeft: '6px solid #9b59b6'}}>
              <p style={{margin: 0, color: '#666'}}>Nuqttek l-finale f l-module:</p>
              <h1 style={{color: '#9b59b6', margin: '5px 0'}}>{resChecker} / 20</h1>
              <span style={{fontWeight: 'bold', color: '#9b59b6'}}>
                {resChecker >= 10 ? "✅ Valide" : "❌ Rattrapage"}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, sans-serif' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  switchBtn: { padding: '8px 15px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' },
  settingRow: { marginBottom: '20px' },
  select: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', marginLeft: '10px', width: '150px' },
  targetBox: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px' },
  inputTarget: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', width: '60px', textAlign: 'center', fontWeight: 'bold', marginLeft: '10px' },
  grid: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' },
  inputBox: { flex: '1 1 80px', display: 'flex', flexDirection: 'column' },
  input: { padding: '12px', borderRadius: '12px', border: '2px solid #eee', marginTop: '5px', textAlign: 'center', outline: 'none' },
  resultArea: { marginTop: '10px' },
  resultCard: { backgroundColor: '#fdfdfd', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }
};

export default App;