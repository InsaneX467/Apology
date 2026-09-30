import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Hero({ content, onUnlock, isUnlocked }) {
  const [currentPosIndex, setCurrentPosIndex] = useState(0); // Index 0 = initial side-by-side position
  const [noTextIndex, setNoTextIndex] = useState(0);
  const noBtnRef = useRef(null);

  const noOptions = content.noButtonOptions || [
    "No 😤",
    "Nope! 😭",
    "Nice try 😂",
    "Catch me! 💨",
    "Absolutely not 😭",
    "Hehe nope 💗"
  ];

  // BIG escape range across the screen while clamping safely to visible viewport bounds
  const getEscapePositions = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const isMobile = screenWidth < 640;
    
    // Scale X & Y offsets so the button escapes across a BIG range without clipping
    const maxRight = Math.min(380, screenWidth / 2 - 120);
    const scaleX = isMobile ? 0.45 : maxRight / 320;
    const scaleY = isMobile ? 0.6 : 1.15;

    return [
      { x: 0, y: 0 },                             // 0: Initial side-by-side position
      { x: -380 * scaleX, y: -150 * scaleY },     // 1: Far Upper-Left
      { x: -160 * scaleX, y: -180 * scaleY },     // 2: Far Top-Center (high above main button)
      { x: 220 * scaleX,  y: -150 * scaleY },     // 3: Far Upper-Right
      { x: -420 * scaleX, y: 0 },                 // 4: Extreme Far-Left
      { x: 240 * scaleX,  y: 0 },                 // 5: Extreme Far-Right
      { x: -360 * scaleX, y: 150 * scaleY },      // 6: Far Bottom-Left
      { x: -160 * scaleX, y: 180 * scaleY },      // 7: Far Bottom-Center (below main button)
      { x: 220 * scaleX,  y: 150 * scaleY },      // 8: Far Bottom-Right
      { x: -320 * scaleX, y: -80 * scaleY },      // 9: High Mid-Left
      { x: 220 * scaleX,  y: -80 * scaleY }       // 10: High Mid-Right
    ];
  };

  const handleListenClick = (e) => {
    // Fire heart confetti on unlock click
    const rect = e.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 90,
      origin: { x, y },
      colors: ['#ff758f', '#ff4d6d', '#ffccd5', '#ffffff']
    });

    onUnlock();
  };

  // Triggers ONLY when user clicks/taps the No button
  const handleNoClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const positions = getEscapePositions();
    const numPositions = positions.length - 1; // 1 to 10 escape slots

    // Pick a new position from slots 1..10, avoiding consecutive duplicate
    let nextIndex = Math.floor(Math.random() * numPositions) + 1;
    if (nextIndex === currentPosIndex) {
      nextIndex = (nextIndex % numPositions) + 1;
    }

    setCurrentPosIndex(nextIndex);
    setNoTextIndex((prev) => (prev + 1) % noOptions.length);
  };

  const positions = getEscapePositions();
  const currentOffset = positions[currentPosIndex] || { x: 0, y: 0 };

  return (
    <section id="section-opening" className={`section ${!isUnlocked ? 'gatekeeper-screen' : ''}`}>
      <div className="hero-content">
        <div className="shy-badge">{content.greeting}</div>
        <h1 className="hero-title">{content.title}</h1>
        <p className="hero-subtitle">{content.subtitle}</p>
        
        {/* Buttons side-by-side equally centered */}
        <div className="hero-buttons-wrapper">
          {/* Main "Okay, I'll listen... 💗" button — 100% FIXED IN PLACE */}
          <button className="btn-cute btn-listen-fixed" onClick={handleListenClick}>
            <span>{content.buttonText}</span>
          </button>

          {/* Playful "No 😤" button — ESCAPES WITH BIGGER RANGE ON CLICK */}
          <button
            ref={noBtnRef}
            className="btn-no-runaway"
            style={{
              transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
            }}
            onClick={handleNoClick}
          >
            <span>{noOptions[noTextIndex]}</span>
          </button>
        </div>

        <div className="scroll-heart-wrapper">
          <div 
            className="animated-heart-down" 
            onClick={handleListenClick} 
            title="Click to enter"
            role="button"
            tabIndex={0}
          >
            💖
          </div>
        </div>
      </div>
    </section>
  );
}
