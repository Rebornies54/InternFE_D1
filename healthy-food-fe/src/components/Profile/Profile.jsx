import React, { useState } from 'react';
import './Profile.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import AddressInfo from './AddressInfo/AddressInfo';
import ChangePassword from './ChangePassword/ChangePassword';

const menuList = [
  {
    key: 'profile',
    label: 'プロフィール',
  },
  {
    key: 'address',
    label: 'アドレス',
  },
  {
    key: 'password',
    label: 'パスワードを変更',
  },
];

const Profile = () => {
  const [tab, setTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'aaaaa',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    avatar: null,
  });

  return (
    <div className="profile2-container">
      <aside className="profile-sidebar-custom">
        <div className="profile-sidebar-avatar-block">
          {profileData.avatar ? (
            <img
              src={profileData.avatar}
              alt="avatar"
              className="profile-sidebar-avatar"
            />
          ) : (
            <div className="profile-sidebar-avatar-empty"></div>
          )}
          <div className="profile-sidebar-avatar-info">
            <div className="profile-sidebar-name">{profileData.name}</div>
            <span className="profile-sidebar-edit">プロフィールを編集</span>
          </div>
        </div>
        <div className="profile-sidebar-divider"></div>
        <div className="profile-sidebar-menu">
          <div className="profile-sidebar-menu-title">マイプロフィール</div>
          <div className="profile-sidebar-menu-list">
            {menuList.map(item => (
              <div
                key={item.key}
                className={`profile-sidebar-menu-item${tab === item.key ? ' active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                <span className="profile-sidebar-menu-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div className="profile2-content">
        <div className="profile2-content-title">プロフィール</div>
        <div className="profile2-content-divider"></div>
        {tab === 'profile' && <ProfileInfo profileData={profileData} setProfileData={setProfileData} />}
        {tab === 'address' && <AddressInfo />}
        {tab === 'password' && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile; 