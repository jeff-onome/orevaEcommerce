import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { CartItem } from '../types';

const CheckoutPage: React.FC = () => {
  const { cart, profile, session, placeOrder } = useAppContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: profile?.name || '',
    email: session?.user.email || '',
    address: '',
    city: '',
    zip: '',
    country: profile?.country || 'Nigeria',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails(prev => ({...prev, [e.target.name]: e.target.value}));
  }
  
  const getItemPrice = (item: CartItem) => {
    return (item.sale_price && item.sale_price < item.price) ? item.sale_price : item.price;
  };

  const subtotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const tax = subtotal * 0.075; // 7.5% VAT
  const shipping = 5000.00;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!profile) {
        alert("Authentication error. Please log in again.");
        navigate('/login');
        return;
    }

    setIsProcessing(true);
    
    const newOrder = await placeOrder(cart, total, shippingDetails, paymentMethod);

    setIsProcessing(false);
    if (newOrder) {
        setShowConfirmation(true);
    } else {
        alert("There was an error placing your order. Please try again.");
    }
  };

  const closeAndNavigateHome = () => {
    setShowConfirmation(false);
    navigate('/orders');
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
        <div className="bg-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          <form className="space-y-4">
            <input name="name" type="text" placeholder="Full Name" className="w-full p-3 border rounded-md" value={shippingDetails.name} onChange={handleShippingChange} required />
            <input name="email" type="email" placeholder="Email Address" className="w-full p-3 border rounded-md" value={shippingDetails.email} disabled />
            <input name="address" type="text" placeholder="Address" className="w-full p-3 border rounded-md" value={shippingDetails.address} onChange={handleShippingChange} required />
            <div className="flex space-x-4">
              <input name="city" type="text" placeholder="City" className="w-full p-3 border rounded-md" value={shippingDetails.city} onChange={handleShippingChange} required />
              <input name="zip" type="text" placeholder="ZIP Code" className="w-full p-3 border rounded-md" value={shippingDetails.zip} onChange={handleShippingChange} required />
            </div>
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-6">Payment Method</h2>
          <div className="space-y-4">
            <label className={`flex items-center p-4 border rounded-md cursor-pointer ${paymentMethod === 'paystack' ? 'border-primary ring-2 ring-primary' : ''}`}>
              <input type="radio" name="payment" value="paystack" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} className="mr-4" />
              Pay with Paystack (Simulated)
            </label>
            <label className={`flex items-center p-4 border rounded-md cursor-pointer ${paymentMethod === 'delivery' ? 'border-primary ring-2 ring-primary' : ''}`}>
              <input type="radio" name="payment" value="delivery" checked={paymentMethod === 'delivery'} onChange={() => setPaymentMethod('delivery')} className="mr-4" />
              Pay on Delivery
            </label>
          </div>
        </div>
        
        <div className="bg-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span>{item.name} x {item.quantity}</span>
                <span>₦{(getItemPrice(item) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t my-6"></div>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Tax (7.5%)</span><span>₦{tax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₦{shipping.toLocaleString()}</span></div>
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-bold text-xl"><p>Total</p><p>₦{total.toLocaleString()}</p></div>
          </div>
          <Button onClick={handlePlaceOrder} isLoading={isProcessing} className="w-full mt-8">
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>

      <Modal isOpen={showConfirmation} onClose={closeAndNavigateHome}>
        <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h3>
            <p className="text-gray-600">Thank you for your purchase. You can track your order in the 'My Orders' section.</p>
            <Button onClick={closeAndNavigateHome} className="mt-6">View My Orders</Button>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutPage;