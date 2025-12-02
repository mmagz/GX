import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#262930] text-[#f9f7f0]">
      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div>
            <h3 
              className="uppercase-headline mb-6"
              style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.2em' }}
            >
              XONED
            </h3>
            <p 
              className="mb-6 opacity-80 leading-relaxed"
              style={{ fontSize: '12px' }}
            >
              Redefining fashion through cryptic design, editorial aesthetics, 
              and avant-garde innovation.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-2 border border-[#f9f7f0]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:scale-110"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="p-2 border border-[#f9f7f0]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:scale-110"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="p-2 border border-[#f9f7f0]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:scale-110"
              >
                <Youtube size={16} />
              </a>
              <a 
                href="#" 
                className="p-2 border border-[#f9f7f0]/20 rounded-full transition-all duration-300 hover:bg-[#D04007] hover:border-[#D04007] hover:scale-110"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 
              className="uppercase-headline mb-6"
              style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 600 }}
            >
              SHOP
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#capsule" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Current Drop
                </a>
              </li>
              <li>
                <a 
                  href="#vault" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  The Vault
                </a>
              </li>
              <li>
                <a 
                  href="#essentials" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Essentials
                </a>
              </li>
              <li>
                <a 
                  href="#outerwear" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Outerwear
                </a>
              </li>
              <li>
                <a 
                  href="#accessories" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 
              className="uppercase-headline mb-6"
              style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 600 }}
            >
              SUPPORT
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#about" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#shipping" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#size-guide" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 
              className="uppercase-headline mb-6"
              style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 600 }}
            >
              LEGAL
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#privacy" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#refund" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a 
                  href="#cookies" 
                  className="opacity-80 transition-all duration-300 hover:opacity-100 hover:text-[#D04007] hover:translate-x-1 inline-block"
                  style={{ fontSize: '12px' }}
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#f9f7f0]/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="opacity-60"
              style={{ fontSize: '11px' }}
            >
              © {currentYear} XONED. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <span 
                className="uppercase-headline opacity-60"
                style={{ fontSize: '9px', letterSpacing: '0.15em' }}
              >
                MADE IN INDIA
              </span>
              <span className="opacity-30">|</span>
              <span 
                className="uppercase-headline opacity-60"
                style={{ fontSize: '9px', letterSpacing: '0.15em' }}
              >
                CRAFTED WITH PRECISION
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
