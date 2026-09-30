import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sendGiftSelectionToBackend } from '../services/api';

export default function GiftSelection({ content, onContinue }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGift, setSelectedGift] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const gifts = content.gifts || [];
  const currentGift = gifts[currentIndex] || gifts[0];

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold (50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % gifts.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + gifts.length) % gifts.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const triggerHeartBurst = (e) => {
    const rect = e?.target ? e.target.getBoundingClientRect() : { left: window.innerWidth / 2, width: 0, top: window.innerHeight / 2, height: 0 };
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 75,
      origin: { x, y },
      colors: ['#ff758f', '#ff4d6d', '#ffccd5', '#ffffff']
    });
  };

  const handleChooseGift = (e) => {
    setSelectedGift(currentGift);
    triggerHeartBurst(e);
    sendGiftSelectionToBackend(currentGift.title);
  };

  return (
    <div className="gift-page-wrapper fade-step">
      {/* Small Top Badge */}
      <div className="section-badge gift-top-badge">{content.topBadge}</div>

      {/* Animated Gift Box Icon */}
      <div className={`gift-box-header ${selectedGift ? 'gift-box-open' : ''}`}>
        <span className="gift-box-emoji">🎁</span>
      </div>

      <h2 className="section-title compact-title gift-heading">{content.title}</h2>

      <div className="gift-intro-box">
        {content.introLines.map((line, idx) => (
          <p key={idx} className="gift-intro-line">
            {line}
          </p>
        ))}
      </div>

      {!selectedGift ? (
        <>
          <div className="microcopy-tag">{content.microcopyTop}</div>

          {/* Mobile-First Carousel Stack Container */}
          <div 
            className="gift-carousel-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button 
              className="carousel-arrow arrow-left" 
              onClick={handlePrev}
              aria-label="Previous Gift"
            >
              ‹
            </button>

            {/* Active Gift Card */}
            <div className={`gift-card theme-${currentGift.colorTheme} ${isAnimating ? 'card-transitioning' : ''}`}>
              {currentGift.colorTheme === 'rose' && <div className="card-floating-petals">🌸 🌷</div>}
              {currentGift.colorTheme === 'cocoa' && <div className="card-floating-sparkles">✨ 🍫</div>}
              {currentGift.colorTheme === 'warm' && <div className="card-floating-hearts">🧸 💖</div>}
              {currentGift.colorTheme === 'romantic' && <div className="card-floating-shimmer">💌 💗</div>}

              <div className="gift-emoji-large">{currentGift.emoji}</div>
              <h3 className="gift-card-title">{currentGift.title}</h3>
              <p className="gift-card-text">"{currentGift.text}"</p>

              <button className="btn-cute btn-choose-gift" onClick={handleChooseGift}>
                {content.chooseButtonText}
              </button>
            </div>

            <button 
              className="carousel-arrow arrow-right" 
              onClick={handleNext}
              aria-label="Next Gift"
            >
              ›
            </button>
          </div>

          {/* Carousel Pagination & Indicator */}
          <div className="carousel-pagination">
            <span className="swipe-hint">{content.microcopySwipe}</span>

            <div className="dots-row">
              {gifts.map((g, idx) => (
                <button
                  key={g.id}
                  className={`dot-indicator ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to gift ${idx + 1}`}
                />
              ))}
            </div>

            <div className="counter-indicator">
              {currentIndex + 1} / {gifts.length}
            </div>

            <div className="microcopy-bottom">{content.microcopyBottom}</div>
          </div>
        </>
      ) : (
        /* Confirmation UI */
        <div className="gift-confirmation-container fade-step">
          <div className={`gift-card theme-${selectedGift.colorTheme} card-selected-glow`}>
            <div className="gift-emoji-large">{selectedGift.emoji}</div>
            <h3 className="gift-card-title">{selectedGift.title}</h3>
            <p className="gift-card-text">"{selectedGift.text}"</p>

            <div className="chosen-stamp-btn">
              <span>{content.chosenButtonText}</span>
            </div>
          </div>

          <div className="confirmation-sub-box">
            <div className="check-circle">✓</div>
            <div className="chosen-label">CHOSEN ❤️</div>
            <p className="confirmation-text">{content.confirmationText}</p>
            <p className="good-choice-text">{content.goodChoiceText}</p>

            <button className="btn-cute btn-continue-large" onClick={onContinue}>
              {content.continueButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
