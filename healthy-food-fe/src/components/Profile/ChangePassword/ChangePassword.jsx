import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UI_TEXT } from '../../../constants';
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
      setMessage(UI_TEXT.PASSWORDS_NOT_MATCH_ERROR);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage(UI_TEXT.PASSWORD_MIN_LENGTH_ERROR);
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
        setMessage(UI_TEXT.PASSWORD_CHANGED_SUCCESS);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message || UI_TEXT.PASSWORD_CHANGE_FAILED);
      }
    } catch {
      setMessage(UI_TEXT.PASSWORD_CHANGE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-change-container">
      <h2>{UI_TEXT.CHANGE_PASSWORD_TITLE}</h2>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        <div className="password-fields-wrapper">
          <div className="form-group">
            <label htmlFor="old-password"><span className="required">*</span> {UI_TEXT.CURRENT_PASSWORD_LABEL}</label>
            <input 
              type="password" 
              id="old-password" 
              placeholder={UI_TEXT.CURRENT_PASSWORD_PLACEHOLDER}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password"><span className="required">*</span> {UI_TEXT.NEW_PASSWORD_LABEL}</label>
            <input 
              type="password" 
              id="new-password" 
              placeholder={UI_TEXT.NEW_PASSWORD_PLACEHOLDER}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password"><span className="required">*</span> {UI_TEXT.CONFIRM_NEW_PASSWORD_LABEL}</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder={UI_TEXT.CONFIRM_NEW_PASSWORD_PLACEHOLDER}
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
            {isSubmitting ? UI_TEXT.SAVING_TEXT : UI_TEXT.SAVE_PASSWORD_BUTTON}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;