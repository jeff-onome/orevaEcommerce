import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import SocialShareButtons from '../components/SocialShareButtons';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, session, addToCart, toggleWishlist } = useAppContext();
  const product = products.find(p => p.id === Number(id));
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  const isSale = product.sale_price && product.sale_price < product.price;

  const handleAddToCart = () => {
    if (!session) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart(product);
  };
  
  const handleToggleWishlist = () => {
    if (!product) return;

    if (!session) {
        alert("Please log in to add items to your wishlist.");
        navigate('/login');
        return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-in-up">
          <img src={product.image_url || ''} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.categories?.join(', ')}</p>
          <p className="text-lg text-gray-700 mb-6">{product.description}</p>
          <div className="flex items-center justify-between mb-8">
            {isSale ? (
                <div className="flex items-baseline space-x-3">
                    <span className="text-3xl md:text-4xl font-bold text-accent">₦{product.sale_price!.toLocaleString()}</span>
                    <span className="text-xl md:text-2xl font-medium text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                </div>
            ) : (
                <span className="text-3xl md:text-4xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
            )}
            <span className="text-green-600 font-semibold">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-grow">
              Add to Cart
            </Button>
            <Button onClick={handleToggleWishlist} variant="secondary" className="px-4" aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </Button>
          </div>
          <div className="mt-8 pt-6 border-t">
              <SocialShareButtons product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;