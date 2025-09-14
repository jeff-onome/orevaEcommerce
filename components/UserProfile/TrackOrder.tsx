import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';
import { Order } from '../../types';
import OrderStatusTracker from '../OrderStatusTracker';

const TrackOrder: React.FC = () => {
    const { orders } = useAppContext();
    const [orderIdInput, setOrderIdInput] = useState('');
    const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSearchedOrder(null);

        if (!orderIdInput.trim()) {
            setError('Please enter an Order ID.');
            return;
        }

        const foundOrder = orders.find(o => o.id.toString().slice(-6) === orderIdInput.trim());

        if (foundOrder) {
            setSearchedOrder(foundOrder);
        } else {
            setError('Order not found. Please check the ID and try again.');
        }
    };

    return (
        <div className="animate-slide-in-up">
            <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
                <input
                    type="text"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    placeholder="Enter Order ID (last 6 digits)"
                    className="flex-grow p-3 border rounded-md"
                    aria-label="Order ID Input"
                />
                <Button type="submit">Track</Button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {searchedOrder && (
                <div className="bg-gray-50 p-6 rounded-lg animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold">Order Status for #{searchedOrder.id.toString().slice(-6)}</h3>
                            <p className="text-gray-600 text-sm mt-1">Placed on: {new Date(searchedOrder.created_at!).toLocaleDateString()}</p>
                        </div>
                        <Link to={`/orders/${searchedOrder.id}`} className="text-sm text-primary hover:underline font-semibold whitespace-nowrap">
                            View Full Details
                        </Link>
                    </div>
                    <OrderStatusTracker status={searchedOrder.status} />
                </div>
            )}
        </div>
    );
};

export default TrackOrder;