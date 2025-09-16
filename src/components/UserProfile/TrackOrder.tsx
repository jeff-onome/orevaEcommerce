
import React, { useState } from 'react';
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
            // In a real app, you'd also verify this order belongs to the current user
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
                    <h3 className="text-xl font-semibold mb-2">Order Status for #{searchedOrder.id.toString().slice(-6)}</h3>
                    <p className="text-gray-600 mb-6">Placed on: {new Date(searchedOrder.created_at!).toLocaleDateString()}</p>
                    <OrderStatusTracker status={searchedOrder.status} />
                </div>
            )}
        </div>
    );
};

export default TrackOrder;