"use client";
import { useState, useEffect, useRef } from 'react';

let EMOJI_GRID = shuffleArray([
  '🐈', '🌟', '🦊', '🐕', '💀',
  '🌙', '🔥', '🦁', '🎭', '🐍',
  '👾', '🎪', '🦇', '🎡', '🐘',
  '🌋', '🗿', '🦖', '🐪', '🎢',
  '🎠', '🦅', '📏', '🐋', '🦕'
]);

function shuffleArray(emoji_grid: string[]): string[] {
  for (let i = emoji_grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emoji_grid[i], emoji_grid[j]] = [emoji_grid[j], emoji_grid[i]];
  }
  return emoji_grid;
}

export default function EmojiPuzzle() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pressSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    pressSound.current = new Audio('/sounds/select.mp3');
    successSound.current = new Audio('/sounds/success.mp3');
    errorSound.current = new Audio('/sounds/error.mp3');
  }, []);

  const handleEmojiClick = (emoji: string) => {
    try {
      if (isLoading) return;
      // If already selected, deselect it
      if (selected.includes(emoji)) {
        pressSound.current?.play().catch(console.error);
        setSelected(selected.filter(e => e !== emoji));
        return;
      }

      // Select the emoji
      const newSelected = [...selected, emoji];
      pressSound.current?.play().catch(console.error);
      setSelected(newSelected);

      // Check conditions when two emojis are selected
      if (newSelected.length === 2) {
        setIsLoading(true);
        if (newSelected[0] === '📏' && newSelected[1] === '🐕') {
          // Success condition
          successSound.current?.play().catch(console.error);

          // Create and show popup
          const popup = document.createElement('div');
          popup.className = 'fixed inset-0 flex items-center justify-center z-50';
          popup.innerHTML = `
          <div class="bg-black/90 border-2 border-[#39ff14] p-8 rounded-lg">
            <h2 class="text-[#39ff14] text-4xl toxic-shadow animate-pulse">ACCESS GRANTED</h2>
          </div>
        `;
          document.body.appendChild(popup);

          setTimeout(() => {
            window.location.href = '/restricted';
          }, 1500);
        } else {
          // Wrong combination
          errorSound.current?.play().catch(console.error);
          setTimeout(() => setSelected([]), 200);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error in emoji selection:', err);
      setIsLoading(false);
      setSelected([]);
    }
  };

  return (
    <div >
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-[#39ff14] animate-pulse">PROCESSING...</div>
        </div>
      )}
      <div className="mt-8 bg-black/50 p-6 border border-[#39ff14] rounded-lg backdrop-blur-sm">
        <h3 className="text-xl text-[#39ff14] toxic-shadow mb-4">DECRYPT SEQUENCE</h3>
        <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
          {EMOJI_GRID.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className={`text-2xl p-2 rounded-lg transition-all duration-300 ${
                selected.includes(emoji)
                ? 'bg-[#8b0000] scale-110'
                : 'bg-black/30 hover:bg-[#39ff14]/20'
              }`}
              >
              {emoji}
            </button>
          ))}
        </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Selected: {selected.join(' ')} {selected.length}/2
          </div>
      </div>
    </div>
  );
}