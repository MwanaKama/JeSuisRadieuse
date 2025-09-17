// src/hooks/useScrollTo.ts
import { useRef, useCallback } from 'react';

export const useScrollTo = () => {
  const refs = useRef<{[key: string]: React.RefObject<HTMLElement>}>({});

  const registerRef = useCallback((key: string) => {
    if (!refs.current[key]) {
      refs.current[key] = React.createRef();
    }
    return refs.current[key];
  }, []);

  const scrollTo = useCallback((key: string, offset = 100) => {
    const ref = refs.current[key];
    if (ref?.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const isMobile = window.innerWidth < 768;
      const adjustedOffset = isMobile ? offset + 20 : offset;
      
      window.scrollTo({
        top: elementPosition - adjustedOffset,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    });
  }, []);

  return { registerRef, scrollTo, scrollToTop };
};

export const useScrollTrigger = (triggerHeight = 300) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > triggerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerHeight]);

  return visible;
};