
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const WishlistPage: React.FC = () => {
  const { state } = useAppContext();
  const { wishlist, products } = state;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-lg shadow-md animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't saved any items yet. Add products you love to your wishlist to see them here.</p>
        <Link to="/shop">
          <Button variant="primary">Discover Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-10">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 pt-16">
        {wishlistProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
