import React, { useState, useEffect } from "react";

// Native SVG Checkmark
const CheckIcon = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
    strokeLinejoin="round" className={className} style={style}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// --- DATA & LEVELS ---
const STAGES = { INTRO: 0, BASICS: 1, COUNTING: 2, SCALES: 3, TCHART: 4, TYPING: 5, FINISH: 6 };

const basicsQuiz = [
  { question: "In a chemical equation, what do we call the substances on the LEFT side of the arrow?", options: ["Products", "Reactants", "Yields", "Coefficients"], answer: "Reactants" },
  { question: "What does the arrow (➔) in a chemical equation mean?", options: ["Equals", "Destroys", "Yields / Produces", "Reverses"], answer: "Yields / Produces" },
  { question: "Which number are you ALLOWED to change when balancing an equation?", options: ["The small Subscript", "The big Coefficient", "The Atomic Mass", "None of them"], answer: "The big Coefficient" }
];

const countingQuiz = [
  { formula: "3 H₂O", question: "How many total HYDROGEN (H) atoms?", answer: "6" },
  { formula: "3 H₂O", question: "How many total OXYGEN (O) atoms?", answer: "3" },
  { formula: "2 Ca(NO₃)₂", question: "How many total OXYGEN (O) atoms? (Hint: Multiply coefficient by outside subscript, then by inside subscript!)", answer: "12" },
  { formula: "2 Ca(NO₃)₂", question: "How many total NITROGEN (N) atoms?", answer: "4" }
];

const equations = {
  scales: [
    { reactants: [{ symbol: 'H', sub: 2, label: 'H₂' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'H', sub: 2 }, { symbol: 'O', sub: 1 }], label: 'H₂O' }], target: [2, 1, 2], elements: ['H', 'O'] },
    { reactants: [{ symbol: 'Na', sub: 1, label: 'Na' }, { symbol: 'Cl', sub: 2, label: 'Cl₂' }], products: [{ parts: [{ symbol: 'Na', sub: 1 }, { symbol: 'Cl', sub: 1 }], label: 'NaCl' }], target: [2, 1, 2], elements: ['Na', 'Cl'] },
    { reactants: [{ symbol: 'N', sub: 2, label: 'N₂' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'N', sub: 1 }, { symbol: 'O', sub: 2 }], label: 'NO₂' }], target: [1, 2, 2], elements: ['N', 'O'] }
  ],
  tchart: [
    { reactants: [{ symbol: 'N', sub: 2, label: 'N₂' }, { symbol: 'H', sub: 2, label: 'H₂' }], products: [{ parts: [{ symbol: 'N', sub: 1 }, { symbol: 'H', sub: 3 }], label: 'NH₃' }], target: [1, 3, 2], elements: ['N', 'H'] },
    { reactants: [{ symbol: 'Mg', sub: 1, label: 'Mg' }, { symbol: 'Cl', sub: 2, label: 'Cl₂' }], products: [{ parts: [{ symbol: 'Mg', sub: 1 }, { symbol: 'Cl', sub: 2 }], label: 'MgCl₂' }], target: [1, 1, 1], elements: ['Mg', 'Cl'] }
  ]
};

