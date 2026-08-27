import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { products as allProducts } from '../data/products';
import ScrollReveal from '../components/animations/ScrollReveal';
import GoldDivider from '../components/animations/GoldDivider';
import './Collection.css'; // Import the same CSS for mobile filters

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(12);
  
  const categories = ['All', 'Bangles', 'Bracelets', 'Earrings', 'Necklaces', 'Rings'];
  
  // Only get products marked as new arrival
  const newArrivals = allProducts.filter(p => p.isNewArrival);

  useEffect(() => {
    let filtered = [...newArrivals];

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort
    switch (sortOption) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Featured':
        filtered.sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1);
        break;
      default: // 'Newest' doesn't need sorting since they are all new arrivals
        break;
    }

    setProducts(filtered);
    setVisibleCount(12);
  }, [searchQuery, activeCategory, sortOption]);

  return (
    <div style={{ paddingTop: '120px', minHeight: '80vh' }} className="container section">
      <ScrollReveal>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h5 style={{ color: 'var(--color-gold)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Latest Masterpieces
          </h5>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-navy)' }}>
            New Arrivals
          </h1>
          <GoldDivider />
          <p style={{ color: 'var(--color-navy-light)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Discover our latest exquisitely crafted additions, available for a limited time at special introductory prices.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter and Search Bar */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        padding: '1.5rem 0',
        borderTop: '1px solid rgba(217, 164, 65, 0.3)',
        borderBottom: '1px solid rgba(217, 164, 65, 0.3)',
        marginBottom: '3rem',
        gap: '1rem'
      }}>
        
        {/* Desktop Layout: Search + Categories + Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search new arrivals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 2.8rem', 
                borderRadius: '8px', 
                border: '1px solid #e0e0e0',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                backgroundColor: '#f9f9f9',
                color: 'var(--color-navy)'
              }} 
            />
          </div>

          <div className="desktop-filters">
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: '2', justifyContent: 'center' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-navy)' : 'rgba(217, 164, 65, 0.5)',
                    backgroundColor: activeCategory === cat ? 'var(--color-navy)' : 'transparent',
                    color: activeCategory === cat ? 'var(--color-ivory)' : 'var(--color-navy)',
                    transition: 'all 0.2s',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ minWidth: '200px' }}>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '2px',
                  border: '1px solid rgba(217, 164, 65, 0.5)',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--color-navy)',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                <option value="Newest">Newest</option>
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button 
          className="mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={18} /> Filter & Sort
        </button>
      </div>

      {/* Mobile Modal */}
      <div className={`mobile-modal-overlay ${isMobileFilterOpen ? 'open' : ''}`}>
        <div className="mobile-modal-content">
          <div className="modal-header">
            <h3>Filter & Sort</h3>
            <button className="modal-close" onClick={() => setIsMobileFilterOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="filter-section-title">CATEGORY</div>
          <div className="mobile-categories">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--color-navy)' : '#e0e0e0',
                  backgroundColor: activeCategory === cat ? 'var(--color-navy)' : 'transparent',
                  color: activeCategory === cat ? 'var(--color-ivory)' : 'var(--color-navy)',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-section-title">SORT BY</div>
          <div className="mobile-sort-options">
            {['Newest', 'Featured', 'Price: Low to High', 'Price: High to Low'].map(option => (
              <div 
                key={option}
                className={`sort-option ${sortOption === option ? 'active' : ''}`}
                onClick={() => setSortOption(option)}
              >
                {option}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="show-products-btn" onClick={() => setIsMobileFilterOpen(false)}>
              Show {products.length} Products
            </button>
          </div>
        </div>
      </div>

      <ScrollReveal delay={0.2}>
        <div style={{ marginBottom: '2rem', color: 'var(--color-navy-light)', fontSize: '0.95rem' }}>
          Showing <strong>{Math.min(visibleCount, products.length)}</strong> of <strong>{products.length}</strong> new arrivals
        </div>

        {products.length > 0 ? (
          <>
            <ProductGrid products={products.slice(0, visibleCount)} columns={4} />
            {visibleCount < products.length && (
              <div className="text-center" style={{ marginTop: '3.5rem' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                >
                  View More Collection
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>No new arrivals found matching your criteria.</p>
            <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

export default NewArrivals;
