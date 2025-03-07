import React, { useState, useEffect } from 'react';

function TypingEffect({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!text) return; // Prevent typing if no text is available

    setDisplayedText(''); // Reset displayedText when the text prop changes
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++; // Increment index after appending the character
      } else {
        clearInterval(interval); // Clear the interval when the text is fully displayed
      }
    }, speed);

    return () => clearInterval(interval); // Clean up interval on unmount or text change
  }, [text, speed]);

  return <div>{displayedText}</div>;
}

export default TypingEffect;
