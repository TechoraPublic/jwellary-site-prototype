import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const PageLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsAnimating(false);
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      });

      // Initial state
      gsap.set(logoRef.current, { opacity: 0, scale: 0.96 });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(textRef.current, { opacity: 0, y: 10 });

      // Animation sequence (total ~1.5s)
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      })
      .to(lineRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power3.out'
      }, '-=0.2')
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--color-navy)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--color-ivory)'
      }}
    >
      <img 
        ref={logoRef}
        src="/images/Other/blue-bell-jewellery-logo.png" 
        alt="Blue Bell Jewellery" 
        style={{ height: '80px', marginBottom: '2rem', willChange: 'transform, opacity' }} 
      />
      <div 
        ref={lineRef}
        style={{
          width: '60px',
          height: '1px',
          backgroundColor: 'var(--color-gold)',
          marginBottom: '1rem',
          transformOrigin: 'center',
          willChange: 'transform'
        }}
      />
      <p 
        ref={textRef}
        style={{
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontSize: '0.85rem',
          color: 'var(--color-gold)',
          willChange: 'transform, opacity'
        }}
      >
        Jewellery
      </p>
    </div>
  );
};

export default PageLoader;
