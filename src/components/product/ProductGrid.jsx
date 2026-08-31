import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-${columns}`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
