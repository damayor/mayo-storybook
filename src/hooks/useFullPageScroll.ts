// src/hooks/useFullPageScroll.ts
import { useEffect, useState } from 'react';

interface UseFullPageScrollProps {
  sections: string[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useFullPageScroll = ({ 
  sections, 
  activeSection, 
  setActiveSection 
}: UseFullPageScrollProps) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      
      // Evitar scroll muy rápido (100ms debounce)
      if (now - lastScrollTime < 800) return;
      
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.deltaY > 0) {
        if (currentIndex < sections.length - 1) {
          setActiveSection(sections[currentIndex + 1]);
          setLastScrollTime(now);
          e.preventDefault();
        }
      } else {
        if (currentIndex > 0) {
          setActiveSection(sections[currentIndex - 1]);
          setLastScrollTime(now);
          e.preventDefault();
        }
      }
    };

    // Touch scroll para mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 800) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const currentIndex = sections.indexOf(activeSection);

      if (diff > 50) {
        // Swipe UP - siguiente sección
        if (currentIndex < sections.length - 1) {
          setActiveSection(sections[currentIndex + 1]);
          setLastScrollTime(now);
        }
      } else if (diff < -50) {
        // Swipe DOWN - sección anterior
        if (currentIndex > 0) {
          setActiveSection(sections[currentIndex - 1]);
          setLastScrollTime(now);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lastScrollTime, activeSection, sections, setActiveSection]);
};