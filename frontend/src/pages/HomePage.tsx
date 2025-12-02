import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { BrandTeaser } from '../components/BrandTeaser';
import { PhotoshootBanner } from '../components/PhotoshootBanner';
import { FeaturedPieces } from '../components/FeaturedPieces';
import { ProductTeaser } from '../components/ProductTeaser';
import { JoinTheCipher } from '../components/JoinTheCipher';
import { Footer } from '../components/Footer';

export function HomePage() {
  // Prefer Cloudinary brand banner if available
  const heroImage = (window as any).BRAND_BANNER_URL 
    || 'https://res.cloudinary.com/djmywljxv/image/upload/f_auto,q_auto,dpr_auto/v1760432071/xoned/banners/brandbanner.jpg';

  return (
    <div className="min-h-screen relative">
      <AnnouncementBar />
      <NavBar />
      
      {/* Fixed Hero Banner */}
      <div className="fixed inset-0 z-0">
        <BrandTeaser backgroundImage={heroImage} />
      </div>
      
      {/* Scrolling Content - positioned to start below viewport */}
      <div 
        className="relative z-10 bg-[#f9f7f0]" 
        style={{ 
          marginTop: '100vh',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <PhotoshootBanner />
        <FeaturedPieces />
        <ProductTeaser />
        <JoinTheCipher />
        <Footer />
      </div>
    </div>
  );
}