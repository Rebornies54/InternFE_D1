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
          setError(UI_TEXT.FILE_SIZE_ERROR);
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          setError(UI_TEXT.IMAGE_FILE_ERROR);
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
          
          alert(UI_TEXT.AVATAR_UPLOAD_SUCCESS);
        } else {
          throw new Error('Invalid response from server');
        }
      }).catch(_error => {
        let errorMessage = UI_TEXT.AVATAR_UPLOAD_FAILED;
        
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
      alert(UI_TEXT.FULL_NAME_REQUIRED);
      return;
    }
    if (!tempData.phone || !tempData.phone.trim()) {
      alert(UI_TEXT.PHONE_REQUIRED);
      return;
    }
    if (!tempData.gender) {
      alert(UI_TEXT.GENDER_REQUIRED);
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
          alert(UI_TEXT.PROFILE_UPDATED_SUCCESS);
        } else {
          throw new Error(result.message || UI_TEXT.PROFILE_UPDATE_FAILED);
        }
      } catch (error) {
        let errorMessage = UI_TEXT.PROFILE_UPDATE_FAILED;
        
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
          <span className="required">*</span>{UI_TEXT.PROFILE_IMAGE_LABEL}
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
              <span>{UI_TEXT.NO_IMAGE_TEXT}</span>
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
            <span className="required">*</span>{UI_TEXT.FULL_NAME_LABEL_PROFILE}
          </label>
                                <input
            type="text"
            className="profile-info-input"
            value={isEditing ? tempData.name : profileData.name}
            onChange={_e => setTempData(prev => ({ ...prev, name: _e.target.value }))}
            placeholder={UI_TEXT.ENTER_FULL_NAME}
            disabled={!isEditing || isSaving}
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>{UI_TEXT.EMAIL_LABEL_PROFILE}
          </label>
          <input
            type="email"
            className="profile-info-input-disabled"
            value={profileData.email}
            disabled
            placeholder={UI_TEXT.ENTER_EMAIL}
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>{UI_TEXT.PHONE_NUMBER_LABEL_PROFILE}
          </label>
                                <input
            type="tel"
            className="profile-info-input"
            value={isEditing ? tempData.phone : profileData.phone}
            onChange={_e => setTempData(prev => ({ ...prev, phone: _e.target.value }))}
            placeholder={UI_TEXT.ENTER_PHONE_NUMBER}
            disabled={!isEditing || isSaving}
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>{UI_TEXT.GENDER_LABEL_PROFILE}
          </label>
          <div className="profile-info-select-wrapper">
            <select
              className="profile-info-select"
              value={isEditing ? tempData.gender : profileData.gender}
              onChange={_e => setTempData(prev => ({ ...prev, gender: _e.target.value }))}
              disabled={!isEditing || isSaving}
            >
              <option value="">{UI_TEXT.SELECT_GENDER_OPTION}</option>
              <option value="male">{UI_TEXT.MALE_OPTION}</option>
              <option value="female">{UI_TEXT.FEMALE_OPTION}</option>
              <option value="other">{UI_TEXT.OTHER_OPTION}</option>
            </select>
            <div className="profile-info-select-arrow">▼</div>
          </div>
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>{UI_TEXT.BIRTHDAY_LABEL}
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
                  <option value="">{UI_TEXT.DAY_OPTION}</option>
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
                  <option value="">{UI_TEXT.MONTH_OPTION}</option>
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
                  <option value="">{UI_TEXT.YEAR_OPTION}</option>
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
                {UI_TEXT.CANCEL_PROFILE_BUTTON}
              </button>
              <button 
                type="button" 
                className="profile-info-btn-save" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? UI_TEXT.SAVING_PROFILE : UI_TEXT.UPDATE_PROFILE_BUTTON}
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="profile-info-btn-save" 
              onClick={() => setIsEditing(true)}
            >
              {UI_TEXT.EDIT_PROFILE_BUTTON}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProfileInfo; 