import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function FinalMessage({ content }) {
  const [hugCount, setHugCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const handleVirtualHug = (e) => {
    setHugCount((prev) => prev + 1);
    setShowToast(true);

    const rect = e.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 80,
      origin: { x, y },
      colors: ['#ff758f', '#ffccd5', '#ff4d6d']
    });

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <section id="section-final" className="section">
      <div className="final-heading">{content.heading}</div>
      <h2 className="final-large-text">{content.largeText}</h2>
      
      <div className="final-lines-container">
        {content.lines.map((line, index) => {
          const isHighlight = index === content.lines.length - 1 || index === content.lines.length - 2;
          return (
            <p key={index} className={`final-line ${isHighlight ? 'highlight' : ''}`}>
              {line}
            </p>
          );
        })}
      </div>
      
      <div className="virtual-hug-container">
        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {content.virtualHugText}
        </p>
        <button 
          className="hug-heart-btn" 
          onClick={handleVirtualHug} 
          title="Click to send a virtual hug!"
        >
          💖
        </button>
        <div className={`hug-toast ${showToast ? 'active' : ''}`}>
          {hugCount > 1 ? `+${hugCount} Virtual Hugs Sent! 🫂❤️` : 'Virtual Hug Sent! 🫂❤️'}
        </div>
      </div>
    </section>
  );
}
