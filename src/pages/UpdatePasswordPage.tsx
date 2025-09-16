import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../components/Button';
import Modal from '../components/Modal';

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = async () => {
    setShowSuccessModal(false);
    // Log the user out after password change for security, forcing them to log in with the new password.
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      <div className="flex items-center justify-center py-12">
        <div className="bg-surface p-10 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-2">Update Your Password</h2>
          <p className="text-center text-gray-500 mb-6">Enter a new password for your account.</p>

          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="mt-1 w-full p-3 border rounded-md" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                className="mt-1 w-full p-3 border rounded-md" 
                required 
              />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" isLoading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={showSuccessModal} onClose={handleCloseModal}>
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Password Updated!</h3>
            <p className="text-gray-600 mb-6">Your password has been changed successfully. Please log in with your new password.</p>
            <Button onClick={handleCloseModal}>Login</Button>
        </div>
      </Modal>
    </>
  );
};

export default UpdatePasswordPage;