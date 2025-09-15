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
  
  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
  const tax = subtotal * 0.075; // 7.5% VAT, assuming this was the rate at purchase
  const shipping = order.total - subtotal - tax;

  const getItemStatusClass = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Processing':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-500 mb-4">Order #{order.id.toString().slice(-6)} &bull; Placed on {new Date(order.created_at!).toLocaleDateString()}</p>
      
      <div className="my-8">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700">Shipping Address</h3>
              <address className="text-gray-600 not-italic mt-1">
                {order.profiles?.name}<br />
                {order.shipping_address_line1}<br />
                {order.shipping_address_city}, {order.shipping_address_zip}<br />
                {order.shipping_address_country}
              </address>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Payment Method</h3>
              <p className="text-gray-600 capitalize mt-1">{order.payment_method?.replace('_', ' ')}</p>
            </div>
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Items in this order</h2>
        <div className="space-y-4 border rounded-lg">
          {order.order_items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border-b last:border-b-0">
              <img src={item.products?.image_url || ''} alt={item.products?.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" decoding="async" />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.products?.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                  <p className="font-medium">₦{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getItemStatusClass(item.status)}`}>
                      {item.status}
                  </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OrderDetailsPage;