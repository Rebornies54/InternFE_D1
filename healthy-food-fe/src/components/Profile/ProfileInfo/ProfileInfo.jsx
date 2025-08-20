import { UI_TEXT, VALIDATION, ERROR_MESSAGES } from '../../../constants';
// Fixed import
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLoading, useError } from '../../../hooks';
import './ProfileInfo.css';
import { authAPI } from '../../../services/api';
import { API_CONFIG } from '../../../constants';

const ProfileInfo = ({ profileData, setProfileData }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ 
    ...profileData,
    avatar: profileData.avatar_url || profileData.avatar 
  });
  const { loading: isSaving, withLoading: withSaving } = useLoading();
  const { loading: isUploading, withLoading: withUploading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    setTempData({ 
      ...profileData,
      avatar: profileData.avatar_url || profileData.avatar 
    });
  }, [profileData]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await withUploading(async () => {
        clearError();
        
        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be less than 5MB');
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file');
          return;
        }

        const formData = new FormData();
        formData.append('avatar', file);
        
        const res = await authAPI.uploadAvatar(formData);
        
        if (res.data && res.data.success && res.data.avatarUrl) {
          let avatarUrl = res.data.avatarUrl;
          if (avatarUrl && avatarUrl.startsWith('/')) {
            avatarUrl = API_CONFIG.BASE_URL + avatarUrl;
          }
          
          setTempData(prev => ({ ...prev, avatar: avatarUrl }));
          setProfileData(prev => ({ ...prev, avatar_url: avatarUrl }));
          
          alert('Avatar uploaded successfully!');
        } else {
          throw new Error('Invalid response from server');
        }
      }).catch(_error => {
        let errorMessage = 'Upload image failed! Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      });
    }
  };

  const handleSave = async () => {
    if (!tempData.name || !tempData.name.trim()) {
      alert('Full name is required');
      return;
    }
    if (!tempData.phone || !tempData.phone.trim()) {
      alert('Phone number is required');
      return;
    }
    if (!tempData.gender) {
      alert('Gender is required');
      return;
    }

    await withSaving(async () => {
      try {
        let birthday = null;
        if (tempData.birthdayDay && tempData.birthdayMonth && tempData.birthdayYear) {
          const year = parseInt(tempData.birthdayYear);
          const month = parseInt(tempData.birthdayMonth) - 1;
          const day = parseInt(tempData.birthdayDay);
          birthday = new Date(year, month, day).toISOString().split('T')[0];
        }
        const updateData = {
          name: tempData.name.trim(),
          phone: tempData.phone.trim(),
          gender: tempData.gender,
          birthday: birthday,
          avatar_url: tempData.avatar,
        };
        const result = await updateProfile(updateData);
        if (result.success) {
          setProfileData(result.user);
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          throw new Error(result.message || 'Failed to update profile');
        }
      } catch (error) {
        let errorMessage = 'Failed to update profile. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        throw error;
      }
    });
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  const isValidAvatarUrl = (url) => {
    if (!url) return false;
    return url.includes('/uploads/avatar_');
  };

  return (
    <form className="profile-info-form-row">
      <div className="profile-info-avatar-col">
        <label className="profile-info-avatar-label">
          <span className="required">*</span>Profile Image
        </label>
        {(tempData.avatar || (profileData.avatar_url && profileData.avatar_url.trim() !== '' && isValidAvatarUrl(profileData.avatar_url))) ? (
          <img
            src={tempData.avatar || profileData.avatar_url}
            alt="Avatar"
            className="profile-info-avatar-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const emptyDiv = e.target.parentNode.querySelector('.profile-info-avatar-empty');
              if (emptyDiv) {
                emptyDiv.style.display = 'block';
              }
              logWarning('Avatar image failed to load. This might be due to server issues or file not found.');
              if (profileData.avatar_url) {
                setProfileData(prev => ({ ...prev, avatar_url: null }));
              }
            }}
            onLoad={(e) => {
      
            }}
          />
        ) : null}
        {!tempData.avatar && (!profileData.avatar_url || profileData.avatar_url.trim() === '' || !isValidAvatarUrl(profileData.avatar_url)) && (
          <div className="profile-info-avatar-empty">
            <div className="profile-info-avatar-placeholder">
              <span>No Image</span>
            </div>
          </div>
        )}
        <label className={`profile-info-avatar-upload ${isUploading ? 'uploading' : ''}`}>
                      {isUploading ? UI_TEXT.UPLOADING : UI_TEXT.SELECT_IMAGE}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-info-file-input-hidden"
            disabled={!isEditing || isSaving || isUploading}
          />
        </label>
      </div>
      <div className="profile-info-fields-col">
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Full Name
          </label>
                                <input
            type="text"
            className="profile-info-input"
            value={isEditing ? tempData.name : profileData.name}
            onChange={_e => setTempData(prev => ({ ...prev, name: _e.target.value }))}
            placeholder="Full Name"
            disabled={!isEditing || isSaving}
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Email
          </label>
          <input
            type="email"
            className="profile-info-input-disabled"
            value={profileData.email}
            disabled
            placeholder="Email"
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Phone Number
          </label>
                                <input
            type="tel"
            className="profile-info-input"
            value={isEditing ? tempData.phone : profileData.phone}
            onChange={_e => setTempData(prev => ({ ...prev, phone: _e.target.value }))}
            placeholder="Phone Number"
            disabled={!isEditing || isSaving}
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Gender
          </label>
          <div className="profile-info-select-wrapper">
            <select
              className="profile-info-select"
              value={isEditing ? tempData.gender : profileData.gender}
              onChange={_e => setTempData(prev => ({ ...prev, gender: _e.target.value }))}
              disabled={!isEditing || isSaving}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="profile-info-select-arrow">▼</div>
          </div>
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Birthday
          </label>
          <div className="profile-info-birthday-container">
            <div className="profile-info-birthday-row">
              <div className="profile-info-select-wrapper">
                <select
                  className="profile-info-birthday-select"
                  value={isEditing ? tempData.birthdayDay || '' : ''}
                  onChange={_e => setTempData(prev => ({ ...prev, birthdayDay: _e.target.value }))}
                  disabled={!isEditing || isSaving}
                >
                  <option value="">Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="profile-info-select-arrow">▼</div>
              </div>
              <div className="profile-info-select-wrapper">
                <select
                  className="profile-info-birthday-select"
                  value={isEditing ? tempData.birthdayMonth || '' : ''}
                  onChange={_e => setTempData(prev => ({ ...prev, birthdayMonth: _e.target.value }))}
                  disabled={!isEditing || isSaving}
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <div className="profile-info-select-arrow">▼</div>
              </div>
              <div className="profile-info-select-wrapper">
                <select
                  className="profile-info-birthday-select"
                  value={isEditing ? tempData.birthdayYear || '' : ''}
                  onChange={_e => setTempData(prev => ({ ...prev, birthdayYear: _e.target.value }))}
                  disabled={!isEditing || isSaving}
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="profile-info-select-arrow">▼</div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-info-actions">
          <div className="profile-info-actions-divider"></div>
          <div className="profile-info-actions-placeholder"></div>
          {isEditing ? (
            <div className="profile-info-actions-buttons">
              <button 
                type="button" 
                className="profile-info-btn-cancel" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="profile-info-btn-save" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Update'}
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="profile-info-btn-save" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProfileInfo; 