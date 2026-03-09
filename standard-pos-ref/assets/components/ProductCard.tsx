import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${isOutOfStock ? 'opacity-50' : ''}`}>
      <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded" />
        ) : (
          <span>No Image</span>
        )}
      </div>
      
      <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-green-600">${product.price.toFixed(2)}</span>
        <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
          {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
        </span>
      </div>

      <button
        onClick={() => onAddToCart(product)}
        disabled={isOutOfStock}
        className={`w-full mt-4 py-2 px-4 rounded text-white font-medium transition-colors 
          ${isOutOfStock 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
      >
        Add to Cart
      </button>
    </div>
  );
};
