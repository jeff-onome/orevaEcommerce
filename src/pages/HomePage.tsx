import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import PromotionSlider from '../components/PromotionSlider';
import SocialPostCard from '../components/SocialPostCard';
import SalesBanner from '../components/SalesBanner';
import Spinner from '../components/Spinner';

// Icons for TrustBadges
const SecurePaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const MoneyBackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ShippingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" />
    </svg>
);

const mockSocialPosts = [
    { id: 1, platform: 'instagram' as const, imageUrl: 'https://picsum.photos/seed/social1/500/500', caption: 'Loving the crystal clear sound from my new Acoustic Bliss Headphones! #audiophile #music', productId: 2 },
    { id: 2, platform: 'tiktok' as const, imageUrl: 'https://picsum.photos/seed/social2/500/500', caption: 'Unboxing the Quantum Laptop Pro. This thing is a beast! #techtok #unboxing', productId: 1 },
    { id: 3, platform: 'instagram' as const, imageUrl: 'https://picsum.photos/seed/social3/500/500', caption: 'My new weekend adventure buddy. This Leather Weekend Bag is a game-changer. #travel #style', productId: 11 },
    { id: 4, platform: 'instagram' as const, imageUrl: 'https://picsum.photos/seed/social4/500/500', caption: 'Hitting my fitness goals with the Pro-Grip Dumbbell Set. #homegym #workout', productId: 9 },
];

const HomePage: React.FC = () => {
  const { products, promotions, categories, siteContent, dataLoading } = useAppContext();
  const sliderProducts = products.slice(0, 5);
  const activePromotions = promotions.filter(p => p.is_active);

  // For category highlights - Now dynamic from the admin panel
  const highlightedCategories = categories.filter(c => c.is_highlighted).slice(0, 4);

  return (
    <>
      <div className="space-y-16">
        {activePromotions.length > 0 && (
          <section>
            <PromotionSlider promotions={activePromotions} />
          </section>
        )}

        <section className="animate-fade-in">
          <ImageSlider slides={sliderProducts} />
        </section>

        {/* Featured Categories Section */}
        {highlightedCategories.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {highlightedCategories.map(category => (
                <Link
                  key={category.id}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="block group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    src={category.image_url || `https://picsum.photos/seed/${category.name}/600/400`}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured Products</h2>
          {dataLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 pt-16">
              {products.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Trust & Security Badges Section */}
        <section className="bg-background py-10 rounded-lg">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <SecurePaymentIcon />
                    <h4 className="text-lg font-semibold mt-2">Safe & Secure Checkout</h4>
                    <p className="text-gray-600 text-sm">SSL encrypted payments.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <MoneyBackIcon />
                    <h4 className="text-lg font-semibold mt-2">Money-Back Guarantee</h4>
                    <p className="text-gray-600 text-sm">Not satisfied? Get a full refund.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <ShippingIcon />
                    <h4 className="text-lg font-semibold mt-2">Fast Nationwide Shipping</h4>
                    <p className="text-gray-600 text-sm">Delivered to your doorstep.</p>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-6 mt-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paystack_logo.png" alt="Paystack" className="h-8 object-contain" loading="lazy" decoding="async" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 object-contain" loading="lazy" decoding="async" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 object-contain" loading="lazy" decoding="async" />
            </div>
        </section>

        {siteContent?.sales_banner_is_active && (
          <section>
            <SalesBanner
              title={siteContent.sales_banner_title || ''}
              subtitle={siteContent.sales_banner_subtitle || ''}
              endDate={siteContent.sales_banner_end_date || ''}
            />
          </section>
        )}

        {/* Social Media Feed Section */}
        <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop Our Feed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockSocialPosts.map(post => (
                    <SocialPostCard key={post.id} post={post} />
                ))}
            </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
