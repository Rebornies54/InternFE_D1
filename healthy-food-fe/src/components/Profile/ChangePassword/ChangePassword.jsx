import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CHANGE_PASSWORD } from '../../../constants';
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
      setMessage(CHANGE_PASSWORD.MESSAGES.PASSWORDS_NOT_MATCH);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage(CHANGE_PASSWORD.MESSAGES.PASSWORD_TOO_SHORT);
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
        setMessage(CHANGE_PASSWORD.MESSAGES.SUCCESS);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message || CHANGE_PASSWORD.MESSAGES.FAILED);
      }
    } catch {
      setMessage(CHANGE_PASSWORD.MESSAGES.ERROR_OCCURRED);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-change-container">
      <h2>{CHANGE_PASSWORD.TITLE}</h2>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        <div className="password-fields-wrapper">
          <div className="form-group">
            <label htmlFor="old-password"><span className="required">*</span> {CHANGE_PASSWORD.LABELS.CURRENT_PASSWORD}</label>
            <input 
              type="password" 
              id="old-password" 
              placeholder={CHANGE_PASSWORD.PLACEHOLDERS.CURRENT_PASSWORD}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password"><span className="required">*</span> {CHANGE_PASSWORD.LABELS.NEW_PASSWORD}</label>
            <input 
              type="password" 
              id="new-password" 
              placeholder={CHANGE_PASSWORD.PLACEHOLDERS.NEW_PASSWORD}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password"><span className="required">*</span> {CHANGE_PASSWORD.LABELS.CONFIRM_NEW_PASSWORD}</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder={CHANGE_PASSWORD.PLACEHOLDERS.CONFIRM_NEW_PASSWORD}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              autoComplete="new-password"
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
            {isSubmitting ? CHANGE_PASSWORD.BUTTONS.SAVING : CHANGE_PASSWORD.BUTTONS.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;