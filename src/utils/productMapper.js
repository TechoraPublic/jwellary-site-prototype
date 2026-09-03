export const normalizeProduct = (backendProduct) => {
  if (!backendProduct) return null;

  // Extract the main image URL
  const mainImage = backendProduct.images && backendProduct.images.length > 0 
    ? backendProduct.images[0].url 
    : '';

  // Extract array of all image URLs
  const imageUrls = backendProduct.images 
    ? backendProduct.images.map(img => img.url) 
    : [];

  // Extract category name if it's populated
  const categoryName = typeof backendProduct.category === 'object' && backendProduct.category?.name
    ? backendProduct.category.name
    : backendProduct.category;

  return {
    ...backendProduct,
    id: backendProduct._id,
    image: mainImage,
    images: imageUrls,
    category: categoryName
  };
};

export const normalizeProducts = (backendProducts) => {
  if (!Array.isArray(backendProducts)) return [];
  return backendProducts.map(normalizeProduct).filter(Boolean);
};
