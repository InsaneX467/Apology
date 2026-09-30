import React from 'react';

export default function ThingsToRemember({ content }) {
  return (
    <section id="section-cards" className="section">
      <div className="section-badge">{content.badgeText}</div>
      <h2 className="section-title">{content.title}</h2>
      
      <div className="cards-grid">
        {content.cards.map((card) => (
          <div key={card.id} className="remember-card">
            <span className="card-heart-pop">💗</span>
            <div className="card-emoji">{card.emoji}</div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
