import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Separator } from '../components/ui/separator';
import { Award, Leaf, Users, Zap, Quote } from 'lucide-react';

const teamMembers = [
  {
    name: 'Arjun Mehta',
    role: 'Creative Director & Co-Founder',
    image: 'https://images.unsplash.com/photo-1677706678623-c417a272c92a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRpcmVjdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMjQxMTYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Former head designer at leading European fashion houses, bringing 15 years of avant-garde vision to Indian streetwear.'
  },
  {
    name: 'Priya Sharma',
    role: 'Brand Strategist & Co-Founder',
    image: 'https://images.unsplash.com/photo-1598201116904-9613ee826e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwdGVhbSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDI3Mzg1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Marketing maven with a passion for storytelling, crafting the narrative that makes XONED more than just a brand.'
  },
  {
    name: 'Kabir Singh',
    role: 'Head of Production',
    image: 'https://images.unsplash.com/photo-1636047250452-6772f6144b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NjAyNzM4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Third-generation textile expert ensuring every piece meets our uncompromising standards of quality and craftsmanship.'
  }
];

const values = [
  {
    icon: Award,
    title: 'CRAFTSMANSHIP',
    description: 'Every piece is meticulously crafted using premium materials and time-tested techniques, blending traditional Indian craftsmanship with contemporary design.'
  },
  {
    icon: Zap,
    title: 'INNOVATION',
    description: 'We push boundaries, experimenting with cutting-edge fabrics and silhouettes while staying true to our minimalist aesthetic and functional design principles.'
  },
  {
    icon: Leaf,
    title: 'SUSTAINABILITY',
    description: 'Committed to ethical production, we source responsibly, minimize waste, and create timeless pieces that transcend seasonal trends.'
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    description: 'XONED is more than a brand—it\'s a cipher, a collective of individuals who appreciate understated luxury and cryptic sophistication.'
  }
];

