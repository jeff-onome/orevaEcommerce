
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import SocialShareButtons from '../components/SocialShareButtons';
import { Product } from '../types';
import StarRating from '../components/StarRating';

const StarInput: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-colors duration-150 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                    aria-label={`Rate ${star} stars`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, reviews, wishlist, session, orders, addReview, addToCart, toggleWishlist } = useAppContext();
  
  const product = products.find(p => p.id === Number(id));
  const productReviews = reviews.filter(r => r.product_id === product?.id).sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  const [canReview, setCanReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (session?.user && product) {
      const hasPurchased = orders.some(order =>
        order.user_id === session.user.id &&
        order.status === 'Delivered' &&
        order.order_items.some(item => item.product_id === product.id)
      );
      const hasNotReviewed = !reviews.some(review =>
        review.user_id === session.user.id &&
        review.product_id === product.id
      );
      setCanReview(hasPurchased && hasNotReviewed);
    } else {
      setCanReview(false);
    }
  }, [session, orders, reviews, product]);


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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      alert("Please select a star rating.");
      return;
    }
    setIsSubmittingReview(true);
    await addReview({
      product_id: product.id,
      rating: newRating,
      review_text: newReviewText,
    });
    setNewRating(0);
    setNewReviewText('');
    setIsSubmittingReview(false);
  };

  return (
    <>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-primary font-semibold transition-colors duration-200"
          aria-label="Go back to previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="animate-slide-in-up">
            <img src={product.image_url || ''} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <div className="mb-4">
              <a href="#reviews" className="inline-block">
                <StarRating rating={product.avg_rating || 0} reviewCount={product.review_count || 0} size="lg" />
              </a>
            </div>
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

      <div id="reviews" className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in mt-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-4">Customer Reviews</h2>
        {canReview && (
          <form onSubmit={handleReviewSubmit} className="bg-background p-6 rounded-lg mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Your Rating</label>
                <StarInput rating={newRating} setRating={setNewRating} />
              </div>
              <div>
                <label htmlFor="reviewText" className="block font-medium mb-2">Your Review</label>
                <textarea
                  id="reviewText"
                  value={newReviewText}
                  onChange={e => setNewReviewText(e.target.value)}
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder={`Share your thoughts on the ${product.name}...`}
                ></textarea>
              </div>
              <Button type="submit" isLoading={isSubmittingReview}>Submit Review</Button>
            </div>
          </form>
        )}
        
        {productReviews.length > 0 ? (
          <div className="space-y-6">
            {productReviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} />
                  <span className="ml-4 font-bold text-gray-800">{review.profiles?.name || 'Anonymous'}</span>
                </div>
                <p className="text-gray-600 italic">"{review.review_text}"</p>
                <p className="text-xs text-gray-400 mt-2">Reviewed on: {new Date(review.created_at!).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">This product has no reviews yet. Be the first to write one!</p>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;