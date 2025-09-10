import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignIn.css';

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Check URL parameters for mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') {
      setIsSignIn(false);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkIfFirstTimeUser = (email) => {
    // Check if user has completed KYC before
    const kycCompleted = localStorage.getItem(`kycCompleted_${email}`);
    return kycCompleted !== 'true';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign In Logic
        if (!formData.email || !formData.password) {
          alert('Please fill in all fields');
          return;
        }
        
        // Use backend API for sign in
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Store user data
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userFullName', formData.fullName || 'User');
          
          // Check if this is a first-time user
          const isFirstTime = checkIfFirstTimeUser(formData.email);
          
          // Trigger a custom event to update navbar state
          window.dispatchEvent(new CustomEvent('userSignedIn', { 
            detail: { 
              email: formData.email,
              isFirstTime: isFirstTime
            } 
          }));
          
          if (isFirstTime) {
            // First-time user - redirect to KYC form
            alert('Welcome! Please complete your KYC verification.');
            navigate('/kyc');
          } else {
            // Returning user - go to home page
            alert('Successfully signed in!');
            navigate('/');
          }
        } else {
          alert(result.message || 'Sign in failed');
        }
      } else {
        // Register Logic
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
          alert('Please fill in all fields');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          alert('Password must be at least 6 characters long');
          return;
        }

        // Use backend API for registration
        const result = await register(formData.fullName, formData.email, formData.password);
        
        if (result.success) {
          // Store user data
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userFullName', formData.fullName);
          
          // New users always need KYC
          window.dispatchEvent(new CustomEvent('userSignedIn', { 
            detail: { 
              email: formData.email,
              isFirstTime: true
            } 
          }));
          
          alert('Account created successfully! Please complete your KYC verification.');
          navigate('/kyc');
        } else {
          alert(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>{isSignIn ? 'Sign In' : 'Create Account'}</h2>
          <p>{isSignIn ? 'Welcome back to XCoinpay' : 'Join XCoinpay today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required={!isSignIn}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isSignIn}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              isSignIn ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={toggleMode}
              className="toggle-btn"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignIn;
