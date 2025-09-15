import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { OrderItem } from '../../types';
import Button from '../Button';

const StarRating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    aria-label={`Rate ${star} stars`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const RatingsAndReviews: React.FC = () => {
    const { session, orders, reviews, products, addReview } = useAppContext();
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    if (!session?.user) return null;

    const userPurchasedItems = orders
        .filter(o => o.user_id === session?.user.id && o.status === 'Delivered')
        .flatMap(o => o.order_items)
        // FIX: Filter out items where the product might have been deleted
        .filter(item => item.products)
        .filter((item, index, self) => index === self.findIndex(t => t.product_id === item.product_id)); // Unique items by product_id

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !session.user || rating === 0 || !reviewText.trim()) {
            alert("Please select a rating and write a review.");
            return;
        }

        addReview({
            product_id: selectedItem.product_id,
            rating,
            review_text: reviewText,
            user_id: session.user.id,
        });
        
        // Reset form
        setSelectedItem(null);
        setRating(0);
        setReviewText('');
    };
    
    const userReviews = reviews.filter(r => r.user_id === session?.user.id);

    return (
        <div className="animate-slide-in-up">
            <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Write a Review for a Recent Purchase</h3>
                    {userPurchasedItems.length === 0 ? (
                        <p className="text-gray-500">You have no delivered items to review yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {userPurchasedItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`p-2 border rounded-md text-center hover:shadow-md ${selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''}`}
                                >
                                    {/* FIX: Provide a fallback alt text for accessibility. */}
                                    <img src={item.products?.image_url || ''} alt={item.products?.name || 'Product Image'} className="w-full h-20 object-cover rounded-sm mb-2" loading="lazy" decoding="async" />
                                    <span className="text-xs font-medium">{item.products?.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedItem && (
                    <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg animate-fade-in">
                        <h4 className="font-semibold mb-4">Your review for: {selectedItem.products?.name}</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium mb-2">Rating</label>
                                <StarRating rating={rating} setRating={setRating} />
                            </div>
                            <div>
                                <label htmlFor="reviewText" className="block font-medium mb-2">Review</label>
                                <textarea
                                    id="reviewText"
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="What did you like or dislike?"
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit">Submit Review</Button>
                        </div>
                    </form>
                )}

                <div>
                    <h3 className="text-lg font-semibold mb-4 mt-8 border-t pt-6">Your Past Reviews</h3>
                    {userReviews.length === 0 ? (
                        <p className="text-gray-500">You haven't written any reviews yet.</p>
                    ) : (
                       <div className="space-y-4">
                           {userReviews.map(review => {
                               const product = products.find(p => p.id === review.product_id);
                               return (
                                   <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                       <h5 className="font-bold">{product?.name || 'Product not found'}</h5>
                                       <div className="flex text-yellow-400 my-1">
                                           {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                       </div>
                                       <p className="text-gray-600 italic">"{review.review_text}"</p>
                                       <p className="text-xs text-gray-400 mt-2">Reviewed on: {new Date(review.created_at!).toLocaleDateString()}</p>
                                   </div>
                               )
                           })}
                       </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RatingsAndReviews;