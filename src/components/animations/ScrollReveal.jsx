import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ children, delay = 0, y = 40, duration = 0.8, className = '' }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Respect user's reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set(elementRef.current, { opacity: 1, y: 0 });
      return;
    }

    const el = elementRef.current;
    
    gsap.set(el, { opacity: 0, y });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, duration]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: 'opacity, transform' }}>
      {children}
    </div>
  );
};

export default ScrollReveal;
