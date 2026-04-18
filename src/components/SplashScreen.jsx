import React, { useState, useEffect } from 'react';

export function SplashScreen({ onComplete }) {
  const [text, setText] = useState('');
  const fullText = "DOXMITECH";
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    // Typewriter effect
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Wait a bit after typing finishes, then start fade out
        setTimeout(() => {
          setIsFadingOut(true);
          
          // Wait for fade out animation to complete before notifying parent
          setTimeout(() => {
            onComplete();
          }, 800); // 800ms fade out duration
        }, 1500); // 1.5 seconds visible after typing
      }
    }, 150); // 150ms per character

    return () => clearInterval(typingInterval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
         {/* Glow effect behind the text */}
         <div className="absolute w-64 h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />
         
         <h1 className="text-6xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 relative z-10 flex">
           {text}
           <span className="w-1 md:w-2 bg-green-400 ml-2 animate-pulse h-[1em]" style={{ animationDuration: '0.8s' }}></span>
         </h1>
         <p className="text-green-800 tracking-widest uppercase text-sm mt-6 font-bold animate-pulse" style={{ animationDuration: '2s' }}>
            Initializing Neural System
         </p>
      </div>
    </div>
  );
}
