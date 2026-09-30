import React from 'react';

export default function LoveLetter({ content }) {
  return (
    <section id="section-letter" className="section">
      <div className="section-badge">{content.badgeText}</div>
      <div className="letter-card">
        <div className="letter-stamp">💌</div>
        <div className="letter-content">
          <h2 className="letter-title">{content.title}</h2>
          <div className="letter-body">
            <div style={{ fontWeight: 700, marginBottom: '14px' }}>{content.greeting}</div>
            <div className="letter-paragraphs">
              {content.paragraphs.map((para, idx) => (
                <p key={idx} className="letter-paragraph">
                  {para}
                </p>
              ))}
            </div>
            <div className="letter-signoff">{content.signOff}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
