import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface FirstTimeBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FirstTimeBuyerModal: React.FC<FirstTimeBuyerModalProps> = ({ isOpen, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const couponCode = 'WELCOME10';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        <h2 className="text-3xl font-bold text-primary mb-2">Welcome!</h2>
        <p className="text-gray-600 mb-4">As a thank you for visiting, enjoy</p>
        <p className="text-5xl font-extrabold text-accent mb-6">10% OFF</p>
        <p className="text-gray-600 mb-4">your first order with the code below:</p>
        
        <div className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 my-4">
          <span className="text-2xl font-mono font-bold text-gray-800 tracking-widest">{couponCode}</span>
          <button onClick={handleCopy} className="absolute top-1/2 right-3 -translate-y-1/2 bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <Button onClick={onClose} className="w-full mt-6">
          Start Shopping
        </Button>
      </div>
    </Modal>
  );
};

export default FirstTimeBuyerModal;
