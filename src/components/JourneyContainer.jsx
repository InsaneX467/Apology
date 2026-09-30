import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import ProgressIndicator from './ProgressIndicator';
import Footer from './Footer';
import { sendResponseToBackend } from '../services/api';

export default function JourneyContainer({ content }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 2 State
  const [confessionAnswered, setConfessionAnswered] = useState(false);
  const [confessionResponse, setConfessionResponse] = useState('');

  // Step 3 State (Revealing cards one by one)
  const [visibleCardCount, setVisibleCardCount] = useState(0);

  // Step 4 State (Opening Letter)
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Step 5 State (Promises)
  const [promiseConfirmed, setPromiseConfirmed] = useState(false);

  // Step 6 State (Love Quiz)
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Step 7 State (Runaway No Button)
  const [noPosIndex, setNoPosIndex] = useState(0);
  const [noTextIndex, setNoTextIndex] = useState(0);
  const noBtnRef = useRef(null);

  // Step 9 State
  const [twoDayRequests, setTwoDayRequests] = useState(0); // 0 to 5
  const [isConfirming2Days, setIsConfirming2Days] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState(null); // 'tonight' | '1day'
  const [finalChoiceMade, setFinalChoiceMade] = useState(false);

  const noOptions = content.hero.noButtonOptions || [
    "No 😤",
    "Nope! 😭",
    "Nice try 😂",
    "Catch me! 💨",
    "Absolutely not 😭",
    "Hehe nope 💗"
  ];

  // 10 Safe Escape Positions with BIG range for Step 7 Runaway No Button
  const getEscapePositions = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const isMobile = screenWidth < 640;
    const maxRight = Math.min(340, screenWidth / 2 - 120);
    const scaleX = isMobile ? 0.45 : maxRight / 280;
    const scaleY = isMobile ? 0.6 : 1.0;

    return [
      { x: 0, y: 0 },
      { x: -340 * scaleX, y: -130 * scaleY },
      { x: -140 * scaleX, y: -160 * scaleY },
      { x: 200 * scaleX,  y: -130 * scaleY },
      { x: -360 * scaleX, y: 0 },
      { x: 210 * scaleX,  y: 0 },
      { x: -300 * scaleX, y: 130 * scaleY },
      { x: -140 * scaleX, y: 160 * scaleY },
      { x: 200 * scaleX,  y: 130 * scaleY },
      { x: -260 * scaleX, y: -70 * scaleY },
      { x: 190 * scaleX,  y: -70 * scaleY }
    ];
  };

  const handleNextStep = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const triggerConfetti = (e) => {
    const rect = e ? e.target.getBoundingClientRect() : { left: window.innerWidth / 2, width: 0, top: window.innerHeight / 2, height: 0 };
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { x, y },
      colors: ['#ff758f', '#ff4d6d', '#ffccd5', '#ffffff']
    });
  };

  // Step 7 No Button Dodge
  const handleNoClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const positions = getEscapePositions();
    const numPositions = positions.length - 1;

    let nextIndex = Math.floor(Math.random() * numPositions) + 1;
    if (nextIndex === noPosIndex) {
      nextIndex = (nextIndex % numPositions) + 1;
    }

    setNoPosIndex(nextIndex);
    setNoTextIndex((prev) => (prev + 1) % noOptions.length);
  };

  // Hug counter for Step 8
  const [hugCount, setHugCount] = useState(0);
  const [showHugToast, setShowHugToast] = useState(false);

  const handleHugClick = (e) => {
    setHugCount((prev) => prev + 1);
    setShowHugToast(true);
    triggerConfetti(e);
    setTimeout(() => setShowHugToast(false), 3000);
  };

  // Step 9 Option Handlers
  const handleSelectTonight = (e) => {
    setSelectedTimeOption('tonight');
    setFinalChoiceMade(true);
    setIsConfirming2Days(false);
    triggerConfetti(e);
    sendResponseToBackend('Tonight', twoDayRequests);
  };

  const handleSelectOneDay = (e) => {
    setSelectedTimeOption('1day');
    setFinalChoiceMade(true);
    setIsConfirming2Days(false);
    triggerConfetti(e);
    sendResponseToBackend('1 Day', twoDayRequests);
  };

  const handleSelectTwoDays = () => {
    if (twoDayRequests < 5) {
      setIsConfirming2Days(true);
    }
  };

  const handleConfirmStillTwoDays = async () => {
    const nextCount = twoDayRequests + 1;
    setTwoDayRequests(nextCount);

    const res = await sendResponseToBackend('2 Days', nextCount);

    if (res && res.success === false && res.message?.includes('limit')) {
      setTwoDayRequests(5);
      setIsConfirming2Days(false);
      return;
    }

    if (nextCount >= 5) {
      setIsConfirming2Days(false);
    }
  };

  const handleCancelTwoDays = () => {
    setIsConfirming2Days(false);
  };

  return (
    <div className="journey-wrapper">
      {/* Top Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={9} />

      <div className="journey-step-container">
        {/* =============================================================
             STEP 1 — THE APOLOGY
             ============================================================= */}
        {currentStep === 1 && (
          <div className="step-card fade-step">
            <div className="section-badge">Step 1 of 9</div>
            <h2 className="section-title compact-title">{content.step1Apology.title}</h2>

            <div className="card-base apology-card compact-card">
              <div className="sticker-badge">{content.step1Apology.stickerText}</div>
              <div className="apology-paragraphs">
                {content.step1Apology.paragraphs.map((para, idx) => (
                  <p key={idx} className="apology-paragraph compact-para">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="step-actions">
              <button className="btn-cute" onClick={handleNextStep}>
                {content.step1Apology.buttonText}
              </button>
            </div>
          </div>
        )}

        {/* =============================================================
             STEP 2 — A LITTLE CONFESSION
             ============================================================= */}
        {currentStep === 2 && (
          <div className="step-card fade-step">
            <div className="section-badge">Step 2 of 9</div>
            <h2 className="section-title compact-title">{content.step2Confession.title}</h2>

            <div className="card-base compact-card">
              <div className="confession-paragraphs">
                {content.step2Confession.paragraphs.map((para, idx) => (
                  <p key={idx} style={{ fontSize: '1.05rem', marginBottom: '10px' }}>
                    {para}
                  </p>
                ))}
              </div>

              <div className="interactive-box" style={{ marginTop: '14px' }}>
                <p className="interactive-question" style={{ fontSize: '1.15rem', marginBottom: '10px' }}>
                  {content.step2Confession.question}
                </p>
                <div className="quiz-options">
                  {content.step2Confession.options.map((opt, idx) => (
                    <button
                      key={idx}
                      className="btn-option"
                      onClick={() => {
                        setConfessionAnswered(true);
                        setConfessionResponse(opt.response);
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                {confessionAnswered && (
                  <div className="quiz-result active" style={{ marginTop: '12px', padding: '14px' }}>
                    <div className="quiz-result-text" style={{ fontSize: '1.1rem' }}>
                      {confessionResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {confessionAnswered && (
              <div className="step-actions">
                <button className="btn-cute" onClick={handleNextStep}>
                  {content.step2Confession.buttonText}
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
             STEP 3 — THINGS I SHOULD HAVE REMEMBERED
             ============================================================= */}
        {currentStep === 3 && (
          <div className="step-card fade-step">
            <div className="section-badge">Step 3 of 9</div>
            <h2 className="section-title compact-title">{content.step3Cards.title}</h2>

            <div className="cards-reveal-grid">
              {content.step3Cards.cards.slice(0, visibleCardCount).map((card) => (
                <div key={card.id} className="remember-card compact-remember-card fade-step">
                  <span className="card-heart-pop">💗</span>
                  <div className="card-emoji" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                    {card.emoji}
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                    {card.title}
                  </h3>
                  <p className="card-text" style={{ fontSize: '0.9rem' }}>
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="step-actions" style={{ marginTop: '16px' }}>
              {visibleCardCount < content.step3Cards.cards.length ? (
                <button 
                  className="btn-cute" 
                  onClick={() => setVisibleCardCount((prev) => prev + 1)}
                >
                  {content.step3Cards.revealButtonTexts[visibleCardCount] || 'Open next card... 💌'}
                </button>
              ) : (
                <button className="btn-cute" onClick={handleNextStep}>
                  {content.step3Cards.nextButtonText}
                </button>
              )}
            </div>
          </div>
        )}

        {/* =============================================================
             STEP 4 — THE LOVE LETTER (SCROLLABLE LETTER CARD)
             ============================================================= */}
        {currentStep === 4 && (
          <div className="step-card fade-step">
            <div className="section-badge">Step 4 of 9</div>
            <h2 className="section-title compact-title">{content.step4LoveLetter.title}</h2>

            {!isLetterOpen ? (
              <div className="card-base text-center compact-card" style={{ padding: '32px 24px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>💌</div>
                <p style={{ fontSize: '1.15rem', marginBottom: '20px', color: 'var(--text-muted)' }}>
                  Dear my favorite person...
                </p>
                <button 
                  className="btn-cute" 
                  onClick={() => {
                    setIsLetterOpen(true);
                    triggerConfetti();
                  }}
                >
                  {content.step4LoveLetter.openButtonText}
                </button>
              </div>
            ) : (
              /* Love letter card is internally scrollable for reading comfort */
              <div className="letter-card compact-letter-card letter-card-scrollable fade-step">
                <div className="letter-stamp">💌</div>
                <div className="letter-content">
                  <div className="letter-body compact-letter-body">
                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                      {content.step4LoveLetter.greeting}
                    </div>
                    {content.step4LoveLetter.paragraphs.map((para, idx) => (
                      <p key={idx} className="letter-paragraph compact-letter-paragraph">
                        {para}
                      </p>
                    ))}
                    <div className="letter-signoff compact-signoff">
                      {content.step4LoveLetter.signOff}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLetterOpen && (
              <div className="step-actions" style={{ marginTop: '14px' }}>
                <button className="btn-cute" onClick={handleNextStep}>
                  {content.step4LoveLetter.nextButtonText}
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
             STEP 5 — THE PROMISE
             ============================================================= */}
        {currentStep === 5 && (
          <div className="step-card fade-step">
            <div className="card-base promise-card compact-card">
              <div className="section-badge">Step 5 of 9</div>
              <h2 className="section-title compact-title">{content.step5Promise.title}</h2>
              <p className="promise-subtext" style={{ marginBottom: '16px', fontSize: '1rem' }}>
                {content.step5Promise.subtitle}
              </p>

              <ul className="promise-list compact-promise-list">
                {content.step5Promise.promises.map((prom, idx) => (
                  <li key={idx} className="promise-item compact-promise-item">
                    <span className="promise-icon">💖</span>
                    <span>{prom}</span>
                  </li>
                ))}
              </ul>

              {!promiseConfirmed ? (
                <button 
                  className="btn-cute" 
                  onClick={(e) => {
                    setPromiseConfirmed(true);
                    triggerConfetti(e);
                  }}
                >
                  {content.step5Promise.promiseButtonText}
                </button>
              ) : (
                <div className="fade-step">
                  <p style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '12px' }}>
                    Promise saved in my heart forever. 💗
                  </p>
                  <button className="btn-cute" onClick={handleNextStep}>
                    {content.step5Promise.nextButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============================================================
             STEP 6 — THE PLAYFUL PART
             ============================================================= */}
        {currentStep === 6 && (
          <div className="step-card fade-step">
            <div className="card-base interactive-card compact-card">
              <div className="section-badge">Step 6 of 9</div>
              <h2 className="section-title compact-title">{content.step6Playful.title}</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {content.step6Playful.subtitle}
              </p>

              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
                {content.step6Playful.question}
              </p>

              <div className="quiz-options">
                {content.step6Playful.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="btn-option"
                    onClick={(e) => {
                      setQuizAnswered(true);
                      triggerConfetti(e);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizAnswered && (
                <div className="quiz-result active" style={{ marginTop: '16px', padding: '14px' }}>
                  <div className="quiz-result-header" style={{ fontSize: '1.3rem' }}>
                    {content.step6Playful.responseHeader}
                  </div>
                  <div className="quiz-result-text" style={{ fontSize: '1.1rem' }}>
                    {content.step6Playful.responseText}
                  </div>
                </div>
              )}
            </div>

            {quizAnswered && (
              <div className="step-actions" style={{ marginTop: '16px' }}>
                <button className="btn-cute" onClick={handleNextStep}>
                  {content.step6Playful.nextButtonText}
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
             STEP 7 — THE RUNAWAY NO BUTTON
             ============================================================= */}
        {currentStep === 7 && (
          <div className="step-card fade-step">
            <div className="card-base text-center compact-card" style={{ padding: '32px 20px' }}>
              <div className="section-badge">Step 7 of 9</div>
              <h2 className="section-title compact-title">{content.step7Forgiveness.title}</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>
                {content.step7Forgiveness.subtitle}
              </p>

              <div className="hero-buttons-wrapper">
                <button 
                  className="btn-cute btn-listen-fixed" 
                  onClick={(e) => {
                    triggerConfetti(e);
                    handleNextStep();
                  }}
                >
                  <span>{content.step7Forgiveness.yesButtonText}</span>
                </button>

                <button 
                  className="btn-cute" 
                  style={{ background: '#fff0f3', color: 'var(--primary-dark)', border: '2px solid var(--soft-pink)' }}
                  onClick={(e) => {
                    triggerConfetti(e);
                    handleNextStep();
                  }}
                >
                  <span>{content.step7Forgiveness.seeButtonText}</span>
                </button>

                {/* The Runaway No button */}
                <button
                  ref={noBtnRef}
                  className="btn-no-runaway"
                  style={{
                    transform: `translate(${getEscapePositions()[noPosIndex].x}px, ${getEscapePositions()[noPosIndex].y}px)`
                  }}
                  onClick={handleNoClick}
                >
                  <span>{noOptions[noTextIndex]}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
             STEP 8 — TIME NEEDED
             ============================================================= */}
        {currentStep === 8 && (
          <div className="step-card fade-step">
            <div className="section-badge">Step 8 of 9</div>
            <h2 className="section-title compact-title">{content.step9TimeNeed.heading}</h2>

            <div className="card-base compact-card" style={{ textAlign: 'center', width: '100%' }}>
              {!finalChoiceMade ? (
                <>
                  <div className="time-intro-paragraphs" style={{ marginBottom: '12px' }}>
                    {content.step9TimeNeed.introLines.map((line, idx) => (
                      <p key={idx} style={{ fontSize: '1.02rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                        {line}
                      </p>
                    ))}
                  </div>

                  <p className="time-question" style={{ fontSize: '1.15rem', fontWeight: 700, margin: '14px 0 16px 0', color: 'var(--primary-dark)' }}>
                    {content.step9TimeNeed.question}
                  </p>

                  {/* 2-Day Confirmation Box when clicking 2 Days */}
                  {isConfirming2Days ? (
                    <div className="confirm-2day-box fade-step">
                      <div className="request-counter-badge">
                        2-day requests: {Math.min(twoDayRequests + 1, 5)}/5 🥺
                      </div>
                      <div className="attempt-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '8px 0 4px 0' }}>
                        {content.step9TimeNeed.responses.twoDaysAttempts[Math.min(twoDayRequests, 4)].title}
                      </div>
                      <div className="attempt-text" style={{ fontSize: '0.98rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        {content.step9TimeNeed.responses.twoDaysAttempts[Math.min(twoDayRequests, 4)].text}
                      </div>

                      <div className="confirm-buttons-row">
                        <button className="btn-cute" onClick={handleConfirmStillTwoDays}>
                          Still 2 Days 🥺
                        </button>
                        <button 
                          className="btn-cute" 
                          style={{ background: '#fff0f3', color: 'var(--primary-dark)', border: '2px solid var(--soft-pink)' }}
                          onClick={handleCancelTwoDays}
                        >
                          Okay, maybe less ❤️
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Main Time Options */
                    <div className="time-options-grid">
                      <button className="time-option-card" onClick={handleSelectTonight}>
                        <span className="option-label">{content.step9TimeNeed.options.tonight}</span>
                      </button>

                      <button className="time-option-card" onClick={handleSelectOneDay}>
                        <span className="option-label">{content.step9TimeNeed.options.oneDay}</span>
                      </button>

                      {twoDayRequests < 5 ? (
                        <button className="time-option-card time-option-2days fade-step" onClick={handleSelectTwoDays}>
                          <span className="option-label">{content.step9TimeNeed.options.twoDays}</span>
                        </button>
                      ) : (
                        <div className="banned-option-tag fade-step">
                          {content.step9TimeNeed.responses.bannedMessage}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Choice response */
                <div className="quiet-final-wrapper fade-step">
                  {selectedTimeOption === 'tonight' && (
                    <div className="choice-response-box">
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                        {content.step9TimeNeed.responses.tonight.title}
                      </h3>
                      {content.step9TimeNeed.responses.tonight.lines.map((l, i) => (
                        <p key={i} style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {l}
                        </p>
                      ))}
                      <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-pink)', marginTop: '10px' }}>
                        {content.step9TimeNeed.responses.tonight.highlight}
                      </p>
                    </div>
                  )}

                  {selectedTimeOption === '1day' && (
                    <div className="choice-response-box">
                      <div className="heart-bounce-anim" style={{ fontSize: '2rem', marginBottom: '6px' }}>🌷💖</div>
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                        {content.step9TimeNeed.responses.oneDay.title}
                      </h3>
                      {content.step9TimeNeed.responses.oneDay.lines.map((l, i) => (
                        <p key={i} style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {l}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="step-actions" style={{ marginTop: '18px' }}>
                    <button className="btn-cute" onClick={handleNextStep}>
                      One Last Thing... 💗
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============================================================
             STEP 9 — FINAL APOLOGY (SINGLE FRAME FIT)
             ============================================================= */}
        {currentStep === 9 && (
          <div className="step-card fade-step step9-compact-frame">
            <div className="section-badge">Step 9 of 9</div>
            <div className="final-heading">{content.step8Final.heading}</div>
            <h2 className="final-large-text compact-title" style={{ marginBottom: '8px' }}>
              {content.step8Final.largeText}
            </h2>

            <div className="card-base step9-main-card">
              <div className="final-paragraphs-box">
                <p className="final-para-line">
                  I'm sorry for what I did. I'm sorry for hurting you, and for making you feel like you weren't important to me. You are.
                </p>
                <p className="final-para-line">
                  I know an apology can't instantly fix everything. I just want you to know that I understand I was wrong, and I genuinely regret hurting you. I'll let my actions speak louder than this website.
                </p>
                <p className="final-para-line highlight" style={{ fontWeight: 700, color: 'var(--primary-dark)', marginTop: '4px' }}>
                  Because despite being a certified idiot sometimes... 😭 I really, really love you. 🫂❤️
                </p>
              </div>

              <div className="virtual-hug-inline">
                <span className="hug-label-text">{content.step8Final.virtualHugText}</span>
                <button 
                  className="hug-heart-btn compact-hug-btn" 
                  onClick={handleHugClick} 
                  title="Click to send a virtual hug!"
                >
                  💖
                </button>
                <span className={`hug-toast ${showHugToast ? 'active' : ''}`}>
                  {hugCount > 1 ? `+${hugCount} Hugs Sent! 🫂❤️` : 'Hug Sent! 🫂❤️'}
                </span>
              </div>

              <div className="final-goodnight-box">
                <p className="goodnight-subtext">
                  I'll respect your choice. No pressure, no expectations. Take whatever time you need. Whenever you're ready... I'll be here.
                </p>
                <div className="final-goodnight-heading">
                  {content.step9TimeNeed.finalMessage.goodnight}
                </div>
                <div className="final-signoff">
                  {content.step9TimeNeed.finalMessage.signOff}
                </div>
              </div>
            </div>

            <Footer content={content.footer} />
          </div>
        )}
      </div>
    </div>
  );
}
