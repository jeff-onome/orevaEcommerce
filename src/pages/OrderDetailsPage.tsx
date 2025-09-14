import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import OrderStatusTracker from '../components/OrderStatusTracker';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useAppContext();
  const order = orders.find(o => o.id === Number(id));

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link to="/orders" className="text-primary hover:underline mt-4 inline-block">Back to My Orders</Link>
      </div>
    );
  }
  
  const subtotal = order.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
  const tax = subtotal * 0.075; // 7.5% VAT, assuming this was the rate at purchase
  const shipping = order.total - subtotal - tax;

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-500 mb-4">Order #{order.id.toString().slice(-6)} &bull; Placed on {new Date(order.created_at!).toLocaleDateString()}</p>
      
      <div className="my-8">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Items in this order</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center space-x-4">
                {item.products?.image_url ? (
                    <img src={item.products.image_url} alt={item.products.name} className="w-16 h-16 object-cover rounded-md" loading="lazy" decoding="async" />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <div>
                  <h3 className="font-semibold">{item.products?.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="ml-auto font-medium">₦{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₦{shipping > 0 ? shipping.toLocaleString() : '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₦{order.total.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
