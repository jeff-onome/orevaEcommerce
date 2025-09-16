

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../supabaseClient';

const countries = [
  'Nigeria', 'USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'India', 'South Africa'
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // FIX: Updated to Supabase v2 signInWithPassword syntax.
    // FIX: Casting to `any` to bypass potential type mismatch errors.
    const { data, error } = await (supabase.auth as any).signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_suspended')
        .eq('id', data.user.id)
        .single();
      
      if (profile?.is_suspended) {
        setError('Your account has been suspended.');
        // FIX: Updated to Supabase v2 signOut syntax with error handling.
        // FIX: Casting to `any` to bypass potential type mismatch errors.
        const { error: signOutError } = await (supabase.auth as any).signOut(); // Log them out immediately
        if (signOutError) console.error('Error signing out suspended user:', signOutError);
        setLoading(false);
        return;
      }
    }
    
    navigate('/');
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

    // FIX: Updated to Supabase v2 signUp syntax.
    // FIX: Casting to `any` to bypass potential type mismatch errors.
    const { error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            country,
          },
        },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("account created successfully");
      setIsLoginView(true);
      resetForm();
    }
    setLoading(false);
  };

  const formTitle = isLoginView ? 'Welcome Back' : 'Create Your Account';
  const formSubmitHandler = isLoginView ? handleLogin : handleRegister;

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-surface p-10 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-2">{formTitle}</h2>
        <p className="text-center text-gray-500 mb-6">{isLoginView ? 'Sign in to continue' : 'Join us today!'}</p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={formSubmitHandler} className="space-y-4">
          {!isLoginView && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="mt-1 w-full p-3 border rounded-md" required />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full p-3 border rounded-md" required />
          </div>

          {!isLoginView && (
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

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full p-3 border rounded-md" required />
          </div>

          {!isLoginView && (
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full p-3 border rounded-md" required />
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={loading}>
              {isLoginView ? 'Login' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm">
          <p>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                resetForm();
              }}
              className="font-semibold text-primary hover:underline ml-1"
            >
              {isLoginView ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="text-center mt-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary hover:underline transition-colors duration-200">
            &larr; Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;