import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import { setRememberMe } from '../storage';

const countries = [
  'Nigeria', 'USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'India', 'South Africa'
];

type View = 'login' | 'register' | 'forgotPassword';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [showRegisterSuccessModal, setShowRegisterSuccessModal] = useState(false);
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(countries[0]);
  const [error, setError] = useState<string | null>(null);
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setCountry(countries[0]);
    setError(null);
  }

  const switchView = (newView: View) => {
    resetForm();
    setView(newView);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Set persistence preference BEFORE signing in
    setRememberMe(rememberMe);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword || !phone || !country) {
        setError('Please fill out all fields.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          country,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      // Show a "Check your email for verification" message
      setShowRegisterSuccessModal(true);
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname + "#/update-password",
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setShowResetSuccessModal(true);
    }
  };

  const handleCloseModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
      modalSetter(false);
      switchView('login');
  };

  const formTitle = 
    view === 'login' ? 'Welcome Back' :
    view === 'register' ? 'Create Your Account' :
    'Reset Your Password';

  const formSubtitle = 
    view === 'login' ? 'Sign in to continue' :
    view === 'register' ? 'Join us today!' :
    "We'll send a password reset link to your email.";
  
  const formSubmitHandler = 
    view === 'login' ? handleLogin :
    view === 'register' ? handleRegister :
    handlePasswordReset;

  return (
    <>
      <div className="flex items-center justify-center py-12">
        <div className="bg-surface p-10 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-2">{formTitle}</h2>
          <p className="text-center text-gray-500 mb-6">{formSubtitle}</p>

          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}

          <form onSubmit={formSubmitHandler} className="space-y-4">
            {view === 'register' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="mt-1 w-full p-3 border rounded-md" required />
                </div>
              </>
            )}
            
            {(view === 'login' || view === 'register' || view === 'forgotPassword') && (
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full p-3 border rounded-md" required />
              </div>
            )}

            {view === 'register' && (
               <>
                  <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+2348012345678" className="mt-1 w-full p-3 border rounded-md" required />
                  </div>
                  <div>
                      <label className="text-sm font-medium text-gray-700">Country</label>                      
                      <select value={country} onChange={e => setCountry(e.target.value)} className="mt-1 w-full p-3 border rounded-md bg-white" required>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
               </>
            )}

            {(view === 'login' || view === 'register') && (
                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full p-3 border rounded-md" required />
                </div>
            )}

            {view === 'register' && (
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full p-3 border rounded-md" required />
              </div>
            )}
            
            {view === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Remember Me</span>
                </label>
                <button type="button" onClick={() => switchView('forgotPassword')} className="font-semibold text-sm text-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" isLoading={loading}>
                {view === 'login' ? 'Login' : view === 'register' ? 'Create Account' : 'Send Reset Link'}
              </Button>
            </div>
          </form>

          <div className="text-center mt-6 text-sm">
            {view !== 'login' && (
              <p>
                {view === 'register' ? "Already have an account?" : "Remembered your password?"}
                <button onClick={() => switchView('login')} className="font-semibold text-primary hover:underline ml-1">
                  Login
                </button>
              </p>
            )}
            {view === 'login' && (
              <p>
                Don't have an account?
                <button onClick={() => switchView('register')} className="font-semibold text-primary hover:underline ml-1">
                  Sign up
                </button>
              </p>
            )}
          </div>

          <div className="text-center mt-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary hover:underline transition-colors duration-200">
              &larr; Back to Homepage
            </Link>
          </div>

        </div>
      </div>
      
      <Modal isOpen={showRegisterSuccessModal} onClose={() => handleCloseModal(setShowRegisterSuccessModal)}>
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">Please check your email for a verification link to activate your account.</p>
            <Button onClick={() => handleCloseModal(setShowRegisterSuccessModal)}>OK</Button>
        </div>
      </Modal>

      <Modal isOpen={showResetSuccessModal} onClose={() => handleCloseModal(setShowResetSuccessModal)}>
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Check Your Email</h3>
            <p className="text-gray-600 mb-6">If an account with that email exists, we've sent a link to reset your password.</p>
            <Button onClick={() => handleCloseModal(setShowResetSuccessModal)}>OK</Button>
        </div>
      </Modal>
    </>
  );
};

export default LoginPage;