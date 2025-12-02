import { ArrowRight } from 'lucide-react';

export function ProductTeaser() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZXh0dXJlfGVufDF8fHx8MTc2MDI3MTgzN3ww&ixlib=rb-4.1.0&q=80&w=1080)',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <p 
            className="uppercase-headline text-[#D04007] mb-4"
            style={{ fontSize: '10px', letterSpacing: '0.3em' }}
          >
            EXCLUSIVE ACCESS
          </p>
          
          <h2 
            className="uppercase-headline text-white mb-6"
            style={{ 
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              lineHeight: 1.2
            }}
          >
            THE VAULT
          </h2>
          
          <p 
            className="text-white/90 mb-8 leading-relaxed"
            style={{ fontSize: '14px' }}
          >
            Explore our archive of past collections. Each piece tells a story of innovation, 
            craftsmanship, and timeless design. Limited quantities remain.
          </p>

          <button 
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#262930] uppercase-headline transition-all duration-300 hover:bg-[#D04007] hover:text-white hover:gap-5"
            style={{ fontSize: '11px', letterSpacing: '0.2em' }}
          >
            EXPLORE THE VAULT
            <ArrowRight 
              size={16} 
              className="transition-transform duration-300 group-hover:translate-x-1" 
            />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D04007]/10 blur-[100px] rounded-full" />
    </section>
  );
}
