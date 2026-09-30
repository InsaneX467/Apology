import React from 'react';

export default function CheesySection({ content }) {
  return (
    <section id="section-cheesy" className="section">
      <div className="section-badge">{content.badgeText}</div>
      <h2 className="section-title">{content.title}</h2>
      
      <div className="card-base cheesy-card">
        {content.paragraphs.map((para, index) => {
          const isEmphasis = index >= content.paragraphs.length - 2;
          return (
            <p 
              key={index} 
              className={`cheesy-line ${isEmphasis ? 'emphasis' : ''}`}
            >
              {para}
            </p>
          );
        })}
      </div>
    </section>
  );
}
