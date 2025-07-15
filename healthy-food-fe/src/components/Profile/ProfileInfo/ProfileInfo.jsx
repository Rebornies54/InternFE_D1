import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ProfileInfo.css';
import { authAPI } from '../../../services/api';

const API_BASE_URL = 'http://localhost:5000';

const ProfileInfo = ({ profileData, setProfileData }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...profileData });
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const res = await authAPI.uploadAvatar(file);
        let avatarUrl = res.data.avatarUrl;
        if (avatarUrl && avatarUrl.startsWith('/')) {
          avatarUrl = API_BASE_URL + avatarUrl;
        }
        setTempData(prev => ({ ...prev, avatar: avatarUrl }));
      } catch {
        alert('Upload image failed!');
      }
    }
  };

  // Handle saving profile
  const handleSave = async () => {
    try {
      setIsSaving(true);
      let birthday = null;
      if (tempData.birthdayDay && tempData.birthdayMonth && tempData.birthdayYear) {
        const year = parseInt(tempData.birthdayYear);
        const month = parseInt(tempData.birthdayMonth) - 1;
        const day = parseInt(tempData.birthdayDay);
        birthday = new Date(year, month, day).toISOString().split('T')[0];
      }
      const updateData = {
        name: tempData.name,
        phone: tempData.phone,
        gender: tempData.gender,
        birthday: birthday,
        avatar_url: tempData.avatar,
      };
      const result = await updateProfile(updateData);
      if (result.success) {
        // Get the latest profile
        const profileRes = await authAPI.getProfile();
        setProfileData(profileRes.data.data);
        setIsEditing(false);
      }
          } catch {
        console.error('Error updating profile');
      } finally {
        setIsSaving(false);
      }
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

  return (
    <form className="profile-info-form-row">
      {/* Left column: Avatar */}
      <div className="profile-info-avatar-col">
        <label className="profile-info-avatar-label">
          <span className="required">*</span>Profile Image
        </label>
        {tempData.avatar ? (
          <img
            src={tempData.avatar}
            alt="Avatar"
            className="profile-info-avatar-img"
            style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          <div className="profile-info-avatar-empty"></div>
        )}
        <label className="profile-info-avatar-upload">
          Select Image
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
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
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Email
          </label>
          <input
            type="email"
            className="profile-info-input"
            value={isEditing ? tempData.email : profileData.email}
            onChange={e => setTempData(prev => ({ ...prev, email: e.target.value }))}
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
            onChange={e => setTempData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone Number"
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Gender
          </label>
          <select
            className="profile-info-select"
            value={isEditing ? tempData.gender : profileData.gender}
            onChange={e => setTempData(prev => ({ ...prev, gender: e.target.value }))}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>Birthday
          </label>
          <div className="profile-info-birthday-row">
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayDay || '' : ''}
              onChange={e => setTempData(prev => ({ ...prev, birthdayDay: e.target.value }))}
            >
              <option value="">Day</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayMonth || '' : ''}
              onChange={e => setTempData(prev => ({ ...prev, birthdayMonth: e.target.value }))}
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayYear || '' : ''}
              onChange={e => setTempData(prev => ({ ...prev, birthdayYear: e.target.value }))}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
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