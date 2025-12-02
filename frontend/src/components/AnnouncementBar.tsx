import React, { useEffect, useState } from 'react';

const messages = [
  'WORLD WIDE SHIPPING',
  'GET XONED',
  'DOUBLE VALUE'
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white z-[60] h-8 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {messages.map((message, index) => (
          <div
            key={message}
            className={`absolute uppercase-headline transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 translate-y-0'
                : index < currentIndex
                ? 'opacity-0 -translate-y-full'
                : 'opacity-0 translate-y-full'
            }`}
            style={{ fontSize: '10px', letterSpacing: '0.15em' }}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
