import React from 'react';
import { Product } from '../types';

interface AdminProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const AdminProductRow: React.FC<AdminProductRowProps> = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 flex items-center space-x-3">
        {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" loading="lazy" decoding="async"/>
        ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
        )}
        <span>{product.name}</span>
      </td>
      <td className="py-3 px-4">
        {product.sale_price && product.sale_price < product.price ? (
            <div>
                <span className="text-accent font-semibold">₦{product.sale_price.toLocaleString()}</span>
                <span className="text-gray-500 line-through ml-2">₦{product.price.toLocaleString()}</span>
            </div>
        ) : (
            <span>₦{product.price.toLocaleString()}</span>
        )}
      </td>
      <td className="py-3 px-4">{product.stock}</td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
            <button onClick={() => onEdit(product)} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={() => onDelete(product)} className="text-red-600 hover:underline">Delete</button>
        </div>
      </td>
    </tr>
  );
};

export default AdminProductRow;