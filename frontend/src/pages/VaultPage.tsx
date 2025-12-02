import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArchivedDropProducts } from '../components/ArchivedDropProducts';
import { Lock, Archive, Clock, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '@clerk/clerk-react';
import { fetchAPI } from '../utils/api';
import { PageLoader } from '../components/PageLoader';

// Past collection data
const collections = [
  {
    id: 'genesis',
    name: 'GENESIS',
    season: 'WINTER 2024',
    date: 'December 2024',
    description: 'The beginning. Where it all started. Limited to 100 pieces.',
    status: 'SOLD OUT',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NjAyNzQ2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [
      {
        id: 'g1',
        name: 'GENESIS PARKA',
        price: 29999,
        image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1pbmltYWwlMjBmYXNoaW9uJTIwY29hdHxlbnwxfHx8fDE3NjAyNzQ2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'OUTERWEAR',
        stock: 0,
        colors: ['#000000']
      },
      {
        id: 'g2',
        name: 'GENESIS HOODIE',
        price: 9999,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyc2l6ZWQlMjBob29kaWUlMjBzdHJlZXR8ZW58MXx8fHwxNzYwMjczOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'ESSENTIALS',
        stock: 0,
        colors: ['#000000', '#1a1a1a']
      },
      {
        id: 'g3',
        name: 'GENESIS CARGO',
        price: 11999,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBhbnRzJTIwYmxhY2t8ZW58MXx8fHwxNzYwMjczOTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'BOTTOMS',
        stock: 0,
        colors: ['#000000']
      },
      {
        id: 'g4',
        name: 'GENESIS TOTE',
        price: 6999,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYmxhY2slMjBhY2Nlc3NvcmllcyUyMGx1eHVyeXxlbnwxfHx8fDE3NjAyNzQ2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'ACCESSORIES',
        stock: 0,
        colors: ['#000000']
      }
    ]
  },
  {
    id: 'noir-collection',
    name: 'NOIR',
    season: 'AUTUMN 2024',
    date: 'September 2024',
    description: 'Embracing darkness. Monochromatic excellence in every stitch.',
    status: 'ARCHIVE',
    image: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdHJlZXR3ZWFyJTIwZGFyayUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NjAyNzQ2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [
      {
        id: 'n1',
        name: 'NOIR TRENCH',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2F0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjAyNzQwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'OUTERWEAR',
        stock: 0,
        colors: ['#000000']
      },
      {
        id: 'n2',
        name: 'NOIR KNIT',
        price: 7999,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwdHNoaXJ0JTIwbWluaW1hbHxlbnwxfHx8fDE3NjAyNzM5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'BASICS',
        stock: 0,
        colors: ['#000000', '#262930']
      },
      {
        id: 'n3',
        name: 'NOIR SNEAKERS',
        price: 14999,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwc25lYWtlcnMlMjBmYXNoaW9ufGVufDF8fHx8MTc2MDI3MzkzNXww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'FOOTWEAR',
        stock: 0,
        colors: ['#000000']
      }
    ]
  },
  {
    id: 'monolith',
    name: 'MONOLITH',
    season: 'SUMMER 2024',
    date: 'June 2024',
    description: 'Architectural precision meets street sensibility. Bold, unapologetic, timeless.',
    status: 'ARCHIVE',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGphY2tldCUyMGJsYWNrJTIwcHJlbWl1bXxlbnwxfHx8fDE3NjAyNzQ2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [
      {
        id: 'm1',
        name: 'MONOLITH BOMBER',
        price: 15999,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqYWNrZXQlMjB1cmJhbnxlbnwxfHx8fDE3NjAyNzM5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'OUTERWEAR',
        stock: 0,
        colors: ['#000000', '#404040']
      },
      {
        id: 'm2',
        name: 'MONOLITH SHORTS',
        price: 5999,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwc2hvcnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjAyNzQwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'BOTTOMS',
        stock: 0,
        colors: ['#000000']
      },
      {
        id: 'm3',
        name: 'MONOLITH CAP',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwMjczOTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'ACCESSORIES',
        stock: 0,
        colors: ['#000000']
      }
    ]
  },
  {
    id: 'cipher-origins',
    name: 'CIPHER ORIGINS',
    season: 'SPRING 2024',
    date: 'March 2024',
    description: 'The origin of the code. Deconstructed classics with cryptic details.',
    status: 'ARCHIVE',
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMjc0NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [
      {
        id: 'c1',
        name: 'CIPHER HOODIE V1',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyc2l6ZWQlMjBob29kaWUlMjBzdHJlZXR8ZW58MXx8fHwxNzYwMjczOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'ESSENTIALS',
        stock: 0,
        colors: ['#000000']
      },
      {
        id: 'c2',
        name: 'CIPHER PANTS',
        price: 9999,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBhbnRzJTIwYmxhY2t8ZW58MXx8fHwxNzYwMjczOTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'BOTTOMS',
        stock: 0,
        colors: ['#000000', '#262930']
      },
      {
        id: 'c3',
        name: 'CIPHER TEE',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwdHNoaXJ0JTIwbWluaW1hbHxlbnwxfHx8fDE3NjAyNzM5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'BASICS',
        stock: 0,
        colors: ['#000000', '#ffffff']
      },
      {
        id: 'c4',
        name: 'CIPHER BACKPACK',
        price: 5999,
        image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwMjczOTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'ACCESSORIES',
        stock: 0,
        colors: ['#000000']
      }
    ]
  }
];

export function VaultPage() {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [archivedDrops, setArchivedDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchArchivedDrops = async () => {
      try {
        const token = await getToken().catch(() => undefined);
        const data = await fetchAPI('/api/drop/archived', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (data.success) {
          setArchivedDrops(data.drops || []);
        }
      } catch (error) {
        console.error('Failed to fetch archived drops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedDrops();
  }, [getToken]);

  // Filter archived drops based on selection
  const filteredDrops = archivedDrops.filter(drop => {
    if (selectedCollection !== 'all' && drop.dropCode.toString() !== selectedCollection) return false;
    if (selectedYear !== 'all') {
      const year = drop.season.split(' ')[1];
      if (year !== selectedYear) return false;
    }
    return true;
  });

  const years = ['2025', '2024', '2023', '2022'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
        <PageLoader message="LOADING VAULT" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        {/* Hero Section with Dark Theme */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Archive className="text-[#CC5500]" size={32} />
              <h1 
                className="uppercase-headline text-white"
                style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 700, letterSpacing: '0.15em' }}
              >
                THE VAULT
              </h1>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto" style={{ fontSize: '15px' }}>
              Archive of past collections. Each drop tells a story, each piece a chapter in the 
              XONED legacy. These are the ciphers that came before.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger 
                className="w-full sm:w-[200px] bg-white/5 border-white/20 text-white hover:border-[#CC5500] transition-colors"
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}
              >
                <SelectValue placeholder="SELECT YEAR" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20">
                <SelectItem value="all" className="text-white">ALL YEARS</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year} className="text-white">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger 
                className="w-full sm:w-[200px] bg-white/5 border-white/20 text-white hover:border-[#CC5500] transition-colors"
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}
              >
                <SelectValue placeholder="SELECT COLLECTION" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20">
                <SelectItem value="all" className="text-white">ALL COLLECTIONS</SelectItem>
                {archivedDrops.map(drop => (
                  <SelectItem key={drop.dropCode} value={drop.dropCode.toString()} className="text-white">
                    {drop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedCollection !== 'all' || selectedYear !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setSelectedYear('all');
                }}
                className="px-4 py-2 border border-white/20 text-white rounded-sm hover:border-[#CC5500] hover:text-[#CC5500] transition-colors duration-300"
                style={{ fontSize: '10px', letterSpacing: '0.1em' }}
              >
                CLEAR FILTERS
              </button>
            )}
          </div>
        </div>

        {/* Collections */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-20">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#262930]" style={{ fontSize: '16px' }}>Loading...</p>
            </div>
          ) : (
            filteredDrops.map((drop, index) => (
            <div key={drop.dropCode} className="space-y-8">
              {/* Collection Header */}
              <div className="relative">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Collection Info */}
                  <div className={`space-y-4 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1 bg-[#CC5500]"></div>
                      <span 
                        className="uppercase-headline text-[#CC5500]"
                        style={{ fontSize: '11px', letterSpacing: '0.15em' }}
                      >
                        {drop.season}
                      </span>
                    </div>
                    
                    <h2 
                      className="uppercase-headline text-white"
                      style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '0.1em' }}
                    >
                      {drop.name}
                    </h2>
                    
                    <p className="text-white/70 leading-relaxed" style={{ fontSize: '14px' }}>
                      {drop.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-white/50">
                        <Clock size={16} />
                        <span style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                          {drop.date}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-white/5 border border-white/20 rounded-full">
                        <span 
                          className="uppercase-headline text-white/70"
                          style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                        >
                          {drop.status}
                        </span>
                      </div>
                      {drop.status === 'ARCHIVED' && (
                        <div className="flex items-center gap-2 text-[#CC5500]">
                          <Lock size={14} />
                          <span style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                            ARCHIVED
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collection Hero Image */}
                  <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="aspect-[4/5] rounded-sm overflow-hidden border border-white/10">
                      <img 
                        src={drop.bannerUrl}
                        alt={drop.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div 
                      className="absolute -bottom-4 -right-4 px-6 py-3 bg-[#CC5500] text-white"
                      style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 600 }}
                    >
                      {drop.productCount} PIECES
                    </div>
                  </div>
                </div>
              </div>

              {/* Collection Products Grid */}
              <ArchivedDropProducts dropCode={drop.dropCode} />

              {/* Divider */}
              {index < filteredDrops.length - 1 && (
                <div className="pt-12">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              )}
            </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredDrops.length === 0 && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="text-center py-20">
              <Archive size={64} className="mx-auto mb-6 text-white/30" />
              <h3 
                className="uppercase-headline text-white mb-3"
                style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                NO COLLECTIONS FOUND
              </h3>
              <p className="text-white/60 mb-8" style={{ fontSize: '13px' }}>
                Try adjusting your filters
              </p>
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setSelectedYear('all');
                }}
                className="px-6 py-3 bg-[#CC5500] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-105"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                CLEAR FILTERS
              </button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-20">
          <div className="relative rounded-sm overflow-hidden border border-white/10 p-12 md:p-16 text-center bg-gradient-to-br from-white/5 to-transparent">
            <div className="relative z-10">
              <h3 
                className="uppercase-headline text-white mb-4"
                style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 600, letterSpacing: '0.1em' }}
              >
                MISSED A DROP?
              </h3>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto" style={{ fontSize: '14px' }}>
                Join our waitlist to be notified when archived pieces become available again 
                through special re-releases or when new collections drop.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#capsule"
                  className="px-8 py-4 bg-[#CC5500] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-105"
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                >
                  VIEW CURRENT COLLECTION
                </a>
                <button
                  onClick={() => toast.success('Added to waitlist', {
                    description: 'We\'ll notify you when this collection is available'
                  })}
                  className="px-8 py-4 border-2 border-white text-white uppercase-headline transition-all duration-300 hover:bg-white hover:text-[#262930] hover:scale-105"
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                >
                  JOIN WAITLIST
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
