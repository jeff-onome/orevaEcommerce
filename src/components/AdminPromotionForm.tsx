import React, { useState, useEffect } from 'react';
import { Promotion } from '../types';
import Button from './Button';
import Modal from './Modal';

type PromotionFormData = Omit<Promotion, 'id'> & { id?: number };

interface AdminPromotionFormProps {
  onSubmit: (promotion: any) => void;
  initialData?: Promotion;
}

const AdminPromotionForm: React.FC<AdminPromotionFormProps> = ({ onSubmit, initialData }) => {
  const [promotion, setPromotion] = useState<PromotionFormData>({
    title: '',
    description: '',
    image_url: '',
    is_active: false,
    discount_percentage: 0,
    cta_text: '',
    cta_link: '/shop',
    target_category: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageToUpload, setImageToUpload] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setPromotion(initialData);
      setImagePreview(initialData.image_url);
    } else {
      setPromotion({
        title: '',
        description: '',
        image_url: '',
        is_active: false,
        discount_percentage: 0,
        cta_text: '',
        cta_link: '/shop',
        target_category: '',
      });
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPromotion(prev => ({ 
        ...prev, 
        [name]: name === 'discount_percentage' ? parseFloat(value) : value 
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
      setPromotion(prev => ({ ...prev, image_url: imageToUpload }));
      setImageToUpload(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPromotion = {
      ...promotion,
      target_category: promotion.title,
      cta_link: '/shop',
      image_url: promotion.image_url || null,
    };
    onSubmit(finalPromotion);
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={promotion.title} onChange={handleChange} placeholder="Promotion Title (becomes collection name)" className="w-full p-2 border rounded" required />
            <textarea name="description" value={promotion.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" rows={3} required />
            <input name="discount_percentage" type="number" value={promotion.discount_percentage || ''} onChange={handleChange} placeholder="Discount %" className="w-full p-2 border rounded" required />
            <input name="cta_text" value={promotion.cta_text || ''} onChange={handleChange} placeholder="Button Text (e.g., Shop Now)" className="w-full p-2 border rounded" required />
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Promotion Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto object-cover rounded-md" loading="lazy" decoding="async" />}
            </div>
            
            <Button type="submit">Save Promotion</Button>
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

export default AdminPromotionForm;
