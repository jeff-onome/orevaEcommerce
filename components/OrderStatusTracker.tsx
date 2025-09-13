
import React from 'react';
import { Order } from '../types';

interface OrderStatusTrackerProps {
  status: Order['status'];
}

const statuses: Order['status'][] = ['Processing', 'Shipped', 'Delivered'];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const currentStatusIndex = statuses.indexOf(status);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 sr-only">Order Status</h3>
      <div className="flex items-center justify-between">
        {statuses.map((s, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {isCompleted ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <p className={`mt-2 font-medium text-xs sm:text-sm ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{s}</p>
              </div>
              {index < statuses.length - 1 && (
                <div className={`flex-1 h-1 transition-colors duration-500 mx-2 sm:mx-4 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
