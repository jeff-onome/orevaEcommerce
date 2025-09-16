
import React from 'react';
import { Product } from '../types';

interface AdminProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const AdminProductRow: React.FC<AdminProductRowProps> = ({ product, onEdit }) => {
  // In a real app, this would trigger a deletion confirmation.
  const handleDelete = () => alert(`Deleting ${product.name}`);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 flex items-center space-x-3">
        <img src={product.image_url || ''} alt={product.name} className="w-12 h-12 object-cover rounded-md" loading="lazy" decoding="async"/>
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
            <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
        </div>
      </td>
    </tr>
  );
};

export default AdminProductRow;