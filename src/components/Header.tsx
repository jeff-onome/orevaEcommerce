
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../supabaseClient';

const CartIcon = () => {
  const { cart } = useAppContext();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemCount;
  }, [cartItemCount]);


  return (
    <div className={`relative ${isAnimating ? 'animate-pop' : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </div>
  );
};

const WishlistIcon = () => {
  const { wishlist } = useAppContext();
  const wishlistCount = wishlist.length;

  return (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
      {wishlistCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {wishlistCount}
        </span>
      )}
    </div>
  );
};

const UserMenu: React.FC<{onLogout: () => void}> = ({onLogout}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-50 animate-fade-in">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>My Profile</Link>
                    <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                 </div>
            )}
        </div>
    )
}

const MobileMenu: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { session, profile, siteContent } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out:', error);
          alert('There was an issue signing out. Please try again.');
        }
        navigate('/login');
        onClose();
    };

    const navLinkClass = "text-2xl font-semibold text-gray-700 hover:text-primary transition-colors";

    const handleLinkClick = (path: string) => {
        navigate(path);
        onClose();
    }
    
    const isAuthenticated = !!session;
    const isAdmin = profile?.is_admin === true;

    return (
        <div className="fixed inset-0 bg-surface z-50 animate-fade-in md:hidden">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                 <span className="text-xl sm:text-2xl font-bold text-primary">{siteContent?.site_name || 'E-Shop Pro'}</span>
                 <button onClick={onClose} className="text-gray-600 hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-6">
                <button onClick={() => handleLinkClick('/')} className={navLinkClass}>Home</button>
                <button onClick={() => handleLinkClick('/shop')} className={navLinkClass}>Shop</button>
                <button onClick={() => handleLinkClick('/about')} className={navLinkClass}>About</button>
                <button onClick={() => handleLinkClick('/services')} className={navLinkClass}>Services</button>
                <button onClick={() => handleLinkClick('/contact')} className={navLinkClass}>Contact</button>
                
                <div className="border-t w-1/2 my-4"></div>

                {isAuthenticated ? (
                    <>
                        {isAdmin && <button onClick={() => handleLinkClick('/admin')} className={navLinkClass}>Admin</button>}
                        <button onClick={() => handleLinkClick('/profile')} className={navLinkClass}>My Profile</button>
                        <button onClick={handleLogout} className="text-2xl font-semibold text-accent hover:text-red-700 transition-colors">Logout</button>
                    </>
                ) : (
                    <button onClick={() => handleLinkClick('/login')} className="bg-primary text-white px-8 py-3 rounded-md text-xl hover:bg-indigo-900 transition-colors">Login</button>
                )}
            </nav>
        </div>
    )
}

const Header: React.FC = () => {
  const { siteContent, session, profile } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      alert('There was an issue signing out. Please try again.');
    }
    navigate('/login');
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`;
    
  const isAuthenticated = !!session;
  const isAdmin = profile?.is_admin === true;

  return (
    <>
      <header className="bg-surface shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/" className="text-xl sm:text-2xl font-bold text-primary">
            {siteContent?.site_name || 'E-Shop Pro'}
          </NavLink>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            
            {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
            
            <NavLink to="/wishlist" className={navLinkClass}>
              <WishlistIcon />
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <CartIcon />
            </NavLink>
            
            {isAuthenticated ? (
               isAdmin ? (
                  <button onClick={handleLogout} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">Logout</button>
               ) : (
                  <UserMenu onLogout={handleLogout}/>
               )
            ) : (
              <NavLink to="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-900 transition-colors">Login</NavLink>
            )}
          </nav>
          <div className="md:hidden flex items-center space-x-4">
               <NavLink to="/wishlist" className="text-gray-600 hover:text-primary transition-colors"><WishlistIcon /></NavLink>
               <NavLink to="/cart" className="text-gray-600 hover:text-primary transition-colors"><CartIcon /></NavLink>
               <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 hover:text-primary focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
               </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
    </>
  );
};

export default Header;