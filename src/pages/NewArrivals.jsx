import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { products as allProducts } from '../data/products';
import ScrollReveal from '../components/animations/ScrollReveal';
import GoldDivider from '../components/animations/GoldDivider';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  
  // Only get products marked as new arrival
  const newArrivals = allProducts.filter(p => p.isNewArrival);

  useEffect(() => {
    let filtered = [...newArrivals];

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
  }, [searchQuery, sortOption]);

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
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 0',
        borderTop: '1px solid rgba(217, 164, 65, 0.3)',
        borderBottom: '1px solid rgba(217, 164, 65, 0.3)',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '350px' }}>
          <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search new arrivals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 2.8rem', 
              borderRadius: '2px', 
              border: '1px solid rgba(217, 164, 65, 0.5)',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              color: 'var(--color-navy)'
            }} 
          />
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

      <ScrollReveal delay={0.2}>
        <div style={{ marginBottom: '2rem', color: 'var(--color-navy-light)', fontSize: '0.95rem' }}>
          Showing <strong>{products.length}</strong> new arrivals
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>No new arrivals found matching your search.</p>
            <button className="btn btn-primary" onClick={() => { setSearchQuery(''); }}>
              Clear Search
            </button>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

export default NewArrivals;
