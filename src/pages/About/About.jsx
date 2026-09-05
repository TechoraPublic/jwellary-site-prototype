import React, { useEffect } from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import ImageReveal from '../../components/animations/ImageReveal';
import GoldDivider from '../../components/animations/GoldDivider';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }}>

      {/* Header */}
      <ScrollReveal className="container text-center" style={{ marginBottom: '4rem' }} delay={0.2}>
        <p style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>Our Heritage</p>
        <h1 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>The Blue Bells Story</h1>
        <GoldDivider delay={0.4} />
        <p style={{ color: 'var(--color-navy-light)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
          A legacy of exceptional craftsmanship and visionary design.
        </p>
      </ScrollReveal>

      {/* Story Image */}
      <div style={{ width: '100%', marginBottom: '6rem' }}>
        <img
          src="/imagesss/our_story.png"
          alt="Our_story"
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
        />
      </div>

      {/* Content */}
      <div className="container responsive-split" style={{ alignItems: 'center', marginBottom: '6rem' }}>
        <ScrollReveal>
          <h2 style={{ marginBottom: '2rem', color: 'var(--color-navy)' }}>The Beginning</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Founded in 1995, Blue Bells emerged from a simple desire: to create jewelry that speaks to the soul. What began as a small atelier in the heart of the city has grown into a globally recognized symbol of luxury and elegance.
          </p>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Our founders believed that every piece of jewelry should tell a story, a philosophy that continues to guide our artisans today. We blend traditional techniques with modern innovation to craft timeless masterpieces.
          </p>
          <p style={{ lineHeight: '1.8' }}>
            Each collection is a testament to our dedication to perfection, celebrating life's most precious moments with unparalleled brilliance and sophistication. Our commitment to excellence remains the cornerstone of our brand.
          </p>
        </ScrollReveal>
        <div style={{ aspectRatio: '1/1' }}>
          <ImageReveal src="/imagesss/01_Golden bow necklace/01_IMG-20260827-WA0008.jpg" alt="Vintage sketch" delay={0.2} />
        </div>
      </div>

      {/* Commitment / Craftsmanship */}
      <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-ivory)', padding: '6rem 0' }}>
        <ScrollReveal className="container text-center">
          <h2 style={{ marginBottom: '2rem' }}>Craftsmanship & Sourcing</h2>
          <GoldDivider delay={0.2} style={{ marginBottom: '2rem' }} />
          <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'rgba(248, 245, 238, 0.8)', marginBottom: '1.5rem' }}>
            We are committed to responsible luxury. Every diamond and precious stone in our collection is conflict-free and ethically sourced. We believe that true beauty shouldn't come at a cost to the earth or its people. Our gold and platinum are 100% recycled, ensuring a sustainable future without compromising on quality.
          </p>
          <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'rgba(248, 245, 238, 0.8)' }}>
            By partnering with trusted suppliers who share our values, we guarantee transparency and traceability in every step of our supply chain. Our dedication extends beyond environmental stewardship to supporting the communities where our materials are sourced, fostering fair labor practices and empowering local artisans.
          </p>
        </ScrollReveal>
      </div>

    </div>
  );
};

export default About;
