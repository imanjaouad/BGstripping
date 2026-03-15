import React, { useState, useEffect } from 'react';

const App = () => {
  const [target, setTarget] = useState(15);
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');
  const [result, setResult] = useState({});

  useEffect(() => {
    // Logic dyal 2 controls (/20) + Final (/40) = 80 pts total
    const currentPoints = (parseFloat(c1) || 0) + (parseFloat(c2) || 0);
    
    // 1. Ch7al khass l-hadaf (Target)
    const pointsNeededForTarget = (target / 20) * 80;
    const finalForTarget = pointsNeededForTarget - currentPoints;

    // 2. Ch7al khass ghir bach t-nji7 (10/20)
    const pointsNeededForPass = (10 / 20) * 80;
    const finalForPass = pointsNeededForPass - currentPoints;

    // 3. Status o Stress Level
    let stress = { label: 'Relax', color: '#2ecc71', emoji: '😎' };
    const finalOutOf20 = finalForTarget / 2;

    if (finalOutOf20 > 18) stress = { label: 'GOD MODE', color: '#e74c3c', emoji: '💀' };
    else if (finalOutOf20 > 15) stress = { label: 'HARDCORE', color: '#e67e22', emoji: '🔥' };
    else if (finalOutOf20 > 12) stress = { label: 'FOCUS', color: '#f1c40f', emoji: '📚' };
    else if (finalOutOf20 > 10) stress = { label: 'NORMAL', color: '#3498db', emoji: '✍️' };

    setResult({
      finalNeeded: finalForTarget.toFixed(2),
      finalPass: finalForPass > 0 ? finalForPass.toFixed(2) : 0,
      stress: stress,
      isPossible: finalForTarget <= 40
    });
  }, [target, c1, c2]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Grade Master V3 🚀</h2>

        {/* Input Section */}
        <div style={styles.section}>
          <label style={styles.label}>Hadaf dyalk (Target): <span style={{color: result.stress?.color}}>{target}/20</span></label>
          <input type="range" min="10" max="20" step="0.5" value={target} onChange={(e)=>setTarget(e.target.value)} style={styles.range} />
        </div>

        <div style={styles.grid}>
          <div style={styles.inputBox}>
            <label>Control 1 (/20)</label>
            <input type="number" value={c1} onChange={(e)=>setC1(e.target.value)} placeholder="0" style={styles.input} />
          </div>
          <div style={styles.inputBox}>
            <label>Control 2 (/20)</label>
            <input type="number" value={c2} onChange={(e)=>setC2(e.target.value)} placeholder="0" style={styles.input} />
          </div>
        </div>

        {/* Dynamic Results */}
        <div style={{...styles.stressCard, backgroundColor: result.stress?.color}}>
          <span style={{fontSize: '30px'}}>{result.stress?.emoji}</span>
          <div>
            <h4 style={{margin: 0}}>Level: {result.stress?.label}</h4>
            <small>Bach tjib {target}, khassk {result.finalNeeded}/40 f l-final</small>
          </div>
        </div>

        <div style={styles.resultsGrid}>
          <div style={styles.resCard}>
            <p>Khassk l-hadaf:</p>
            <h3>{result.isPossible ? `${result.finalNeeded}/40` : 'Impossible'}</h3>
            <small>({(result.finalNeeded/2).toFixed(2)} / 20)</small>
          </div>
          <div style={{...styles.resCard, borderLeft: '4px solid #2ecc71'}}>
            <p>Marge de Sécurité:</p>
            <h3>{result.finalPass}/40</h3>
            <small>Bach tjib ghir 10/20</small>
          </div>
        </div>

        {/* Motivation Message */}
        <div style={styles.motivation}>
          {result.isPossible ? (
            target > 16 ? "🌟 Rak kbir, ghadi tjibha insha'Allah! Dir l-moshoud." : "👍 Kolshi momkin, rkez ghir chwiya f l-final."
          ) : (
            "⚠️ Hadaf s3ib chwiya b had l-nuqat, walakin mat-fshilch!"
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui', padding: '15px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  title: { textAlign: 'center', marginBottom: '25px', color: '#1a1a1a' },
  section: { marginBottom: '20px' },
  label: { fontWeight: 'bold', fontSize: '14px', color: '#555' },
  range: { width: '100%', cursor: 'pointer', marginTop: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  inputBox: { display: 'flex', flexDirection: 'column' },
  input: { padding: '12px', borderRadius: '10px', border: '2px solid #eee', fontSize: '16px', marginTop: '5px' },
  stressCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', color: '#white', marginBottom: '20px', transition: '0.5s' },
  resultsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  resCard: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', textAlign: 'center' },
  motivation: { marginTop: '20px', textAlign: 'center', fontStyle: 'italic', color: '#777', fontSize: '14px' }
};

export default App;