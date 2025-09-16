
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Button from './Button';
import { useAppContext } from '../context/AppContext';
import { uploadImage } from '../utils/storage';

type ProductFormData = Omit<Product, 'id' | 'created_at'> & { id?: number };

interface AdminProductFormProps {
  onSubmit: (product: any) => void; // Can be Product or Omit<Product, 'id'>
  initialData?: Product;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ onSubmit, initialData }) => {
  const { categories } = useAppContext();
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    price: 0,
    sale_price: undefined,
    description: '',
    image_url: '',
    categories: [],
    stock: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
      setImagePreview(initialData.image_url);
    } else {
      // Reset form when there's no initial data (for 'Add New' modal)
      setProduct({ name: '', price: 0, sale_price: undefined, description: '', image_url: '', categories: [], stock: 0 });
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'sale_price') {
      setProduct(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
      setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value }));
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    setProduct(prev => {
        const newCategories = prev.categories?.includes(categoryName)
            ? prev.categories.filter(c => c !== categoryName)
            : [...(prev.categories || []), categoryName];
        return {...prev, categories: newCategories };
    });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadImage(file, 'products');
        setImagePreview(publicUrl);
        setProduct(prev => ({ ...prev, image_url: publicUrl }));
      } catch (error) {
        console.error("Upload failed:", error);
        alert('Image upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.categories || product.categories.length === 0) {
        alert('Please select at least one category.');
        return;
    }
    
    const finalProduct = {
      ...product,
      image_url: product.image_url || `https://picsum.photos/seed/${product.name}/600/600`,
    };
    onSubmit(finalProduct);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={product.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" required />
        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
          <input name="sale_price" type="number" value={product.sale_price || ''} onChange={handleChange} placeholder="Sale Price (optional)" className="w-full p-2 border rounded" />
        </div>
        <textarea name="description" value={product.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" rows={4} required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-gray-50">
              {categories.map(cat => (
              <label key={cat.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                  type="checkbox"
                  checked={product.categories?.includes(cat.name) || false}
                  onChange={() => handleCategoryChange(cat.name)}
                  className="rounded text-primary focus:ring-primary"
                  />
                  <span>{cat.name}</span>
              </label>
              ))}
          </div>
        </div>
        
        <input name="stock" type="number" value={product.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded" required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100" />
          {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          {imagePreview && !isUploading && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-32 object-cover rounded-md" loading="lazy" decoding="async" />}
        </div>
        
        <Button type="submit" isLoading={isUploading}>Save Product</Button>
      </form>
    </>
  );
};

export default AdminProductForm;
