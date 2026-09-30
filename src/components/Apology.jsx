import React from 'react';

export default function Apology({ content }) {
  return (
    <section id="section-actual-apology" className="section">
      <div className="section-badge">{content.badgeText}</div>
      <h2 className="section-title">{content.title}</h2>
      
      <div className="card-base apology-card">
        <div className="sticker-badge">{content.stickerText}</div>
        <div className="apology-paragraphs">
          {content.paragraphs.map((para, index) => (
            <p key={index} className="apology-paragraph">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
