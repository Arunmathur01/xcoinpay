import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './KYC.css';

const KYC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    passportId: '',
    country: '',
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    passportPhoto: null,
    personPhoto: null
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [kycStatus, setKycStatus] = useState('unknown'); // none | pending | approved | rejected | unknown
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userFullName = localStorage.getItem('userFullName');
    
    if (!userEmail) {
      // If no user is signed in, redirect to sign-in
      navigate('/signin');
      return;
    }

    // Pre-fill name if available
    if (userFullName) {
      setFormData(prev => ({ ...prev, fullName: userFullName }));
    }

    // Fetch KYC status from backend
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/kyc/status', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const completed = Boolean(res.data?.kycCompleted);
          const status = res.data?.kycStatus || 'none';
          setKycStatus(status);
          // keep legacy local flag in sync for other components
          try { localStorage.setItem(`kycCompleted_${userEmail}`, completed ? 'true' : 'false'); } catch(_) {}
        })
        .catch(() => setKycStatus('unknown'));
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        [e.target.name]: file
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.fullName || !formData.dateOfBirth || !formData.nationality)) {
      alert('Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && (!formData.passportId || !formData.country)) {
      alert('Please fill in all required fields');
      return;
    }
    if (currentStep === 3 && (!formData.address || !formData.city || !formData.postalCode)) {
      alert('Please fill in all required fields');
      return;
    }
    if (currentStep === 4 && (!formData.passportPhoto || !formData.personPhoto)) {
      alert('Please upload both passport photo and your photo');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (kycStatus === 'pending' || kycStatus === 'approved') {
        alert(`KYC is already ${kycStatus}. You cannot resubmit now.`);
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in first');
        navigate('/signin');
        return;
      }

      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        passportId: formData.passportId,
        country: formData.country,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      };

      const res = await axios.post('/api/kyc', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Mark KYC as pending for this user (existing UI checks this flag)
      const userEmail = localStorage.getItem('userEmail');
      localStorage.setItem(`kycCompleted_${userEmail}`, 'false');
      // Optionally cache submitted data locally
      localStorage.setItem(`kycData_${userEmail}`, JSON.stringify(payload));
      setKycStatus('pending');

      alert(`KYC submitted successfully! Status: ${res.data?.kycStatus || 'pending'}`);
      navigate('/');
    } catch (error) {
      console.error('KYC submission error:', error);
      alert(error.response?.data?.message || 'KYC submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="kyc-step">
      <h3>Personal Information</h3>
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="nationality">Nationality *</label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          placeholder="Enter your nationality"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="kyc-step">
      <h3>Identity Verification</h3>
      <div className="form-group">
        <label htmlFor="passportId">Passport/ID Number *</label>
        <input
          type="text"
          id="passportId"
          name="passportId"
          value={formData.passportId}
          onChange={handleInputChange}
          placeholder="Enter your passport or ID number"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">Country of Residence *</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
        >
          <option value="">Select your country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="IN">India</option>
          <option value="CN">China</option>
          <option value="JP">Japan</option>
          <option value="AU">Australia</option>
          <option value="BR">Brazil</option>
          <option value="MX">Mexico</option>
          <option value="RU">Russia</option>
          <option value="ZA">South Africa</option>
          <option value="NG">Nigeria</option>
          <option value="EG">Egypt</option>
          <option value="SA">Saudi Arabia</option>
          <option value="AE">United Arab Emirates</option>
          <option value="TR">Turkey</option>
          <option value="KR">South Korea</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="kyc-step">
      <h3>Address Information</h3>
      <div className="form-group">
        <label htmlFor="address">Street Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your street address"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City *</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Enter your city"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postalCode">Postal Code *</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="Enter your postal code"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="kyc-step">
      <h3>Document Verification</h3>
      <p className="step-description">Please upload clear photos of your documents for verification</p>
      
      <div className="photo-upload-section">
        <div className="photo-upload-group">
          <label htmlFor="passportPhoto" className="photo-label">
            <div className="photo-upload-area">
              {formData.passportPhoto ? (
                <div className="photo-preview">
                  <img 
                    src={URL.createObjectURL(formData.passportPhoto)} 
                    alt="Passport preview" 
                    className="preview-image"
                  />
                  <div className="photo-info">
                    <span className="photo-name">{formData.passportPhoto.name}</span>
                    <span className="photo-size">{(formData.passportPhoto.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📄</div>
                  <h4>Passport Photo</h4>
                  <p>Upload a clear photo of your passport</p>
                  <div className="upload-requirements">
                    <small>• Clear, well-lit image</small>
                    <small>• All text must be readable</small>
                    <small>• Max file size: 5MB</small>
                    <small>• Supported formats: JPG, PNG</small>
                  </div>
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="passportPhoto"
            name="passportPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            required
          />
        </div>

        <div className="photo-upload-group">
          <label htmlFor="personPhoto" className="photo-label">
            <div className="photo-upload-area">
              {formData.personPhoto ? (
                <div className="photo-preview">
                  <img 
                    src={URL.createObjectURL(formData.personPhoto)} 
                    alt="Person preview" 
                    className="preview-image"
                  />
                  <div className="photo-info">
                    <span className="photo-name">{formData.personPhoto.name}</span>
                    <span className="photo-size">{(formData.personPhoto.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">👤</div>
                  <h4>Your Photo</h4>
                  <p>Upload a clear photo of yourself</p>
                  <div className="upload-requirements">
                    <small>• Face clearly visible</small>
                    <small>• Good lighting</small>
                    <small>• Max file size: 5MB</small>
                    <small>• Supported formats: JPG, PNG</small>
                  </div>
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="personPhoto"
            name="personPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="kyc-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      <div className="progress-steps">
        <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</span>
        <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</span>
        <span className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</span>
        <span className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</span>
      </div>
    </div>
  );

  return (
    <div className="kyc-container">
      <div className="kyc-card">
        <div className="kyc-header">
          <h2>KYC Verification</h2>
          <p>Complete your verification to access all features</p>
        </div>

        {renderProgressBar()}

        {kycStatus === 'pending' && (
          <div className="auth-info" style={{ marginTop: '1rem' }}>
            <h4>KYC Pending Review</h4>
            <p>Your KYC has been submitted and is awaiting approval. You will be notified once reviewed.</p>
          </div>
        )}
        {kycStatus === 'approved' && (
          <div className="auth-info" style={{ marginTop: '1rem' }}>
            <h4>KYC Approved</h4>
            <p>Your KYC is approved. You have full access to the ICO page.</p>
          </div>
        )}
        {(kycStatus !== 'pending' && kycStatus !== 'approved') && (
          <form onSubmit={handleSubmit} className="kyc-form">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="kyc-actions">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="prev-btn"
                >
                  ← Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="next-btn"
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner">⏳</span>
                  ) : (
                    'Complete KYC'
                  )}
                </button>
              )}
            </div>
          </form>
        )}

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

export default KYC;
