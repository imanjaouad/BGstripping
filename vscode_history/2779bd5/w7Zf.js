import React, { useState, useEffect } from 'react';

const App = () => {
  const [target, setTarget] = useState(15);
  const [examens, setExamens] = useState([
    { id: 1, name: 'Control 1', weight: 20, note: '', status: 'planned' },
    { id: 2, name: 'Control 2', weight: 20, note: '', status: 'planned' },
    { id: 3, name: 'Examen Final', weight: 40, note: '', status: 'planned' },
  ]);

  const [needed, setNeeded] = useState(null);

  // 7isab l-nuqat l-matlouba
  useEffect(() => {
    const totalWeight = examens.reduce((acc, ex) => acc + ex.weight, 0);
    const pointsTarget = (target / 20) * totalWeight;
    
    const pointsAlreadyGained = examens
      .filter(ex => ex.status === 'done')
      .reduce((acc, ex) => acc + parseFloat(ex.note || 0), 0);
    
    const pointsRemaining = pointsTarget - pointsAlreadyGained;
    
    const remainingExams = examens.filter(ex => ex.status === 'planned');
    const remainingWeight = remainingExams.reduce((acc, ex) => acc + ex.weight, 0);

    if (remainingExams.length > 0) {
      const ratio = pointsRemaining / remainingWeight;
      setNeeded({
        pointsRemaining: pointsRemaining.toFixed(2),
        ratio: ratio.toFixed(2), // chhal khass ijib f kola 1 point d coefficient
        impossible: ratio > 1 // ila khassu ijib kter mn l-max (مثلا kter mn 20/20)
      });
    } else {
      setNeeded(null);
    }
  }, [examens, target]);

  const toggleStatus = (id) => {
    setExamens(examens.map(ex => 
      ex.id === id ? { ...ex, status: ex.status === 'done' ? 'planned' : 'done', note: '' } : ex
    ));
  };

  const updateNote = (id, val) => {
    setExamens(examens.map(ex => ex.id === id ? { ...ex, note: val } : ex));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>🚀 System Pro Grade</h1>
        
        {/* Target Section */}
        <div style={styles.targetSection}>
          <label>L-Hadaf dyalk f l-Module (/20): </label>
          <input type="range" min="10" max="20" step="0.5" value={target} onChange={(e)=>setTarget(e.target.value)} />
          <span style={styles.targetValue}>{target}/20</span>
        </div>

        {/* List of Exams */}
        {examens.map(ex => (
          <div key={ex.id} style={{...styles.examRow, borderColor: ex.status === 'done' ? '#2ecc71' : '#3498db'}}>
            <div onClick={() => toggleStatus(ex.id)} style={styles.clickable}>
              <span style={styles.checkbox}>{ex.status === 'done' ? '✅' : '⏳'}</span>
              <strong>{ex.name}</strong> <small>(/{ex.weight})</small>
            </div>
            {ex.status === 'done' ? (
              <input 
                type="number" 
                placeholder="Note" 
                value={ex.note} 
                onChange={(e) => updateNote(ex.id, e.target.value)}
                style={styles.smallInput} 
              />
            ) : (
              <span style={styles.pendingText}>Mazal</span>
            )}
          </div>
        ))}

        {/* Result Section */}
        {needed && (
          <div style={{...styles.resultBox, backgroundColor: needed.impossible ? '#ffdada' : '#d4edda'}}>
            {needed.impossible ? (
              <p style={{color: '#c0392b'}}>❌ <strong>Impossible:</strong> Khassk tjib kter mn l-mahdoud bach toussal l {target}.</p>
            ) : (
              <div>
                <p>Bach toussal l-hadaf dyalk, khassk tjib t9riban:</p>
                <div style={styles.gridResult}>
                  {examens.filter(ex => ex.status === 'planned').map(ex => (
                    <div key={ex.id} style={styles.resItem}>
                      <span>{ex.name}:</span>
                      <span style={styles.resNote}>{(needed.ratio * ex.weight).toFixed(2)} / {ex.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// CSS-in-JS
const styles = {
  container: { backgroundColor: '#1a1a2e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'Segoe UI' },
  card: { backgroundColor: '#16213e', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  header: { textAlign: 'center', marginBottom: '30px', color: '#48dbfb' },
  targetSection: { marginBottom: '30px', textAlign: 'center', backgroundColor: '#0f3460', padding: '15px', borderRadius: '10px' },
  targetValue: { fontSize: '24px', fontWeight: 'bold', marginLeft: '15px', color: '#48dbfb' },
  examRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#0f3460', marginBottom: '10px', borderRadius: '10px', borderLeft: '5px solid' },
  clickable: { cursor: 'pointer', display: 'flex', alignItems: 'center' },
  checkbox: { marginRight: '10px' },
  smallInput: { width: '80px', padding: '8px', borderRadius: '5px', border: 'none', textAlign: 'center' },
  pendingText: { color: '#888', fontStyle: 'italic' },
  resultBox: { marginTop: '30px', padding: '20px', borderRadius: '10px', color: '#333' },
  gridResult: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' },
  resItem: { backgroundColor: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '5px', textAlign: 'center' },
  resNote: { display: 'block', fontSize: '18px', fontWeight: 'bold' }
};

export default App;