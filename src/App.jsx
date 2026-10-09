import React, { useState } from 'react';

// Native SVG Checkmark to replace lucide-react
const CheckIcon = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const STAGES = {
  SCALES: 3,
};

const equations = {
  scales: [
    {
      title: 'Making Water',
      reactants: [
        { symbol: 'H', sub: 2, label: 'H₂' },
        { symbol: 'O', sub: 2, label: 'O₂' },
      ],
      products: [
        {
          parts: [
            { symbol: 'H', sub: 2 },
            { symbol: 'O', sub: 1 },
          ],
          label: 'H₂O',
        },
      ],
      target: [2, 1, 2],
      elements: ['H', 'O'],
    },
  ],
};

export default function App() {
  const [stage, setStage] = useState(STAGES.SCALES);
  const [level, setLevel] = useState(0);
  const [coefficients, setCoefficients] = useState([1, 1, 1]);

  const renderCardButton = (index, data, isReactant) => {
    if (!data) return null;
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          minWidth: '140px',
          justifyContent: 'center',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '12px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => {
              let newCoeffs = [...coefficients];
              newCoeffs[index]++;
              setCoefficients(newCoeffs);
            }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              if (coefficients[index] > 1) {
                let newCoeffs = [...coefficients];
                newCoeffs[index]--;
                setCoefficients(newCoeffs);
              }
            }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            -
          </button>
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#e2e8f0',
            marginRight: '8px',
            userSelect: 'none',
          }}
        >
          {coefficients[index]}
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#1e293b',
            letterSpacing: '-0.025em',
          }}
        >
          {data.label}
        </div>
      </div>
    );
  };

  const renderBalancer = (mode, eqData) => {
    const q = eqData[level];
    const leftAtoms = {};
    const rightAtoms = {};
    q.elements.forEach((el) => {
      leftAtoms[el] = 0;
      rightAtoms[el] = 0;
    });

    q.reactants.forEach((r, idx) => {
      leftAtoms[r.symbol] += r.sub * coefficients[idx];
    });
    q.products[0].parts.forEach((p) => {
      rightAtoms[p.symbol] += p.sub * coefficients[2];
    });

    const isBalanced = q.target.every(
      (val, index) => val === coefficients[index]
    );

    return (
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', position: 'relative' }}
      >
        {/* Header Area */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#94a3b8',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Level {level + 1} of {eqData.length}
              </div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: '900',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {q.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Equation Area */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '48px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          {/* Reactants wrapper */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #eff6ff',
              backgroundColor: '#f4f7fb',
            }}
          >
            {renderCardButton(0, q.reactants[0], true)}
            <span
              style={{ fontSize: '30px', fontWeight: '900', color: '#cbd5e1' }}
            >
              +
            </span>
            {renderCardButton(1, q.reactants[1], true)}
          </div>

          <div
            style={{ fontSize: '48px', fontWeight: '900', color: '#94a3b8' }}
          >
            ➔
          </div>

          {/* Products wrapper */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #fff7ed',
              backgroundColor: '#fff9f0',
            }}
          >
            {renderCardButton(2, q.products[0], false)}
          </div>
        </div>

        {/* Visual Scales Area */}
        <div>
          <div
            style={{
              textAlign: 'center',
              color: '#64748b',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              fontSize: '14px',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            Check the scales
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
            }}
          >
            {q.elements.map((el) => {
              const isElBalanced = leftAtoms[el] === rightAtoms[el];

              return (
                <div
                  key={el}
                  style={{
                    position: 'relative',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    width: '256px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '32px',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  }}
                >
                  {/* Element Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      backgroundColor: '#4f46e5',
                      color: '#fff',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      border: '4px solid #fff',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    }}
                  >
                    {el}
                  </div>

                  {/* Scale Mechanism */}
                  <div
                    style={{
                      width: '100%',
                      height: '160px',
                      relative: 'position',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      paddingBottom: '48px',
                      marginTop: '16px',
                      position: 'relative',
                    }}
                  >
                    {/* Weights */}
                    <div
                      style={{
                        transform: isElBalanced
                          ? 'rotate(0deg)'
                          : leftAtoms[el] > rightAtoms[el]
                          ? 'rotate(-10deg)'
                          : 'rotate(10deg)',
                        transformOrigin: 'center bottom',
                        transition: 'transform 500ms ease-in-out',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0 16px',
                        position: 'absolute',
                        bottom: '48px',
                        zIndex: 10,
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Left Box */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '900',
                          fontSize: '24px',
                          transition: 'background-color 300ms',
                          backgroundColor: isElBalanced ? '#22c55e' : '#3b82f6',
                        }}
                      >
                        {leftAtoms[el]}
                      </div>

                      {/* Right Box */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '900',
                          fontSize: '24px',
                          transition: 'background-color 300ms',
                          backgroundColor: isElBalanced ? '#22c55e' : '#f97316',
                        }}
                      >
                        {rightAtoms[el]}
                      </div>
                    </div>

                    {/* Scale Beam */}
                    <div
                      style={{
                        width: '100%',
                        height: '14px',
                        borderRadius: '9999px',
                        position: 'absolute',
                        bottom: '44px',
                        transition: 'all 500ms ease-in-out',
                        backgroundColor: '#334155',
                        transform: isElBalanced
                          ? 'rotate(0deg)'
                          : leftAtoms[el] > rightAtoms[el]
                          ? 'rotate(-10deg)'
                          : 'rotate(10deg)',
                        transformOrigin: 'center',
                      }}
                    ></div>

                    {/* Pivot Triangle */}
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '18px solid transparent',
                        borderRight: '18px solid transparent',
                        borderBottom: '28px solid #475569',
                        position: 'absolute',
                        bottom: '16px',
                      }}
                    ></div>
                  </div>

                  {/* Status Text */}
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      color: isElBalanced ? '#16a34a' : '#334155',
                    }}
                  >
                    {isElBalanced ? (
                      <>
                        <CheckIcon style={{ marginRight: '4px' }} />
                        Balanced
                      </>
                    ) : (
                      'Unbalanced'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '16px',
        color: '#1e293b',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '48px',
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div
            style={{ fontSize: '24px', color: '#475569', marginLeft: '16px' }}
          >
            Equation Balancer
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '900',
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginRight: '16px',
            }}
          >
            BEN • STAGE 3 / 5
          </div>
        </header>

        <main>
          {stage === STAGES.SCALES &&
            renderBalancer('scales', equations.scales)}
        </main>
      </div>
    </div>
  );
}
