import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GoldDivider = ({ width = '40px', style = {}, delay = 0 }) => {
  const lineRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(lineRef.current, { scaleX: 1 });
      return;
    }

    const line = lineRef.current;

    gsap.set(line, { scaleX: 0, transformOrigin: 'center' });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: line,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(line, {
            scaleX: 1,
            duration: 0.8,
            delay,
            ease: 'power3.out'
          });
        }
      });
    }, line);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
      <div
        ref={lineRef}
        className="gold-divider"
        style={{
          height: '1px',
          width: width,
          backgroundColor: 'var(--color-gold)',
          margin: 0,
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default GoldDivider;