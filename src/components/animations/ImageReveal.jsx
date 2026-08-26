import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImageReveal = ({ src, alt, className = '', style = {}, delay = 0 }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(imageRef.current, { scale: 1 });
      return;
    }

    const container = containerRef.current;
    const img = imageRef.current;
    
    gsap.set(container, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(img, { scale: 1.08 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(container, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            delay,
            ease: 'power3.out'
          });
          
          gsap.to(img, {
            scale: 1,
            duration: 1.5,
            delay,
            ease: 'power3.out'
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div 
      ref={containerRef} 
      className={`image-reveal-container ${className}`} 
      style={{ overflow: 'hidden', width: '100%', height: '100%', ...style }}
    >
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }} 
      />
    </div>
  );
};

export default ImageReveal;
