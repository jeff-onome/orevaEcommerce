import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, session, addToCart, toggleWishlist } = useAppContext();
  const navigate = useNavigate();
  const isInWishlist = wishlist.includes(product.id);
  
  const isSale = product.sale_price && product.sale_price < product.price;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation when clicking button
    if (!session) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart(product);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
        alert("Please log in to add items to your wishlist.");
        navigate('/login');
        return;
    }
    toggleWishlist(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group animate-fade-in text-center h-full">
        <div className="relative bg-surface rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col pt-24 sm:pt-28 pb-6 px-6">
            <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-10 p-2 bg-white/70 rounded-full hover:bg-white transition-colors"
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
            </button>
            <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-52">
                <img 
                    className="w-full h-full object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300 aspect-[4/3]" 
                    src={product.image_url || ''} 
                    alt={product.name} 
                    loading="lazy"
                    decoding="async"
                />
            </div>
            
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-gray-500 mt-1">{product.categories?.join(', ')}</p>
                    <h3 className="text-lg font-semibold text-gray-800 truncate mt-2">{product.name}</h3>
                </div>
                <div className="mt-4">
                    {isSale ? (
                        <div className="flex items-baseline justify-center space-x-2 mb-4">
                            <p className="text-2xl font-bold text-accent">₦{product.sale_price!.toLocaleString()}</p>
                            <p className="text-lg font-medium text-gray-500 line-through">₦{product.price.toLocaleString()}</p>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold text-primary mb-4">₦{product.price.toLocaleString()}</p>
                    )}
                    <button 
                        onClick={handleAddToCart} 
                        className="bg-secondary text-primary font-bold py-2 px-6 rounded-full transform opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default ProductCard;