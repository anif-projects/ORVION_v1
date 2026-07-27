import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Pure high-resolution real tech conference & workshop photos
const galleryDatasets = [
  // Gallery A
  {
    id: 'gallery-a',
    hero: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
    items: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  // Gallery B
  {
    id: 'gallery-b',
    hero: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80',
    items: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  // Gallery C
  {
    id: 'gallery-c',
    hero: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80',
    items: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
    ],
  },
];

// Flat list for Lightbox viewing
const allPhotos = galleryDatasets.flatMap(g => [g.hero, ...g.items]);

export default function EventGallerySection() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Auto-rotate image dataset every 5 seconds (5000ms), paused on desktop hover & lightbox
  useEffect(() => {
    if (isHovered || lightboxPhoto !== null) return;

    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % galleryDatasets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, lightboxPhoto]);

  // Background preload next gallery photos
  useEffect(() => {
    const nextIndex = (galleryIndex + 1) % galleryDatasets.length;
    const nextGallery = galleryDatasets[nextIndex];
    [nextGallery.hero, ...nextGallery.items].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [galleryIndex]);

  // Keyboard controls for Lightbox (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxPhoto === null) return;
      const currentIdx = allPhotos.indexOf(lightboxPhoto);
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (e.key === 'ArrowLeft') {
        const prevIdx = currentIdx === 0 ? allPhotos.length - 1 : currentIdx - 1;
        setLightboxPhoto(allPhotos[prevIdx]);
      }
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIdx + 1) % allPhotos.length;
        setLightboxPhoto(allPhotos[nextIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto]);

  const currentGallery = galleryDatasets[galleryIndex];

  return (
    <section 
      className="w-full bg-[#0A0A0A] pt-[80px] pb-[70px] sm:pt-[100px] sm:pb-[85px] lg:pt-[120px] lg:pb-[100px] text-white overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        
        {/* EDITORIAL PREMIUM CENTER-ALIGNED HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3 sm:space-y-4 max-w-[900px] mx-auto"
        >
          {/* Small Label Top */}
          <span 
            className="block text-[14px] font-bold text-[#F97316] uppercase text-center"
            style={{ letterSpacing: '8px' }}
          >
            HIGHLIGHTS
          </span>

          {/* Main Heading */}
          <h2 
            className="text-[42px] sm:text-[56px] lg:text-[72px] font-semibold text-white tracking-tight text-center"
            style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
              lineHeight: 1.05,
              letterSpacing: '-1px',
              fontWeight: 600,
            }}
          >
            Moments That Matter
          </h2>
        </motion.div>

        {/* ASYMMETRIC FULL-WIDTH COLLAGE CONTAINER */}
        <div className="w-full min-h-[620px] sm:min-h-[720px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGallery.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-[18px]"
            >
              {/* TOP: LARGE HERO IMAGE */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1.00 }}
                exit={{ opacity: 0, scale: 1.00 }}
                transition={{ duration: 0.8, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightboxPhoto(currentGallery.hero)}
                className="group relative w-full h-[320px] sm:h-[440px] lg:h-[500px] rounded-[24px] overflow-hidden bg-slate-950 cursor-pointer shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                <img
                  src={currentGallery.hero}
                  alt="Tech Conference Event"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              </motion.div>

              {/* BOTTOM: 3 SMALLER IMAGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {currentGallery.items.map((src, bIdx) => (
                  <motion.div
                    key={`${currentGallery.id}-${bIdx}`}
                    initial={{ opacity: 0, scale: 1.03, y: 20 }}
                    animate={{ opacity: 1, scale: 1.00, y: 0 }}
                    exit={{ opacity: 0, scale: 1.00 }}
                    transition={{ duration: 0.8, delay: (bIdx + 1) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setLightboxPhoto(src)}
                    className="group relative w-full h-[240px] sm:h-[270px] lg:h-[290px] rounded-[24px] overflow-hidden bg-slate-950 cursor-pointer shadow-md hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300"
                  >
                    <img
                      src={src}
                      alt="Event Highlight"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxPhoto !== null && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition font-bold border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Button */}
            <button
              onClick={() => {
                const currentIdx = allPhotos.indexOf(lightboxPhoto);
                const prevIdx = currentIdx === 0 ? allPhotos.length - 1 : currentIdx - 1;
                setLightboxPhoto(allPhotos[prevIdx]);
              }}
              className="absolute left-6 z-50 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition font-bold border border-white/20"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Right Button */}
            <button
              onClick={() => {
                const currentIdx = allPhotos.indexOf(lightboxPhoto);
                const nextIdx = (currentIdx + 1) % allPhotos.length;
                setLightboxPhoto(allPhotos[nextIdx]);
              }}
              className="absolute right-6 z-50 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition font-bold border border-white/20"
              aria-label="Next Image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Fullscreen Photo */}
            <motion.div
              key={lightboxPhoto}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-6xl max-h-[85vh] rounded-[22px] overflow-hidden bg-black shadow-2xl border border-white/10"
            >
              <img
                src={lightboxPhoto}
                alt="Event Lightbox"
                className="w-full h-full max-h-[85vh] object-contain"
              />
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
