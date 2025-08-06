import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLoading, useError } from '../../../hooks';
import './ProfileInfo.css';
import { authAPI } from '../../../services/api';

const API_BASE_URL = 'http://localhost:5000';

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

  // Sync tempData when profileData changes
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
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be less than 5MB');
          return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file');
          return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('avatar', file);
        
        const res = await authAPI.uploadAvatar(formData);
        
        if (res.data && res.data.success && res.data.avatarUrl) {
          let avatarUrl = res.data.avatarUrl;
          // Ensure the URL is complete
          if (avatarUrl && avatarUrl.startsWith('/')) {
            avatarUrl = API_BASE_URL + avatarUrl;
          }
          
          // Update both tempData and profileData
          setTempData(prev => ({ ...prev, avatar: avatarUrl }));
          setProfileData(prev => ({ ...prev, avatar_url: avatarUrl }));
          
          alert('Avatar uploaded successfully!');
        } else {
          throw new Error('Invalid response from server');
        }
      }).catch(error => {
        // Upload avatar error
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

  // Handle saving profile
  const handleSave = async () => {
    // Validation
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
          // Update local state with the result from updateProfile
          setProfileData(result.user);
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          throw new Error(result.message || 'Failed to update profile');
        }
      } catch (error) {
        // Error updating profile
        let errorMessage = 'Failed to update profile. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        throw error; // Re-throw để withSaving có thể xử lý
      }
    });
  };

  // Handle cancel editing
  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  // Create options for day/month/year
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  // Function to check if avatar URL is valid
  const isValidAvatarUrl = (url) => {
    if (!url) return false;
    // Kiểm tra xem URL có phải là avatar không
    return url.includes('/uploads/avatar_');
  };



  return (
    <form className="profile-info-form-row">
      {/* Left column: Avatar */}
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
              // Image load error
              e.target.style.display = 'none';
              const emptyDiv = e.target.parentNode.querySelector('.profile-info-avatar-empty');
              if (emptyDiv) {
                emptyDiv.style.display = 'block';
              }
              // Hiển thị thông báo lỗi
              console.warn('Avatar image failed to load. This might be due to server issues or file not found.');
              // Xóa avatar_url khỏi profileData nếu file không tồn tại
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
          {isUploading ? 'Uploading...' : 'Select Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            disabled={!isEditing || isSaving || isUploading}
          />
        </label>
      </div>
      {/* Right column: Form fields */}
      <div className="profile-info-fields-col">
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Full Name
          </label>
                                <input
            type="text"
            className="profile-info-input"
            value={isEditing ? tempData.name : profileData.name}
            onChange={e => setTempData(prev => ({ ...prev, name: e.target.value }))}
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
            className="profile-info-input"
            value={profileData.email}
            disabled
            placeholder="Email"
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
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
            onChange={e => setTempData(prev => ({ ...prev, phone: e.target.value }))}
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
              onChange={e => setTempData(prev => ({ ...prev, gender: e.target.value }))}
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
                  onChange={e => setTempData(prev => ({ ...prev, birthdayDay: e.target.value }))}
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
                  onChange={e => setTempData(prev => ({ ...prev, birthdayMonth: e.target.value }))}
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
                  onChange={e => setTempData(prev => ({ ...prev, birthdayYear: e.target.value }))}
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
            <div style={{ display: 'flex', gap: '12px' }}>
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