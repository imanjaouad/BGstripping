import React, { useState, useEffect } from 'react';

const App = () => {
  const [mode, setMode] = useState('planner'); // 'planner' aw 'checker'
  const [numControls, setNumControls] = useState(2);
  const [target, setTarget] = useState(15);
  const [notes, setNotes] = useState({ c1: '', c2: '', c3: '', final: '' });
  const [result, setResult] = useState({});

  useEffect(() => {
    const totalMax = (numControls * 20) + 40;
    const n1 = parseFloat(notes.c1) || 0;
    const n2 = parseFloat(notes.c2) || 0;
    const n3 = numControls === 3 ? (parseFloat(notes.c3) || 0) : 0;
    const fEx = parseFloat(notes.final) || 0;

    if (mode === 'planner') {
      // Logic Planner: Ch7al khassni f l-final
      const totalNeeded = (target / 20) * totalMax;
      const sumControls = n1 + n2 + n3;
      const needed = totalNeeded - sumControls;
      
      let stress = { label: 'Relax', color: '#2ecc71', emoji: '😎' };
      if (needed / 40 > 1) stress = { label: 'Impossible', color: '#e74c3c', emoji: '🚫' };
      else if (needed / 40 > 0.8) stress = { label: 'Hardcore', color: '#e67e22', emoji: '🔥' };

      setResult({ needed: needed.toFixed(2), stress });
    } else {
      // Logic Checker: Ch7al jbt f l-module bse7
      const totalAchieved = n1 + n2 + n3 + fEx;
      const finalGrade = (totalAchieved / totalMax) * 20;
      
      let status = { label: 'Échec', color: '#e74c3c' };
      if (finalGrade >= 16) status = { label: 'Très Bien', color: '#9b59b6' };
      else if (finalGrade >= 14) status = { label: 'Bien', color: '#3498db' };
      else if (finalGrade >= 12) status = { label: 'Assez Bien', color: '#2ecc71' };
      else if (finalGrade >= 10) status = { label: 'Passable', color: '#27ae60' };

      setResult({ finalGrade: finalGrade.toFixed(2), status });
    }
  }, [mode, numControls, target, notes]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>System Grade Master 🎓</h2>

        {/* Mode Switcher */}
        <div style={styles.tabGroup}>
          <button 
            onClick={() => setMode('planner')}
            style={{...styles.tab, borderBottom: mode === 'planner' ? '3px solid #3498db' : 'none', color: mode === 'planner' ? '#3498db' : '#95a5a6'}}
          >🎯 Planner</button>
          <button 
            onClick={() => setMode('checker')}
            style={{...styles.tab, borderBottom: mode === 'checker' ? '3px solid #3498db' : 'none', color: mode === 'checker' ? '#3498db' : '#95a5a6'}}
          >📊 Result Checker</button>
        </div>

        {/* Common Settings */}
        <div style={styles.settings}>
          <div style={{flex: 1}}>
            <label style={styles.label}>Mode Module:</label>
            <select value={numControls} onChange={(e)=>setNumControls(parseInt(e.target.value))} style={styles.select}>
              <option value={2}>2 Controls + Final</option>
              <option value={3}>3 Controls + Final</option>
            </select>
          </div>
          {mode === 'planner' && (
            <div style={{flex: 1}}>
              <label style={styles.label}>Hadaf dyalk (/20):</label>
              <input type="number" value={target} onChange={(e)=>setTarget(e.target.value)} style={styles.select} />
            </div>
          )}
        </div>

        {/* Inputs Grid */}
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
          {mode === 'checker' && (
            <div style={styles.inputBox}>
              <label>FINAL (/40)</label>
              <input type="number" value={notes.final} onChange={(e)=>setNotes({...notes, final: e.target.value})} style={{...styles.input, borderColor: '#3498db'}} placeholder="0" />
            </div>
          )}
        </div>

        {/* Display Results */}
        <div style={styles.resultArea}>
          {mode === 'planner' ? (
            <div style={{...styles.statusBox, backgroundColor: result.stress?.color}}>
              <span>{result.stress?.emoji}</span>
              <div>
                <p style={{margin: 0, fontSize: '13px'}}>Khassk tjib f l-final (/40):</p>
                <h2 style={{margin: 0}}>{result.needed}</h2>
                <small>({(result.needed/2).toFixed(2)} / 20)</small>
              </div>
            </div>
          ) : (
            <div style={{...styles.statusBox, backgroundColor: result.status?.color}}>
              <span>🏁</span>
              <div>
                <p style={{margin: 0, fontSize: '13px'}}>La Note Finale dyalk:</p>
                <h2 style={{margin: 0}}>{result.finalGrade} / 20</h2>
                <small>Mention: {result.status?.label}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial', padding: '15px' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '20px' },
  tabGroup: { display: 'flex', marginBottom: '25px', borderBottom: '1px solid #eee' },
  tab: { flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  settings: { display: 'flex', gap: '15px', marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', color: '#7f8c8d', marginBottom: '5px', fontWeight: 'bold' },
  select: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px', marginBottom: '25px' },
  inputBox: { display: 'flex', flexDirection: 'column' },
  input: { padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '16px', outline: 'none', transition: '0.3s' },
  resultArea: { marginTop: '10px' },
  statusBox: { padding: '20px', borderRadius: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '20px', transition: '0.5s' }
};

export default App;