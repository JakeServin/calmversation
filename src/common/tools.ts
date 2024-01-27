// import React, { useState, useEffect } from 'react';

// interface TypingAnimationProps {
//     message: string;
//     onTypingComplete?: () => void;
//     typingSpeedMs?: number;
// }

// const TypingAnimation: React.FC<TypingAnimationProps> = ({
//     message,
//     onTypingComplete,
//     typingSpeedMs = 50 // Default typing speed
// }) => {
//     const [displayedMessage, setDisplayedMessage] = useState<string>('');

//     useEffect(() => {
//         let charIndex = 0;
//         const typeChar = () => {
//             setDisplayedMessage((prev) => prev + message[charIndex]);
//             charIndex++;

//             if (charIndex < message.length) {
//                 setTimeout(typeChar, typingSpeedMs);
//             } else {
//                 onTypingComplete?.(); // Call the callback if provided
//             }
//         };

//         typeChar();

//         // Cleanup function
//         return () => clearTimeout(typeChar);
//     }, [message, typingSpeedMs, onTypingComplete]);

//     return <div>{displayedMessage}</div>;
// };

// export default TypingAnimation;

export const convertApostrophe = (str: string) => {
  return str.replace(/'/g, "&#39;");
}