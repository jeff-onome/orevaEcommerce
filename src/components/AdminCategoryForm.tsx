import React, { useState, useEffect } from 'react';
import { Category, TablesInsert } from '../types';
import Button from './Button';
import Modal from './Modal';

type CategoryFormData = Omit<Category, 'id'> & { id?: number };

interface AdminCategoryFormProps {
  onSubmit: (category: Category | TablesInsert<'categories'>) => void;
  initialData?: Category;
}

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({ onSubmit, initialData }) => {
  const [category, setCategory] = useState<CategoryFormData>({
    name: '',
    image_url: null,
    is_highlighted: false,
    display_order: 99,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageToUpload, setImageToUpload] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData);
      setImagePreview(initialData.image_url);
    } else {
      setCategory({ name: '', image_url: null, is_highlighted: false, display_order: 99 });
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadConfirm = () => {
    if (imageToUpload) {
      setImagePreview(imageToUpload);
      setCategory(prev => ({ ...prev, image_url: imageToUpload }));
      setImageToUpload(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(category);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={category.name} onChange={handleChange} placeholder="Category Name" className="w-full p-2 border rounded" required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-32 object-cover rounded-md" />}
        </div>

        <input name="display_order" type="number" value={category.display_order || 99} onChange={handleChange} placeholder="Display Order" className="w-full p-2 border rounded" required />

        <label className="flex items-center space-x-3 cursor-pointer">
            <input 
                type="checkbox" 
                name="is_highlighted"
                checked={category.is_highlighted || false} 
                onChange={handleChange}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
            />
            <span className="text-gray-700">Highlight on Homepage</span>
        </label>
        
        <Button type="submit">Save Category</Button>
      </form>
      <Modal isOpen={!!imageToUpload} onClose={() => setImageToUpload(null)}>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Upload this Image?</h3>
          <img src={imageToUpload!} alt="Preview" className="max-w-full max-h-80 mx-auto rounded-md mb-6" />
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => setImageToUpload(null)}>
              Cancel
            </Button>
            <Button onClick={handleUploadConfirm}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminCategoryForm;