// MASTER POOL for Independent Practice
const typingPool = [
  { reactants: [{ symbol: 'K', sub: 1, label: 'K' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'K', sub: 2 }, { symbol: 'O', sub: 1 }], label: 'K₂O' }], target: [4, 1, 2], elements: ['K', 'O'] },
  { reactants: [{ symbol: 'C', sub: 1, label: 'C' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'C', sub: 1 }, { symbol: 'O', sub: 2 }], label: 'CO₂' }], target: [1, 1, 1], elements: ['C', 'O'] },
  { reactants: [{ symbol: 'Li', sub: 1, label: 'Li' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'Li', sub: 2 }, { symbol: 'O', sub: 1 }], label: 'Li₂O' }], target: [4, 1, 2], elements: ['Li', 'O'] },
  { reactants: [{ symbol: 'Mg', sub: 1, label: 'Mg' }, { symbol: 'N', sub: 2, label: 'N₂' }], products: [{ parts: [{ symbol: 'Mg', sub: 3 }, { symbol: 'N', sub: 2 }], label: 'Mg₃N₂' }], target: [3, 1, 1], elements: ['Mg', 'N'] },
  { reactants: [{ symbol: 'H', sub: 2, label: 'H₂' }, { symbol: 'Cl', sub: 2, label: 'Cl₂' }], products: [{ parts: [{ symbol: 'H', sub: 1 }, { symbol: 'Cl', sub: 1 }], label: 'HCl' }], target: [1, 1, 2], elements: ['H', 'Cl'] },
  { reactants: [{ symbol: 'Al', sub: 1, label: 'Al' }, { symbol: 'Cl', sub: 2, label: 'Cl₂' }], products: [{ parts: [{ symbol: 'Al', sub: 1 }, { symbol: 'Cl', sub: 3 }], label: 'AlCl₃' }], target: [2, 3, 2], elements: ['Al', 'Cl'] },
  { reactants: [{ symbol: 'Ca', sub: 1, label: 'Ca' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'Ca', sub: 1 }, { symbol: 'O', sub: 1 }], label: 'CaO' }], target: [2, 1, 2], elements: ['Ca', 'O'] },
  { reactants: [{ symbol: 'Ba', sub: 1, label: 'Ba' }, { symbol: 'N', sub: 2, label: 'N₂' }], products: [{ parts: [{ symbol: 'Ba', sub: 3 }, { symbol: 'N', sub: 2 }], label: 'Ba₃N₂' }], target: [3, 1, 1], elements: ['Ba', 'N'] },
  { reactants: [{ symbol: 'P', sub: 4, label: 'P₄' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'P', sub: 2 }, { symbol: 'O', sub: 5 }], label: 'P₂O₅' }], target: [1, 5, 2], elements: ['P', 'O'] },
  { reactants: [{ symbol: 'S', sub: 8, label: 'S₈' }, { symbol: 'O', sub: 2, label: 'O₂' }], products: [{ parts: [{ symbol: 'S', sub: 1 }, { symbol: 'O', sub: 3 }], label: 'SO₃' }], target: [1, 12, 8], elements: ['S', 'O'] },
  { reactants: [{ symbol: 'N', sub: 2, label: 'N₂' }, { symbol: 'H', sub: 2, label: 'H₂' }], products: [{ parts: [{ symbol: 'N', sub: 1 }, { symbol: 'H', sub: 3 }], label: 'NH₃' }], target: [1, 3, 2], elements: ['N', 'H'] },
  { reactants: [{ symbol: 'Na', sub: 1, label: 'Na' }, { symbol: 'Br', sub: 2, label: 'Br₂' }], products: [{ parts: [{ symbol: 'Na', sub: 1 }, { symbol: 'Br', sub: 1 }], label: 'NaBr' }], target: [2, 1, 2], elements: ['Na', 'Br'] }
];

