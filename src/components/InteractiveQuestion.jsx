import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function InteractiveQuestion({ content }) {
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = (e) => {
    setAnswered(true);

    // Trigger celebratory heart confetti
    const rect = e.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x, y },
      colors: ['#ff758f', '#ff4d6d', '#fff', '#ffd1dc']
    });
  };

  return (
    <section id="section-interactive" className="section">
      <div className="card-base interactive-card">
        <div className="section-badge">{content.badgeText}</div>
        <h2 className="section-title">{content.title}</h2>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {content.question}
        </p>
        
        <div className="quiz-options">
          {content.options.map((opt, idx) => (
            <button key={idx} className="btn-option" onClick={handleOptionClick}>
              {opt}
            </button>
          ))}
        </div>

        {answered && (
          <div className="quiz-result active">
            <div className="quiz-result-header">{content.responseHeader}</div>
            <div className="quiz-result-text">{content.responseText}</div>
          </div>
        )}
      </div>
    </section>
  );
}
