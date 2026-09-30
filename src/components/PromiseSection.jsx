import React from 'react';
import confetti from 'canvas-confetti';

export default function PromiseSection({ content }) {
  const handlePromiseClick = (e) => {
    // Canvas confetti burst with heart shapes / pink colors
    const rect = e.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Heart burst 1
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
      colors: ['#ff758f', '#ff4d6d', '#ffccd5', '#ffb6c1'],
      shapes: ['square'], // heart particle feel
      scalar: 1.2
    });

    // Secondary delayed burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: x - 0.1, y },
        colors: ['#ff758f', '#ffffff']
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: x + 0.1, y },
        colors: ['#ff4d6d', '#ffccd5']
      });
    }, 150);
  };

  return (
    <section id="section-promise" className="section">
      <div className="card-base promise-card">
        <div className="section-badge">{content.badgeText}</div>
        <h2 className="section-title">{content.title}</h2>
        <p className="promise-subtext">{content.subtitle}</p>
        
        <ul className="promise-list">
          {content.promises.map((prom, index) => (
            <li key={index} className="promise-item">
              <span className="promise-icon">💖</span>
              <span>{prom}</span>
            </li>
          ))}
        </ul>
        
        <div className="promise-closing">
          {content.closing.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
        
        <button className="btn-cute" onClick={handlePromiseClick}>
          {content.buttonText}
        </button>
      </div>
    </section>
  );
}