export default function App() {
  const [stage, setStage] = useState(STAGES.INTRO);
  const [level, setLevel] = useState(0);
  const [coefficients, setCoefficients] = useState([1, 1, 1, 1]); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [studentName, setStudentName] = useState("");
  const [randomTypingEqs, setRandomTypingEqs] = useState([]);
  
  // NEW: Tracks the history of atom counts for the strikethrough effect
  const [atomHistory, setAtomHistory] = useState({});

  const sendLiveUpdate = async (statusMessage) => {
    if (!studentName.trim()) return;
    try {
      await fetch("https://script.google.com/macros/s/AKfycbzaG3R17PuK9admdJc4Eio0EISobnn8RUobV4JLE1Q6rlsFTYtmkyBfUxVPBxR2cr2IvQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ studentName: studentName, status: statusMessage })
      });
    } catch (error) { console.error("Tracking error", error); }
  };

  const startTraining = () => {
    sendLiveUpdate("Started App");
    const shuffledPool = [...typingPool].sort(() => 0.5 - Math.random());
    setRandomTypingEqs(shuffledPool.slice(0, 5));
    setStage(STAGES.BASICS);
  };

  const proceed = () => {
    setShowSuccess(false);
    setFeedback("");
    setCoefficients([1, 1, 1, 1]);
    setAtomHistory({}); // Clear history for the new equation

    let maxLevel = 0;
    if (stage === STAGES.BASICS) maxLevel = basicsQuiz.length - 1;
    if (stage === STAGES.COUNTING) maxLevel = countingQuiz.length - 1;
    if (stage === STAGES.SCALES) maxLevel = equations.scales.length - 1;
    if (stage === STAGES.TCHART) maxLevel = equations.tchart.length - 1;
    if (stage === STAGES.TYPING) maxLevel = randomTypingEqs.length - 1; 

    if (level < maxLevel) {
      setLevel(level + 1);
    } else {
      const nextStage = stage + 1;
      setLevel(0);
      setStage(nextStage);
      const stageNames = ["Intro", "Part 1: Basics", "Part 2: Counting", "Part 3: Scales", "Part 4: T-Chart", "Part 5: Independent Practice", "Finished!"];
      sendLiveUpdate(`Working on: ${stageNames[nextStage]}`);
    }
  };

  const renderSuccessModal = (message, buttonText = "Next Challenge ➔") => (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#22c55e', margin: '0 0 16px 0' }}>Success! 🎉</h2>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
          {message}
        </div>
        <button onClick={proceed} style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '16px 40px', borderRadius: '999px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer', width: '100%' }}>
          {buttonText}
        </button>
      </div>
    </div>
  );

  const getAtomCount = (molecule, coeff, element) => {
    if (!molecule) return 0;
    if (molecule.parts) {
      const part = molecule.parts.find(p => p.symbol === element);
      return part ? part.sub * coeff : 0;
    }
    return molecule.symbol === element ? molecule.sub * coeff : 0;
  };

  // Helper hook to update the strikethrough history whenever coefficients change
  useEffect(() => {
    if (stage !== STAGES.TCHART && stage !== STAGES.TYPING) return;
    
    const currentData = stage === STAGES.TYPING ? randomTypingEqs : equations.tchart;
    if (!currentData || !currentData[level]) return;
    
    const q = currentData[level];
    const newLeft = {};
    const newRight = {};
    
    q.elements.forEach(el => { 
      newLeft[el] = getAtomCount(q.reactants[0], coefficients[0], el) + getAtomCount(q.reactants[1], coefficients[1], el);
      newRight[el] = getAtomCount(q.products[0], coefficients[2], el) + getAtomCount(q.products[1], coefficients[3], el);
    });

    setAtomHistory(prev => {
      let hasChange = false;
      const nextHistory = { ...prev };
      
      if (Object.keys(nextHistory).length === 0) {
          q.elements.forEach(el => {
              nextHistory[el] = { left: [newLeft[el]], right: [newRight[el]] };
          });
          return nextHistory;
      }

      q.elements.forEach(el => {
          if (!nextHistory[el]) nextHistory[el] = { left: [], right: [] };
          
          const lArr = nextHistory[el].left;
          if (lArr[lArr.length - 1] !== newLeft[el]) {
              nextHistory[el] = { ...nextHistory[el], left: [...lArr, newLeft[el]] };
              hasChange = true;
          }
          const rArr = nextHistory[el].right;
          if (rArr[rArr.length - 1] !== newRight[el]) {
              nextHistory[el] = { ...nextHistory[el], right: [...rArr, newRight[el]] };
              hasChange = true;
          }
      });
      return hasChange ? nextHistory : prev;
    });
  }, [coefficients, level, stage, randomTypingEqs]);

  const renderCardButton = (index, data, mode) => {
    if (!data) return null;
    return (
      <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '12px', border: '2px solid #e2e8f0', padding: '8px', alignItems: 'center', minWidth: '130px', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        {mode === 'typing' ? (
          <input 
            type="number" 
            min="1" 
            value={coefficients[index] || 1} 
            onChange={(e) => {
              let newC = [...coefficients];
              newC[index] = Number(e.target.value) || 1;
              setCoefficients(newC);
            }}
            style={{ width: '48px', height: '48px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', borderRadius: '8px', border: '2px solid #cbd5e1', marginRight: '12px', color: '#1e293b' }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '12px', gap: '4px' }}>
            <button onClick={() => { let newC = [...coefficients]; newC[index]++; setCoefficients(newC); }} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>+</button>
            <button onClick={() => { if (coefficients[index] > 1) { let newC = [...coefficients]; newC[index]--; setCoefficients(newC); } }} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>-</button>
          </div>
        )}
        {mode !== 'typing' && <div style={{ fontSize: '36px', fontWeight: '900', color: '#cbd5e1', marginRight: '8px', userSelect: 'none' }}>{coefficients[index]}</div>}
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{data.label}</div>
      </div>
    );
  };

  const getBalancedString = (q, coeffs) => {
    let left = q.reactants.map((r, i) => `${coeffs[i]}${r.label}`).join(' + ');
    let right = q.products.map((p, i) => `${coeffs[i + q.reactants.length]}${p.label}`).join(' + ');
    return `${left} ➔ ${right}`;
  };

  const renderBalancer = (mode, eqData) => {
    const currentData = mode === 'typing' ? randomTypingEqs : eqData;
    const q = currentData[level];
    
    const leftAtoms = {};
    const rightAtoms = {};
    
    q.elements.forEach(el => { 
      leftAtoms[el] = getAtomCount(q.reactants[0], coefficients[0], el) + getAtomCount(q.reactants[1], coefficients[1], el);
      rightAtoms[el] = getAtomCount(q.products[0], coefficients[2], el) + getAtomCount(q.products[1], coefficients[3], el);
    });

    const isBalanced = q.elements.every(el => leftAtoms[el] === rightAtoms[el]) && 
                       q.target.every((val, index) => val === coefficients[index]);

    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: '#64748b', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase' }}>
            {mode === 'scales' && "Part 3: Visual Scales"}
            {mode === 'tchart' && "Part 4: The T-Chart"}
            {mode === 'typing' && "Part 5: Independent Practice"}
            <span style={{ float: 'right' }}>Level {level + 1} of {currentData.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', backgroundColor: '#f1f5f9', padding: '32px', borderRadius: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px' }}>
             {renderCardButton(0, q.reactants[0], mode)}
             {q.reactants[1] && <span style={{ fontSize: '32px', fontWeight: '900', color: '#94a3b8' }}>+</span>}
             {renderCardButton(1, q.reactants[1], mode)}
          </div>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#94a3b8' }}>➔</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px' }}>
             {renderCardButton(2, q.products[0], mode)}
             {q.products[1] && <span style={{ fontSize: '32px', fontWeight: '900', color: '#94a3b8' }}>+</span>}
             {q.products[1] && renderCardButton(3, q.products[1], mode)}
          </div>
        </div>

        {/* SCALES MODE */}
        {mode === 'scales' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {q.elements.map(el => {
              const isElBalanced = leftAtoms[el] === rightAtoms[el];
              const rotateDeg = isElBalanced ? 0 : (leftAtoms[el] > rightAtoms[el] ? -12 : 12);
              return (
                <div key={el} style={{ position: 'relative', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '24px', padding: '32px 24px 24px', width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'absolute', top: '-20px', backgroundColor: '#4f46e5', color: '#ffffff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', border: '4px solid #ffffff' }}>{el}</div>
                  <div style={{ width: '100%', height: '140px', position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', position: 'absolute', bottom: '46px', zIndex: 10, transform: `rotate(${rotateDeg}deg)`, transformOrigin: 'center bottom', transition: 'transform 0.4s ease' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '20px', backgroundColor: isElBalanced ? '#22c55e' : '#3b82f6', transition: 'background-color 0.4s ease' }}>{leftAtoms[el]}</div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '20px', backgroundColor: isElBalanced ? '#22c55e' : '#f97316', transition: 'background-color 0.4s ease' }}>{rightAtoms[el]}</div>
                    </div>
                    <div style={{ width: '100%', height: '12px', borderRadius: '6px', position: 'absolute', bottom: '40px', backgroundColor: '#334155', transform: `rotate(${rotateDeg}deg)`, transformOrigin: 'center', transition: 'transform 0.4s ease' }}></div>
                    <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '24px solid #475569', position: 'absolute', bottom: '16px' }}></div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '8px', display: 'flex', alignItems: 'center', color: isElBalanced ? '#16a34a' : '#64748b' }}>
                    {isElBalanced ? <><CheckIcon style={{ marginRight: '6px' }}/> Balanced</> : 'Unbalanced'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* T-CHART AND TYPING MODE (History Strikethrough Logic) */}
        {(mode === 'tchart' || mode === 'typing') && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '400px', margin: '0 auto', border: '2px solid #e2e8f0', marginTop: mode === 'typing' ? '24px' : '0' }}>
            <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '4px solid #1e293b' }}>
                  <th style={{ paddingBottom: '12px', color: '#3b82f6', fontSize: '20px' }}>Reactants</th>
                  <th style={{ paddingBottom: '12px', color: '#94a3b8' }}>|</th>
                  <th style={{ paddingBottom: '12px', color: '#f97316', fontSize: '20px' }}>Products</th>
                </tr>
              </thead>
              <tbody>
                {q.elements.map(el => {
                  const match = leftAtoms[el] === rightAtoms[el];
                  
                  // Disable the green highlight entirely if we are in typing mode to prevent them from relying on it
                  const isGreenHighlight = match && mode !== 'typing'; 
                  
                  const history = atomHistory[el] || { left: [leftAtoms[el]], right: [rightAtoms[el]] };

                  // Helper function to render the crossed-out history list
                  const renderHistoryList = (arr) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                      {arr.map((val, idx) => {
                        const isLast = idx === arr.length - 1;
                        return (
                          <span key={idx} style={{
                            textDecoration: isLast ? 'none' : 'line-through',
                            color: isLast ? (isGreenHighlight ? '#16a34a' : '#1e293b') : '#94a3b8',
                            fontWeight: isLast && isGreenHighlight ? 'bold' : 'normal',
                            fontSize: '24px'
                          }}>
                            {val}
                          </span>
                        );
                      })}
                    </div>
                  );

                  return (
                    <tr key={el} style={{ backgroundColor: isGreenHighlight ? '#f0fdf4' : 'transparent', transition: 'background-color 0.3s' }}>
                      <td style={{ padding: '16px 0' }}>{renderHistoryList(history.left)}</td>
                      <td style={{ padding: '16px 0', backgroundColor: '#f8fafc', borderLeft: '2px solid #e2e8f0', borderRight: '2px solid #e2e8f0', fontWeight: 'bold', fontSize: '20px' }}>{el}</td>
                      <td style={{ padding: '16px 0' }}>{renderHistoryList(history.right)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TYPING CHECK BUTTON */}
        {mode === 'typing' && (
           <div style={{ textAlign: 'center', marginTop: '24px' }}>
             <button 
                onClick={() => isBalanced ? setShowSuccess(true) : setFeedback("Not balanced yet. Check your totals, or make sure your coefficients can't be reduced!")}
                style={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold', padding: '16px 48px', borderRadius: '999px', fontSize: '20px', border: 'none', cursor: 'pointer' }}>
                Check Answer
             </button>
             {feedback && <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '16px' }}>{feedback}</p>}
           </div>
        )}

        {/* Auto-Check for Scales and T-Chart */}
        {(mode === 'scales' || mode === 'tchart') && isBalanced && !showSuccess && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button 
              onClick={() => setShowSuccess(true)} 
              style={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold', padding: '16px 48px', borderRadius: '999px', fontSize: '20px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              Lock it in!
            </button>
          </div>
        )}

        {showSuccess && renderSuccessModal(getBalancedString(q, q.target))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '24px', color: '#1e293b' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Mr. M's Equation Balancer</div>
          <div style={{ fontSize: '12px', fontWeight: '900', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {stage > 0 && studentName ? `${studentName} • Stage ${stage}/5` : "Setup"}
          </div>
        </header>

        <main>
          {stage === STAGES.INTRO && (
            <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px' }}>Welcome to Lab Prep!</h1>
              <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '32px' }}>Before we hit the paper lab sheets, let's master the Law of Conservation of Mass.</p>
              <input 
                type="text" 
                placeholder="First and Last Name" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                style={{ width: '100%', maxWidth: '400px', padding: '16px', borderRadius: '12px', border: '2px solid #cbd5e1', fontSize: '20px', textAlign: 'center', marginBottom: '32px' }}
              />
              <br/>
              <button 
                onClick={startTraining}
                disabled={!studentName.trim()}
                style={{ backgroundColor: studentName.trim() ? '#2563eb' : '#94a3b8', color: '#ffffff', fontWeight: 'bold', padding: '16px 48px', borderRadius: '999px', fontSize: '20px', border: 'none', cursor: studentName.trim() ? 'pointer' : 'not-allowed' }}>
                Start Training ➔
              </button>
            </div>
          )}

          {stage === STAGES.BASICS && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Part 1: The Basics</h2>
              <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '22px', marginBottom: '24px' }}>{basicsQuiz[level].question}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {basicsQuiz[level].options.map(opt => (
                    <button key={opt} onClick={() => { if (opt === basicsQuiz[level].answer) setShowSuccess(true); else setFeedback("Not quite. Try again!"); }}
                      style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f0f9ff', border: '2px solid #bae6fd', color: '#0369a1', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
                      {opt}
                    </button>
                  ))}
                </div>
                {feedback && <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '16px' }}>{feedback}</p>}
              </div>
              {showSuccess && renderSuccessModal("Great job! You know your vocabulary.")}
            </div>
          )}

          {stage === STAGES.COUNTING && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Part 2: Counting Atoms</h2>
              <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '72px', fontWeight: '900', color: '#2563eb', marginBottom: '32px' }}>{countingQuiz[level].formula}</div>
                <p style={{ fontSize: '22px', marginBottom: '24px' }}>{countingQuiz[level].question}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <input type="number" id="countAnswer" style={{ border: '4px solid #cbd5e1', borderRadius: '12px', fontSize: '24px', textAlign: 'center', width: '120px', padding: '8px' }} placeholder="?" />
                  <button onClick={() => { if (document.getElementById('countAnswer').value === countingQuiz[level].answer) setShowSuccess(true); else setFeedback("Check your math!"); }}
                    style={{ backgroundColor: '#22c55e', color: '#ffffff', fontWeight: 'bold', padding: '12px 32px', borderRadius: '12px', fontSize: '20px', border: 'none', cursor: 'pointer' }}>
                    Check
                  </button>
                </div>
                {feedback && <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '24px' }}>{feedback}</p>}
              </div>
              {showSuccess && renderSuccessModal(`Correct! There are ${countingQuiz[level].answer} atoms.`)}
            </div>
          )}

          {stage === STAGES.SCALES && renderBalancer('scales', equations.scales)}
          {stage === STAGES.TCHART && renderBalancer('tchart', equations.tchart)}
          {stage === STAGES.TYPING && renderBalancer('typing', equations.typing)}
          
          {stage === STAGES.FINISH && (
             <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#16a34a', marginBottom: '24px' }}>You're Ready!</h1>
              <p style={{ fontSize: '22px', color: '#64748b', marginBottom: '32px' }}>You've mastered the vocabulary, the T-chart, and independent balancing.</p>
              <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '24px', borderRadius: '16px', fontWeight: 'bold', fontSize: '24px', border: '2px solid #86efac' }}>
                ✅ Status marked as Complete! Grab your paper worksheet, {studentName.split(' ')[0]}.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}