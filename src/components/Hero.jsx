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

  // Dynamically calculated escape positions to ensure the button stays inside visible screen bounds on all devices
  const getEscapePositions = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 360;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 640;
    const isMobile = screenWidth < 640;
    
    // Bounds check to ensure button remains strictly within visible screen area
    const maxRight = Math.max(30, Math.min(380, (screenWidth / 2) - 80));
    const maxLeft = -Math.max(30, Math.min(420, (screenWidth / 2) - 80));
    
    const scaleX = isMobile ? Math.min(0.85, (screenWidth / 360) * 0.55) : maxRight / 320;
    const scaleY = isMobile ? Math.min(0.85, (screenHeight / 640) * 0.7) : 1.15;

    return [
      { x: 0, y: 0 },
      { x: Math.max(maxLeft, -340 * scaleX), y: -130 * scaleY },
      { x: Math.max(maxLeft, -140 * scaleX), y: -150 * scaleY },
      { x: Math.min(maxRight, 200 * scaleX), y: -130 * scaleY },
      { x: Math.max(maxLeft, -360 * scaleX), y: 0 },
      { x: Math.min(maxRight, 210 * scaleX), y: 0 },
      { x: Math.max(maxLeft, -300 * scaleX), y: 130 * scaleY },
      { x: Math.max(maxLeft, -140 * scaleX), y: 150 * scaleY },
      { x: Math.min(maxRight, 200 * scaleX), y: 130 * scaleY },
      { x: Math.max(maxLeft, -260 * scaleX), y: -75 * scaleY },
      { x: Math.min(maxRight, 190 * scaleX), y: -75 * scaleY }
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
