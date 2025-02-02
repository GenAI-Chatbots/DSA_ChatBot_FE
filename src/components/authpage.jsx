import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, Lock, Loader2, XCircle, CheckCircle } from 'lucide-react';

const CustomAlert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' 
    ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
    : 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';

  const textColor = type === 'error' 
    ? 'text-red-800 dark:text-red-200' 
    : 'text-green-800 dark:text-green-200';

  const Icon = type === 'error' ? XCircle : CheckCircle;

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg border ${bgColor} animate-in fade-in slide-in-from-top duration-300`}>
      <Icon className={`w-5 h-5 ${textColor} mr-2`} />
      <span className={`text-sm font-medium ${textColor}`}>{message}</span>
      <button 
        onClick={onClose}
        className={`ml-auto ${textColor} hover:opacity-70`}
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    disabled: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      if(isLogin) {
        const response = await fetch('http://127.0.0.1:8000/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token);
          setAlert({
            type: 'success',
            message: 'Successfully logged in. Redirecting...'
          });
          setTimeout(() => navigate('/'), 1500);
        } else {
          throw new Error('Invalid username or password');
        }
      } else {
        const response = await fetch(`http://127.0.0.1:8000/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          setAlert({
            type: 'success',
            message: 'Account created successfully! Please log in.'
          });
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ username: '', password: '', disabled: false });
          }, 1500);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Account creation failed');
        }
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-blue-600">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />
        <img
          src="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Data Structures visualization"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Master Data Structures
          </h2>
          <p className="text-xl text-blue-100">
            Learn and practice DSA concepts with our interactive platform
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              DSA Assistant
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your personal Data Structures and Algorithms guide
            </p>
          </div>

          {/* Custom Alert */}
          {alert && (
            <CustomAlert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Auth Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setIsLogin(true);
                setAlert(null);
              }}
              className={`flex-1 py-4 text-sm font-medium ${
                isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setAlert(null);
              }}
              className={`flex-1 py-4 text-sm font-medium ${
                !isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Register
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Log in' : 'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;