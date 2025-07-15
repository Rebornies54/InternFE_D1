import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ChangePassword.css';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(''); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');

      const result = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (result.success) {
        setMessage('Password changed successfully!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message || 'Failed to change password');
      }
    } catch {
      setMessage('An error occurred while changing password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-change-container">
      <h2>Change Password</h2>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        <div className="password-fields-wrapper">
          <div className="form-group">
            <label htmlFor="old-password"><span className="required">*</span> Current Password</label>
            <input 
              type="password" 
              id="old-password" 
              placeholder="Current password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password"><span className="required">*</span> New Password</label>
            <input 
              type="password" 
              id="new-password" 
              placeholder="New password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password"><span className="required">*</span> Confirm New Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
          </div>
        </div>
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <div className="actions">
          <button 
            type="submit" 
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;