const milestones = [
  { year: '2022', event: 'XONED founded in Bengaluru with a vision to redefine Indian streetwear' },
  { year: '2023', event: 'First capsule collection sells out in 48 hours, establishing cult following' },
  { year: '2024', event: 'Expanded to 5 cities across India, collaborated with renowned artists' },
  { year: '2025', event: 'International expansion begins, opening flagship store in Mumbai' }
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h1 
              className="uppercase-headline mb-6"
              style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 700, letterSpacing: '0.15em' }}
            >
              ABOUT XONED
            </h1>
            <p 
              className="max-w-3xl mx-auto leading-relaxed"
              style={{ fontSize: '15px', opacity: 0.8 }}
            >
              Where cryptic sophistication meets uncompromising quality. We are the cipher 
              in luxury streetwear, creating pieces that speak to those who understand the 
              language of understated elegance.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[21/9] rounded-sm overflow-hidden mb-8">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1704729105381-f579cfcefd63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzdHVkaW8lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYwMjczODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="XONED Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f9f7f0] via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="uppercase-headline mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '0.1em' }}
              >
                OUR STORY
              </h2>
              <div className="space-y-4 leading-relaxed" style={{ fontSize: '14px', opacity: 0.85 }}>
                <p>
                  Born in 2022 from a collective frustration with the Indian fashion landscape, 
                  XONED emerged as a rebellion against the ordinary. We saw a gap—a void where 
                  luxury streetwear should exist, designed for those who refuse to compromise 
                  on quality or authenticity.
                </p>
                <p>
                  Our name, <span className="text-[#D04007]">XONED</span>, represents the intersection—the 
                  crossing of boundaries between high fashion and street culture, between traditional 
                  Indian craftsmanship and contemporary minimalism, between exclusivity and accessibility.
                </p>
                <p>
                  What started as a capsule collection of 100 pieces has evolved into a movement. 
                  Each drop is a cipher, a coded message to those who understand that true luxury 
                  doesn't scream—it whispers.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[3/4] rounded-sm overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1755224928593-352eeada6db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYWJyaWMlMjB0ZXh0aWxlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjAyNzM4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fabric Detail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div 
                className="absolute -bottom-6 -right-6 px-6 py-4 bg-[#D04007] text-white"
                style={{ fontSize: '12px', letterSpacing: '0.15em' }}
              >
                <p className="uppercase-headline">CRAFTED WITH INTENTION</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="max-w-[1200px] mx-auto mb-16 md:mb-24" />

        {/* Values Section */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <h2 
            className="uppercase-headline text-center mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '0.1em' }}
          >
            OUR VALUES
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="frosted-glass border border-white/30 rounded-sm p-8 hover:border-[#D04007]/30 transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <Icon size={32} className="text-[#D04007] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 
                    className="uppercase-headline mb-3"
                    style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    {value.title}
                  </h3>
                  <p className="leading-relaxed" style={{ fontSize: '13px', opacity: 0.8 }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Section */}
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <div className="relative frosted-glass border border-white/30 rounded-sm p-12 md:p-16">
            <Quote size={48} className="absolute top-8 left-8 text-[#D04007] opacity-30" />
            <blockquote 
              className="text-center relative z-10"
              style={{ fontSize: 'clamp(18px, 3vw, 24px)', lineHeight: 1.6, letterSpacing: '0.02em' }}
            >
              "Fashion fades, but style is eternal. We don't create trends—we craft timeless 
              pieces for those who write their own rules."
            </blockquote>
            <p 
              className="text-center mt-6 uppercase-headline text-[#D04007]"
              style={{ fontSize: '12px', letterSpacing: '0.15em' }}
            >
              — ARJUN MEHTA, CREATIVE DIRECTOR
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <h2 
            className="uppercase-headline text-center mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '0.1em' }}
          >
            MEET THE FOUNDERS
          </h2>
          <p className="text-center mb-12 opacity-70" style={{ fontSize: '13px' }}>
            The minds behind the cipher
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 
                  className="uppercase-headline mb-1"
                  style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
                >
                  {member.name}
                </h3>
                <p 
                  className="mb-3 text-[#D04007]"
                  style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                >
                  {member.role}
                </p>
                <p className="leading-relaxed" style={{ fontSize: '13px', opacity: 0.8 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="max-w-[1200px] mx-auto mb-16 md:mb-24" />

        {/* Timeline Section */}
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
          <h2 
            className="uppercase-headline text-center mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '0.1em' }}
          >
            OUR JOURNEY
          </h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="flex gap-6 items-start group"
              >
                <div 
                  className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-[#D04007] flex items-center justify-center frosted-glass group-hover:bg-[#D04007] group-hover:text-white transition-all duration-300"
                  style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {milestone.year}
                </div>
                <div className="flex-1 pt-4">
                  <p className="leading-relaxed" style={{ fontSize: '14px', opacity: 0.85 }}>
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Store Section */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="relative rounded-sm overflow-hidden">
            <div className="aspect-[21/9]">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1728422185403-bd601397f30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwMjczODUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="XONED Store"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 
                  className="uppercase-headline mb-4"
                  style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '0.15em' }}
                >
                  VISIT OUR FLAGSHIP
                </h2>
                <p className="mb-8 max-w-2xl mx-auto" style={{ fontSize: '14px', opacity: 0.9 }}>
                  Experience XONED in person at our flagship store in Indiranagar, Bengaluru. 
                  Immerse yourself in the complete brand experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-8 py-4 bg-white text-[#262930] uppercase-headline transition-all duration-300 hover:bg-[#D04007] hover:text-white hover:scale-105"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  >
                    FIND STORES
                  </button>
                  <button
                    className="px-8 py-4 border-2 border-white text-white uppercase-headline transition-all duration-300 hover:bg-white hover:text-[#262930] hover:scale-105"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  >
                    CONTACT US
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
