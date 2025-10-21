import { type SectionType, SECTIONS_ARRAY } from "Interfaces/portfolio-sections";
import { useEffect } from "react";

interface UseScrollDetectionProps {
  sectionRefs: Record<SectionType, React.RefObject<HTMLElement| null>>;
  setActiveSection: (section: SectionType) => void;
}

export const useScrollDetection = ({ 
  sectionRefs, 
  setActiveSection 
}: UseScrollDetectionProps) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Encuentra la sección visible más cercana
      for (let i = SECTIONS_ARRAY.length - 1; i >= 0; i--) {
        const section = SECTIONS_ARRAY[i];
        const element = sectionRefs[section].current;
        
        if (element) {
          const offsetTop = element.offsetTop;
          
          if (scrollPosition >= offsetTop) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Throttle para mejor performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Detectar seccion inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [sectionRefs, setActiveSection]);
};