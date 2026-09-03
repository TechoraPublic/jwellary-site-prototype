import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import { productService } from '../../services/product.service';
import { normalizeProduct } from '../../utils/productMapper';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, wishlistItems } = useContext(ShopContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(productId);
        if (response.success) {
          const fetchedProduct = normalizeProduct(response.data);
          setProduct(fetchedProduct);
          if (fetchedProduct) {
            setSelectedImage(fetchedProduct.images?.[0] || fetchedProduct.image);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    let interval;
    if (product && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setSelectedImage(prev => {
          const currentIndex = product.images.indexOf(prev);
          const nextIndex = (currentIndex + 1) % product.images.length;
          return product.images[nextIndex];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [product]);

  if (!product) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '2rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }} className="container">
      <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>

        {/* Product Image & Gallery */}
        <div className="product-image-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="product-image-large">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="product-thumbnails" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid var(--color-gold)' : '2px solid transparent',
                    opacity: selectedImage === img ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-details-content">
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-gold)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {product.category}
          </p>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              ₹{product.price?.toLocaleString()}
            </p>
          </div>

          <div style={{ marginBottom: '3rem', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>DESCRIPTION:</h4>
            <p style={{ marginBottom: '1rem' }}>{product.description}</p>
            <p style={{ marginBottom: '1.5rem' }}></p>

            <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>STYLING TIP:</h4>
            <p style={{ marginBottom: '1.5rem' }}>Pair with sparkling studs to create a coordinated festive look.</p>

            <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>MATERIAL:</h4>
            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '1.5rem', color: 'var(--color-gray-dark)' }}>
              <li>Base Metal: Stainless Steel</li>
              <li>Plating: 18 kt Gold Tone</li>
              <li>Type of Stone: Cubic Zirconia</li>
            </ul>

            <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>DETAILS & DIMENSIONS:</h4>
            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '1.5rem', color: 'var(--color-gray-dark)' }}>
              <li>Closure: Secure Clasp</li>
              <li>Weight: 5 gm</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => addToCart(product)}
            >
              Add to Bag
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
            >
              <Heart size={24} fill={wishlistItems.some(item => item.id === product.id) ? 'red' : 'none'} color={wishlistItems.some(item => item.id === product.id) ? 'red' : 'currentColor'} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
