import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const OrderHistoryPage: React.FC = () => {
  const { session, orders } = useAppContext();

  // Filter orders for the currently logged-in user
  const userOrders = orders.filter(order => order.user_id === session?.user.id);

  if (!session) {
    // This case is handled by the router, but as a fallback:
    return (
        <div className="text-center py-20 bg-surface rounded-lg shadow-md animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-8">You need to be logged in to view your order history.</p>
            <Link to="/login">
                <Button variant="primary">Login</Button>
            </Link>
        </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-lg shadow-md animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-8">You haven't placed any orders with us. Let's change that!</p>
        <Link to="/shop">
          <Button variant="primary">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/profile" className="flex items-center text-sm text-gray-600 hover:text-primary font-semibold transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Order ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Date</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Total</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userOrders.map(order => (
              <tr key={order.id}>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.toString().slice(-6)}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at!).toLocaleDateString()}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">₦{order.total.toLocaleString()}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                       order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                       order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                   }`}>
                        {order.status}
                    </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/orders/${order.id}`} className="text-primary hover:text-indigo-900">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistoryPage;