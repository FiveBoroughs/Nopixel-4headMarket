"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { DecryptSequence, getDecryptSequence } from "../utils/decryptSequence";

let BASE_EMOJI_GRID = [
  "🐈",
  "🌟",
  "🦊",
  "🐕",
  "💀",
  "🌙",
  "🔥",
  "🦁",
  "🎭",
  "🐍",
  "👾",
  "🎪",
  "🦇",
  "🎡",
  "🐘",
  "🌋",
  "🗿",
  "🦖",
  "🐪",
  "🎢",
  "🎠",
  "🦅",
  "📏",
  "🐋",
  "🦕",
  "🌈",
  "🎨",
  "🎯",
  "🎲",
  "🎸",
  "🌺",
  "🍄",
  "🦚",
  "🦈",
  "🦩",
  "🦒",
  "🦘",
  "🦫",
  "🦥",
  "🦦",
  "🦡",
  "🦨",
  "🦔",
  "🦃",
  "🦢",
  "🦜",
  "🦤",
  "🦋",
  "🐌",
  "🐞",
];
// Fallback sequence used before the daily sequence is loaded
const DEFAULT_SEQUENCE = { id: 0, emojis: ["📏", "🐕"] };
const TIMER_DURATION = 10;
const GRID_SIZE = 25;

// Fisher-Yates shuffle algorithm to randomize array elements in-place
function shuffleArray(emoji_grid: string[]): string[] {
  // Create a copy to avoid mutating the original array
  let shuffled = [...emoji_grid];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Creates an emoji grid containing the target sequence emojis and random decoys
const generateShuffledGrid = (sequence: DecryptSequence) => {
  let availableEmojis = new Set(BASE_EMOJI_GRID);
  sequence.emojis.forEach((emoji) => availableEmojis.delete(emoji));
  let shuffledBase = shuffleArray(Array.from(availableEmojis));
  let finalGrid = shuffledBase.slice(0, GRID_SIZE - sequence.emojis.length);
  finalGrid = [...finalGrid, ...sequence.emojis];
  return shuffleArray(finalGrid);
};

export default function EmojiPuzzle() {
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [dailySequence, setdailySequence] =
    useState<DecryptSequence>(DEFAULT_SEQUENCE);
  const [emojiGrid, setEmojiGrid] = useState<string[]>(() =>
    generateShuffledGrid(DEFAULT_SEQUENCE),
  );
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pressSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  // Reset puzzle state when timer expires
  const resetTimer = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
    //Only play error sound on timer reset if a sequence was attempted
    if (selectedSequence.length > 0)
      errorSound.current?.play().catch(console.error);
    setSelectedSequence([]);
    setEmojiGrid(generateShuffledGrid(dailySequence));
  }, [dailySequence, selectedSequence]);

  // Initialize audio elements on component mount
  useEffect(() => {
    pressSound.current = new Audio("/sounds/select.mp3");
    successSound.current = new Audio("/sounds/success.mp3");
    errorSound.current = new Audio("/sounds/error.mp3");
  }, []);

  // Fetch the daily decrypt sequence on component mount
  useEffect(() => {
    const fetchSequence = async () => {
      const decryptSequence = await getDecryptSequence();
      if (decryptSequence && decryptSequence.emojis.length >= 1) {
        setdailySequence(decryptSequence);
        setEmojiGrid(generateShuffledGrid(decryptSequence));
      }
    };

    fetchSequence();
  }, []);

  // Manage countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 0.1);
      }, 100) as NodeJS.Timeout;
    } else {
      resetTimer();
    }

    // Cleanup interval on unmount or when timeLeft changes
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, dailySequence, resetTimer]);

  // Handle emoji selection and sequence validation
  const handleEmojiClick = (emoji: string) => {
    try {
      if (isLoading || !dailySequence) return;

      // Toggle emoji selection if already chosen
      if (selectedSequence.includes(emoji)) {
        pressSound.current?.play().catch(console.error);
        setSelectedSequence(selectedSequence.filter((e) => e !== emoji));
        return;
      }

      // Add new emoji to selection
      const newSelected = [...selectedSequence, emoji];
      pressSound.current?.play().catch(console.error);
      setSelectedSequence(newSelected);

      // Validate sequence when the correct amount of emojis are selected
      if (newSelected.length === dailySequence.emojis.length) {
        setIsLoading(true);

        // Check if sequence matches the daily target
        if (
          newSelected.every(
            (emoji, index) => emoji === dailySequence.emojis[index],
          )
        ) {
          // Handle successful sequence match
          successSound.current?.play().catch(console.error);
          if (timerRef.current) clearInterval(timerRef.current);
          setShowSuccessPopup(true);

          // Redirect to restricted area after delay
          setTimeout(() => {
            window.location.href = "/restricted";
          }, 1500);
        } else {
          // Handle incorrect sequence
          errorSound.current?.play().catch(console.error);
          setTimeout(() => setSelectedSequence([]), 200);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error in emoji selection:", err);
      setIsLoading(false);
      setSelectedSequence([]);
    }
  };

  return (
    <div>
      {/* Loading overlay - displays during sequence validation */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-[#39ff14] animate-pulse">PROCESSING...</div>
        </div>
      )}

      {/* Success popup - displays when correct sequence is found */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/90 border-2 border-[#39ff14] p-8 rounded-lg">
            <h2 className="text-[#39ff14] text-4xl toxic-shadow animate-pulse">
              ACCESS GRANTED
            </h2>
          </div>
        </div>
      )}

      {/* Main puzzle container */}
      <div className="mt-8 bg-black/50 p-6 border border-[#39ff14] rounded-lg backdrop-blur-sm">
        <h3 className="text-xl text-[#39ff14] toxic-shadow mb-4">
          DECRYPT SEQUENCE
        </h3>

        {/* Emoji grid and selection interface */}
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-4">
            {emojiGrid.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className={`text-2xl p-2 rounded-lg transition-all duration-300 ${
                  selectedSequence.includes(emoji)
                    ? "bg-[#8b0000] scale-110"
                    : "bg-black/30 hover:bg-[#39ff14]/20"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Selection status display */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Selected: {selectedSequence.join(" ")} {selectedSequence.length}/
            {dailySequence.emojis.length}
          </div>

          {/* Timer progress bar */}
          <div className="w-full h-1 bg-gray-700 rounded-full my-2">
            <div
              className="h-full bg-[#39ff14] rounded-full transition-all duration-100"
              style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
