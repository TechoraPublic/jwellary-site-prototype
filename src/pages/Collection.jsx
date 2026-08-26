import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { products as allProducts } from '../data/products';

const Collection = () => {
  const { categoryId } = useParams();
  
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryId || 'All');
  const [sortOption, setSortOption] = useState('Featured');
  
  const categories = ['All', 'Bangles', 'Bracelets', 'Earrings', 'Necklaces', 'Rings'];

  useEffect(() => {
    let filtered = [...allProducts];

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
      default:
        break;
    }

    setProducts(filtered);
  }, [searchQuery, activeCategory, sortOption, categoryId]);

  // Update active category if URL params change
  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
    } else {
      setActiveCategory('All');
    }
  }, [categoryId]);

  return (
    <div style={{ paddingTop: '120px', minHeight: '80vh' }} className="container section">
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          Shop All Products
        </h1>
        <p style={{ color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Discover our complete range of exquisite jewellery, crafted with precision and passion.
        </p>
      </div>

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
            placeholder="Search products..." 
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
            <option value="Featured">Featured</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Top Rated">Top Rated</option>
            <option value="Best Selling">Best Selling</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', color: 'var(--color-gray-dark)', fontSize: '0.95rem' }}>
        Showing <strong>{products.length}</strong> of <strong>{allProducts.length}</strong> products
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="text-center" style={{ padding: '4rem 0' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No products found matching your criteria.</p>
          <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Collection;
