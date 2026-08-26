import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { getFeaturedProducts } from '../data/products';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/animations/ScrollReveal';
import ImageReveal from '../components/animations/ImageReveal';
import GoldDivider from '../components/animations/GoldDivider';

const Home = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      <Hero />

      {/* Featured Collection Section */}
      <section className="section container">
        <ScrollReveal className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Featured Collection</h2>
          <GoldDivider style={{ marginBottom: '2rem' }} />
          <p style={{ color: 'var(--color-navy-light)', maxWidth: '600px', margin: '0 auto' }}>
            Discover our most coveted pieces, designed to be cherished for a lifetime.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ProductGrid products={featuredProducts} columns={4} />
        </ScrollReveal>

        <ScrollReveal className="text-center" style={{ marginTop: '4rem' }} delay={0.4}>
          <Link to="/collection/rings" className="btn btn-primary">
            View All Collections
          </Link>
        </ScrollReveal>
      </section>

      {/* Brand Story Section */}
      <section style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-ivory)' }} className="section">
        <div className="container responsive-split" style={{ alignItems: 'center' }}>
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-gold)' }}>The Art of Fine Jewellery</h2>
            <p style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
              For over three decades, Aurora has been synonymous with unparalleled craftsmanship and timeless elegance. Every piece is meticulously crafted by master artisans using ethically sourced materials of the highest quality.
            </p>
            <Link to="/about" className="btn btn-outline" style={{ borderColor: 'var(--color-ivory)', color: 'var(--color-ivory)' }}>
              Discover Our Story
            </Link>
          </ScrollReveal>
          <div>
            <ImageReveal src="img/08-gold-delicate-band-ring/golden-solitaire-ring-free-size-1.jpg" alt="Craftsmanship" style={{ maxHeight: '500px' }} delay={0.2} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
