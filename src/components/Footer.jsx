import React from 'react';

export default function Footer({ content }) {
  return (
    <footer>
      <p className="footer-text">{content.smallText}</p>
      <p className="footer-sub">{content.subText}</p>
    </footer>
  );
}
