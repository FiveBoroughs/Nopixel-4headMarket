"use client";

import { useEffect, useState, useRef } from 'react';
import { Skull, AlertTriangle, Bug, Binary } from 'lucide-react';
import EmojiPuzzle from './components/EmojiPuzzle';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [glitchText, setGlitchText] = useState("RESTRICTED ACCESS");
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const characters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      setGlitchText(prev => {
        const pos = Math.floor(Math.random() * prev.length);
        return prev.substring(0, pos) + randomChar + prev.substring(pos + 1);
      });
      setTimeout(() => setGlitchText("RESTRICTED ACCESS"), 100);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    backgroundMusic.current = new Audio('/sounds/background.mp3');
    backgroundMusic.current.volume = 0.4
    backgroundMusic.current.loop = true;

  }, []);

  useEffect(() => {
    if (backgroundMusic.current) {
      backgroundMusic.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleEnter = () => {
    backgroundMusic.current?.play().catch(console.error);
    setShowContent(true);
  };

  return (
    <main className="min-h-screen bg-black sketchy-bg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b000033] to-transparent pointer-events-none" />

      {!showContent ? (
        <div className="h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#8b0000] mb-8 glitch">
            {glitchText}
          </h1>
          <div className="flex items-center gap-2 mb-8">
            <AlertTriangle className="w-6 h-6 text-[#39ff14]" />
            <span className="text-[#39ff14] toxic-shadow">WARNING</span>
            <AlertTriangle className="w-6 h-6 text-[#39ff14]" />
          </div>
          <button
            onClick={handleEnter}
            className="px-8 py-4 bg-[#8b0000] hover:bg-[#39ff14] hover:text-black transition-colors duration-300 border border-[#39ff14] rounded flicker"
          >
            ENTER AT YOUR OWN RISK
          </button>
        </div>
      ) : (
        <div className="container mx-auto p-4 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/50 p-6 border border-[#8b0000] rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Skull className="w-6 h-6 text-[#8b0000]" />
                <h2 className="text-xl text-[#8b0000] toxic-shadow">DANGER ZONE</h2>
              </div>
              <p className="text-gray-400 glitch">
                You have entered a restricted area. Proceed with extreme caution.
              </p>
            </div>

            <div className="bg-black/50 p-6 border border-[#39ff14] rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bug className="w-6 h-6 text-[#39ff14]" />
                <h2 className="text-xl text-[#39ff14] toxic-shadow">SYSTEM BREACH</h2>
              </div>
              <p className="text-gray-400">
                Multiple security protocols have been compromised.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-black/50 p-6 border border-[#8b0000] rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Binary className="w-6 h-6 text-[#8b0000]" />
              <h2 className="text-xl text-[#8b0000] toxic-shadow">ENCRYPTED DATA</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[#39ff14] font-mono text-sm opacity-75">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flicker">
                  {Array.from({ length: 8 }).map(() =>
                    Math.round(Math.random()).toString()
                  ).join('')}
                </div>
              ))}
            </div>
          </div>

          <EmojiPuzzle />
        </div>
      )}

      <a
        href="/disclaimer.html"
        className="fixed bottom-4 left-4 text-sm text-gray-500 hover:text-[#39ff14] transition-colors duration-300"
      >
        Disclaimer
      </a>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-4 right-4 p-2 bg-black/50 rounded-full"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </main>
  );
}