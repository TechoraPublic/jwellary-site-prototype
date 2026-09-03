import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      const ctx = gsap.context(() => {
        // Parallax background
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          animation: gsap.to(bgRef.current, { y: '20%', ease: 'none' })
        });

        // Entrance animation (waits for PageLoader)
        const tl = gsap.timeline({ delay: 1.2 });
        
        gsap.set([title1Ref.current, title2Ref.current], { y: 40, opacity: 0 });
        gsap.set([subtitleRef.current, btnRef.current], { y: 20, opacity: 0 });

        tl.to(title1Ref.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
          .to(title2Ref.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .to(btnRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero-bg" ref={bgRef}>
        <video autoPlay loop muted playsInline>
          <source src="/video/9430537-uhd_4096_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content" style={{ animation: 'none' }}>
        <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ overflow: 'hidden' }}><span ref={title1Ref} style={{ display: 'block' }}>Elegance,</span></span>
          <span style={{ overflow: 'hidden' }}><span ref={title2Ref} style={{ display: 'block' }}>Crafted to Last</span></span>
        </h1>
        <div style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
          <p className="hero-subtitle" ref={subtitleRef} style={{ margin: 0 }}>
            Discover the new collection of meticulously crafted fine jewelry.
          </p>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div ref={btnRef}>
            <Link to="/collection/rings" className="btn btn-primary hero-btn">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
