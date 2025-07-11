import React, { useState } from 'react';
import './ProfileInfo.css';

const ProfileInfo = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...profileData });

  const handleInputChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Tạo các option cho ngày/tháng/năm
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  return (
    <form className="profile-info-form-row">
      {/* Cột trái: Avatar */}
      <div className="profile-info-avatar-col">
        <label className="profile-info-avatar-label">
          <span className="required">*</span>プロフィール画像
        </label>
        {tempData.avatar ? (
          <img
            src={tempData.avatar}
            alt="Avatar"
            className="profile-info-avatar-img"
          />
        ) : (
          <div className="profile-info-avatar-empty"></div>
        )}
        <label className="profile-info-avatar-upload">
          画像を選択
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      {/* Cột phải: Form fields */}
      <div className="profile-info-fields-col">
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>氏名
          </label>
          <input
            type="text"
            className="profile-info-input"
            value={isEditing ? tempData.name : profileData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="氏名"
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
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>電話番号
          </label>
          <input
            type="tel"
            className="profile-info-input"
            value={isEditing ? tempData.phone : profileData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            placeholder="電話番号"
          />
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>性別
          </label>
          <select
            className="profile-info-select"
            value={isEditing ? tempData.gender : profileData.gender}
            onChange={e => handleInputChange('gender', e.target.value)}
          >
            <option value="">選択</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="profile-info-form-group">
          <label className="profile-info-label">
            <span className="required">*</span>生年月日
          </label>
          <div className="profile-info-birthday-row">
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayDay || '' : ''}
              onChange={e => handleInputChange('birthdayDay', e.target.value)}
            >
              <option value="">日</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayMonth || '' : ''}
              onChange={e => handleInputChange('birthdayMonth', e.target.value)}
            >
              <option value="">月</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              className="profile-info-birthday-select"
              value={isEditing ? tempData.birthdayYear || '' : ''}
              onChange={e => handleInputChange('birthdayYear', e.target.value)}
            >
              <option value="">年</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="profile-info-actions">
          <div className="profile-info-actions-divider"></div>
          <div className="profile-info-actions-placeholder"></div>
          <button type="button" className="profile-info-btn-save" onClick={isEditing ? handleSave : () => setIsEditing(true)}>更新</button>
        </div>
      </div>
    </form>
  );
};

export default ProfileInfo; 