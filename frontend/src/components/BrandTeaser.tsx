import { ChevronDown } from 'lucide-react';

interface BrandTeaserProps {
  backgroundImage?: string;
}

export function BrandTeaser({ backgroundImage }: BrandTeaserProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 
          className="uppercase-headline mb-4"
          style={{ 
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            letterSpacing: '0.15em'
          }}
        >
          XONED
        </h1>
        <p 
          className="uppercase-headline mb-2"
          style={{ 
            fontSize: 'clamp(12px, 2vw, 16px)',
            letterSpacing: '0.3em',
            fontWeight: 300
          }}
        >
          THE FUTURE OF FASHION
        </p>
        <p 
          style={{ 
            fontSize: 'clamp(10px, 1.5vw, 14px)',
            letterSpacing: '0.1em',
            opacity: 0.9,
            fontWeight: 300
          }}
        >
          Cryptic. Editorial. Avant-garde.
        </p>

        {/* CTA Button */}
        <button 
          onClick={scrollToContent}
          className="mt-12 px-8 py-3 bg-white text-[#262930] uppercase-headline transition-all duration-300 hover:bg-[#D04007] hover:text-white hover:scale-105"
          style={{ 
            fontSize: '11px',
            letterSpacing: '0.2em'
          }}
        >
          ENTER THE VOID
        </button>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white transition-all duration-300 hover:text-[#D04007] animate-bounce"
      >
        <span className="uppercase-headline" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
          SCROLL
        </span>
        <ChevronDown size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}