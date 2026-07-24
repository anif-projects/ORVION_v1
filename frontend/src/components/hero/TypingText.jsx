import React, { useState, useEffect } from 'react';

const DYNAMIC_WORDS = [
  'Innovation.',
  'Leadership.',
  'Success.',
  'Excellence.',
  'Careers.',
  'Future.',
  'Impact.',
  'Technology.',
];

export default function TypingText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = DYNAMIC_WORDS[wordIndex];
    let speed = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 3000; // Hold full word for 3 seconds as specified
    }

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setCharIndex((prev) => prev + 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex]);

  const currentText = DYNAMIC_WORDS[wordIndex].substring(0, charIndex);

  return (
    <span className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500">
      <span>{currentText}</span>
      {/* Gentle Blinking Cursor */}
      <span className="inline-block w-[3px] h-[0.8em] bg-primary-500 dark:bg-primary-400 ml-1 rounded-full animate-pulse align-middle opacity-80" />
    </span>
  );
}
