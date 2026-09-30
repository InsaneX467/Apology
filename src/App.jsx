import React, { useState } from 'react';
import { apologyContent } from './data/apologyContent';
import BackgroundCanvas from './components/BackgroundCanvas';
import Hero from './components/Hero';
import JourneyContainer from './components/JourneyContainer';
import Admin from './components/Admin';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const isAdminPath = window.location.pathname === '/admin';

  return (
    <>
      <BackgroundCanvas />

      <main className="container">
        {isAdminPath ? (
          <Admin />
        ) : !isUnlocked ? (
          /* Step 0: Gatekeeper Hero Landing Screen */
          <Hero 
            content={apologyContent.hero} 
            onUnlock={() => setIsUnlocked(true)}
            isUnlocked={isUnlocked}
          />
        ) : (
          /* Steps 1 to 9: Interactive Step-by-Step Romantic Journey */
          <JourneyContainer content={apologyContent} />
        )}
      </main>
    </>
  );
}
