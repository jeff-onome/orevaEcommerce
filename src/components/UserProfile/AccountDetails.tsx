
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';
import { Profile } from '../../types';

const countries = [
  'Nigeria', 'USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'India', 'South Africa'
];

const AccountDetails: React.FC = () => {
    // FIX: Replaced dispatch with updateProfile and used profile/user from context correctly.
    const { state, updateProfile } = useAppContext();
    const { profile, user: authUser } = state;
    const [isEditing, setIsEditing] = useState(false);
    
    // Local state for form fields
    const [formData, setFormData] = useState<Partial<Pick<Profile, 'name' | 'phone' | 'country'>>>({
        name: profile?.name,
        phone: profile?.phone,
        country: profile?.country,
    });
    
    if (!profile || !authUser) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Use updateProfile from context instead of dispatch.
        updateProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ name: profile.name, phone: profile.phone, country: profile.country });
        setIsEditing(false);
    };

    return (
        <div className="animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Account Details</h2>
                {!isEditing && <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>}
            </div>

            {isEditing ? (
                <form onSubmit={handleSaveChanges} className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" required />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Email (cannot be changed)</label>
                        <input type="email" value={authUser.email} className="mt-1 w-full p-3 border rounded-md bg-gray-200" disabled />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <select name="country" value={formData.country || ''} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md bg-white" required>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="danger" onClick={handleCancel}>Cancel</Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4 text-lg">
                    <p><strong className="font-semibold text-gray-600 w-24 inline-block">Name:</strong> {profile.name}</p>
                    <p><strong className="font-semibold text-gray-600 w-24 inline-block">Email:</strong> {authUser.email}</p>
                    <p><strong className="font-semibold text-gray-600 w-24 inline-block">Phone:</strong> {profile.phone}</p>
                    <p><strong className="font-semibold text-gray-600 w-24 inline-block">Country:</strong> {profile.country}</p>
                </div>
            )}
        </div>
    );
};

export default AccountDetails;