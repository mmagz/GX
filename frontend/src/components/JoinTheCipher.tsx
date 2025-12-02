import { Instagram, Twitter, Youtube } from 'lucide-react';

export function JoinTheCipher() {
  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="frosted-glass border border-white/30 rounded-sm p-8 md:p-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <p 
              className="uppercase-headline text-[#D04007] mb-4"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}
            >
              COMMUNITY
            </p>
            
            <h2 
              className="uppercase-headline mb-6"
              style={{ 
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 600,
                letterSpacing: '0.08em'
              }}
            >
              JOIN THE CIPHER
            </h2>
            
            <p 
              className="mb-8 leading-relaxed opacity-90"
              style={{ fontSize: '13px' }}
            >
              Become part of an exclusive community. Get early access to drops, 
              behind-the-scenes content, and connect with like-minded individuals 
              who appreciate avant-garde fashion.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              <a 
                href="#" 
                className="p-3 border border-[#262930]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:text-white group"
              >
                <Instagram size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a 
                href="#" 
                className="p-3 border border-[#262930]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:text-white group"
              >
                <Twitter size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a 
                href="#" 
                className="p-3 border border-[#262930]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:text-white group"
              >
                <Youtube size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p 
                  className="price-outlined mb-1"
                  style={{ fontSize: '28px' }}
                >
                  50K+
                </p>
                <p 
                  className="uppercase-headline opacity-70"
                  style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                >
                  FOLLOWERS
                </p>
              </div>
              <div>
                <p 
                  className="price-outlined mb-1"
                  style={{ fontSize: '28px' }}
                >
                  1000+
                </p>
                <p 
                  className="uppercase-headline opacity-70"
                  style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                >
                  MEMBERS
                </p>
              </div>
              <div>
                <p 
                  className="price-outlined mb-1"
                  style={{ fontSize: '28px' }}
                >
                  25+
                </p>
                <p 
                  className="uppercase-headline opacity-70"
                  style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                >
                  DROPS
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter Signup */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-sm p-8">
            <h3 
              className="uppercase-headline mb-4"
              style={{ fontSize: '18px', letterSpacing: '0.1em', fontWeight: 600 }}
            >
              STAY UPDATED
            </h3>
            
            <p 
              className="mb-6 opacity-90"
              style={{ fontSize: '12px' }}
            >
              Subscribe to our newsletter for exclusive drops, early access, and insider content.
            </p>

            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  className="w-full px-4 py-3 bg-white/80 border border-[#262930]/20 rounded-sm focus:outline-none focus:border-[#D04007] transition-colors duration-300"
                  style={{ fontSize: '12px' }}
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="w-full px-4 py-3 bg-white/80 border border-[#262930]/20 rounded-sm focus:outline-none focus:border-[#D04007] transition-colors duration-300"
                  style={{ fontSize: '12px' }}
                />
              </div>

              <button 
                type="submit"
                className="w-full px-6 py-3 bg-black text-white uppercase-headline transition-all duration-300 hover:bg-[#D04007] hover:scale-[1.02]"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                SUBSCRIBE
              </button>

              <p 
                className="text-center opacity-60"
                style={{ fontSize: '9px' }}
              >
                By subscribing, you agree to our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
