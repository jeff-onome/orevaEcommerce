
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TrackOrder from '../components/UserProfile/TrackOrder';
import RatingsAndReviews from '../components/UserProfile/RatingsAndReviews';
import HelpAndSupport from '../components/UserProfile/HelpAndSupport';
import AccountDetails from '../components/UserProfile/AccountDetails';
import Button from '../components/Button';
import { CartItem } from '../types';
import Modal from '../components/Modal';

type ProfileTab = 'Track Order' | 'Ratings & Reviews' | 'Help & Support' | 'My Profile' | 'My Cart';

const UserCart: React.FC = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppContext();
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

    const handleQuantityChange = (id: number, quantity: number) => {
        updateCartQuantity(id, Math.max(0, quantity));
    };

    const handleRemove = (id: number) => {
        removeFromCart(id);
    };
    
    const handleConfirmClearCart = () => {
        clearCart();
        setIsClearCartModalOpen(false);
    };

    const getItemPrice = (item: CartItem) => {
        return (item.sale_price && item.sale_price < item.price) ? item.sale_price : item.price;
    };

    const subtotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in min-h-[50vh]">
                {/* UX Improvement: Add an icon to the empty state */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-slide-in-up">
             <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
            <div className="space-y-6">
              {cart.map(item => {
                const displayPrice = getItemPrice(item);
                const isSale = item.sale_price && item.sale_price < item.price;
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between animate-slide-in-up py-4 border-b last:border-0">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <img src={item.image_url || ''} alt={item.name} className="w-20 h-20 object-cover rounded-md" loading="lazy" decoding="async" />
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-baseline space-x-2">
                          <p className={`text-gray-500 ${isSale ? 'text-accent font-semibold' : ''}`}>₦{displayPrice.toLocaleString()}</p>
                          {isSale && <p className="text-sm text-gray-400 line-through">₦{item.price.toLocaleString()}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end space-x-4">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                        <span className="px-4">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                      </div>
                      <p className="font-semibold w-24 text-right">₦{(displayPrice * item.quantity).toLocaleString()}</p>
                      <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-12 text-right">
              <p className="text-2xl font-bold">Subtotal: <span className="text-primary">₦{subtotal.toLocaleString()}</span></p>
              <p className="text-gray-500 mt-2">Taxes and shipping calculated at checkout.</p>
              <div className="flex justify-end items-center gap-4 mt-6">
                <Button variant="danger" onClick={() => setIsClearCartModalOpen(true)}>
                    Clear Cart
                </Button>
                <Link to="/checkout">
                  <Button>Proceed to Checkout</Button>
                </Link>
              </div>
            </div>

            <Modal isOpen={isClearCartModalOpen} onClose={() => setIsClearCartModalOpen(false)}>
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Confirm Action</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to remove all items from your cart?</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setIsClearCartModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmClearCart}>
                            Clear Cart
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const UserProfilePage: React.FC = () => {
    const { profile } = useAppContext();
    const [activeTab, setActiveTab] = useState<ProfileTab>('My Profile');

    if (!profile) return null;

    const renderContent = () => {
        switch(activeTab) {
            case 'Track Order': return <TrackOrder />;
            case 'Ratings & Reviews': return <RatingsAndReviews />;
            case 'Help & Support': return <HelpAndSupport />;
            case 'My Cart': return <UserCart />;
            case 'My Profile': return <AccountDetails />;
            default: return null; // My Orders is a link
        }
    }

    const SidebarLink: React.FC<{tabName: string, isExternal?: boolean, to?: string}> = ({ tabName, isExternal, to }) => {
        const baseClasses = "block w-full text-left px-4 py-3 rounded-md font-medium transition-colors duration-200";
        const activeClasses = "bg-primary text-white";
        const inactiveClasses = "hover:bg-gray-200";

        if (isExternal && to) {
            return (
                <Link to={to} className={`${baseClasses} ${inactiveClasses}`}>
                    {tabName}
                </Link>
            )
        }

        return (
            <button
                onClick={() => setActiveTab(tabName as ProfileTab)}
                className={`${baseClasses} ${activeTab === tabName ? activeClasses : inactiveClasses}`}
            >
                {tabName}
            </button>
        )
    };

    return (
        <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
            <div className="text-center mb-10 border-b pb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold">Welcome, {profile.name}</h1>
                <p className="text-gray-500 mt-2">Manage your orders, details, and more from your personal dashboard.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                <aside className="md:w-1/4">
                    <nav className="space-y-2">
                        <SidebarLink tabName="My Orders" isExternal to="/orders" />
                        <SidebarLink tabName="Track Order" />
                        <SidebarLink tabName="Ratings & Reviews" />
                        <SidebarLink tabName="Help & Support" />
                        <SidebarLink tabName="My Cart" />
                        <SidebarLink tabName="My Profile" />
                    </nav>
                </aside>
                <main className="flex-1">
                    {activeTab !== 'My Profile' && (
                        <button
                            onClick={() => setActiveTab('My Profile')}
                            className="flex items-center text-gray-600 hover:text-primary font-semibold mb-6 transition-colors duration-200"
                            aria-label="Back to Profile"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Profile
                        </button>
                    )}
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export default UserProfilePage;
