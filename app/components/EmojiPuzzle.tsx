"use client";
import { useState, useEffect, useRef } from 'react';
import { DecryptSequence, getDecryptSequence } from '../utils/decryptSequence'

let BASE_EMOJI_GRID = [
  '🐈', '🌟', '🦊', '🐕', '💀', '🌙', '🔥', '🦁', '🎭', '🐍',
  '👾', '🎪', '🦇', '🎡', '🐘', '🌋', '🗿', '🦖', '🐪', '🎢',
  '🎠', '🦅', '📏', '🐋', '🦕', '🌈', '🎨', '🎯', '🎲', '🎸',
  '🌺', '🍄', '🦚', '🦈', '🦩', '🦒', '🦘', '🦫', '🦥', '🦦',
  '🦡', '🦨', '🦔', '🦃', '🦢', '🦜', '🦤', '🦋', '🐌', '🐞'
];

function shuffleArray(emoji_grid: string[]): string[] {
  // Create a copy to avoid mutating the original array
  let shuffled = [...emoji_grid];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function EmojiPuzzle() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyPassword, setDailyPassword] = useState<{ emoji_1: string; emoji_2: string }>({ emoji_1: "🐕", emoji_2: "📏" });
  const pressSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const [emojiGrid, setEmojiGrid] = useState<string[]>([]); // Add this line

  useEffect(() => {
    pressSound.current = new Audio('/sounds/select.mp3');
    successSound.current = new Audio('/sounds/success.mp3');
    errorSound.current = new Audio('/sounds/error.mp3');

    const fetchSequence = async () => {
      const decryptSequence = await getDecryptSequence();
      setDailyPassword(decryptSequence);

      // Create a set of available emojis (excluding password emojis)
      let availableEmojis = new Set(BASE_EMOJI_GRID);
      availableEmojis.delete(decryptSequence.emoji_1);
      availableEmojis.delete(decryptSequence.emoji_2);
      // Convert to array and shuffle
      let shuffledBase = shuffleArray(Array.from(availableEmojis));

      // Take first 23 unique emojis
      let finalGrid = shuffledBase.slice(0, 23);

      // Add the daily password emojis
      finalGrid.push(decryptSequence.emoji_1, decryptSequence.emoji_2);

      // Shuffle again to randomize the positions
      setEmojiGrid(shuffleArray(finalGrid));
    };

    fetchSequence();
  }, []);

  const handleEmojiClick = (emoji: string) => {
    try {
      if (isLoading || !dailyPassword) return;
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
        if (newSelected[0] === dailyPassword.emoji_1 && newSelected[1] === dailyPassword.emoji_2) {
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
          {emojiGrid.map((emoji, index) => (
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