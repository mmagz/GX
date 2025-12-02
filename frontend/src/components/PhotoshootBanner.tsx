import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1670132718453-70321d9ecf20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzYwMjUyMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'EDITORIAL COLLECTION',
    subtitle: 'FALL/WINTER 2025'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW4lMjBmYXNoaW9ufGVufDF8fHx8MTc2MDI3MTc1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'URBAN CIPHER',
    subtitle: 'STREET ESSENTIALS'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1733736075345-55db261a8ac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMTc0MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'LUXURY LINE',
    subtitle: 'PREMIUM PIECES'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1613728455120-d00493b5e77e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGJsYWNrfGVufDF8fHx8MTc2MDI3MTc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'NOIR AESTHETIC',
    subtitle: 'MINIMAL ESSENCE'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1717944105945-669b3dd77bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjAyNDA4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'AVANT GARDE',
    subtitle: 'FUTURE FORWARD'
  }
];

export function PhotoshootBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="relative w-full h-[500px] md:h-[700px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Text Overlay */}
          <div className="absolute bottom-16 left-8 md:left-16 text-white z-10">
            <h2 
              className="uppercase-headline mb-2"
              style={{ 
                fontSize: 'clamp(24px, 4vw, 48px)',
                fontWeight: 600,
                letterSpacing: '0.1em'
              }}
            >
              {slide.title}
            </h2>
            <p 
              className="uppercase-headline"
              style={{ 
                fontSize: 'clamp(10px, 1.5vw, 14px)',
                letterSpacing: '0.2em',
                opacity: 0.9
              }}
            >
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#D04007] hover:scale-110"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#D04007] hover:scale-110"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-[#D04007] w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
