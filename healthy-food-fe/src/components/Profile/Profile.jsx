import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { PROFILE } from '../../constants';
import './Profile.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import AddressInfo from './AddressInfo/AddressInfo';
import ChangePassword from './ChangePassword/ChangePassword';

const MyBlogs = lazy(() => import('./MyBlogs/MyBlogs'));

const menuList = [
  {
    key: 'profile',
    label: PROFILE.MENU.PROFILE,
  },
  {
    key: 'address',
    label: PROFILE.MENU.ADDRESS,
  },
  {
    key: 'password',
    label: PROFILE.MENU.CHANGE_PASSWORD,
  },
  {
    key: 'my-blogs',
    label: PROFILE.MENU.MY_BLOGS,
  },
];

const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const { scrollToTop } = useScrollToTop();

  const handleTabChange = (newTab) => {
    setTab(newTab);
    scrollToTop();
  };
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      let birthdayDay = '';
      let birthdayMonth = '';
      let birthdayYear = '';
      
      if (user.birthday) {
        const birthdayDate = new Date(user.birthday);
        birthdayDay = birthdayDate.getDate().toString();
        birthdayMonth = (birthdayDate.getMonth() + 1).toString();
        birthdayYear = birthdayDate.getFullYear().toString();
      }

      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        birthdayDay,
        birthdayMonth,
        birthdayYear,
        avatar: user.avatar_url || null,
      });
    }
  }, [user]);

  return (
    <div className="profile2-container">
      <aside className="profile-sidebar-custom">
        <div className="profile-sidebar-avatar-block">
          {profileData.avatar && profileData.avatar.trim() !== '' ? (
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
            <span className="profile-sidebar-edit">{PROFILE.SIDEBAR.EDIT_PROFILE}</span>
          </div>
        </div>
        <div className="profile-sidebar-divider"></div>
        <div className="profile-sidebar-menu">
          <div className="profile-sidebar-menu-title">{PROFILE.SIDEBAR.MY_PROFILE}</div>
          <div className="profile-sidebar-menu-list">
            {menuList.map(item => (
              <div
                key={item.key}
                className={`profile-sidebar-menu-item${tab === item.key ? ' active' : ''}`}
                onClick={() => handleTabChange(item.key)}
              >
                <span className="profile-sidebar-menu-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div className="profile2-content">
        <div className="profile2-content-title">{PROFILE.CONTENT.TITLE}</div>
        <div className="profile2-content-divider"></div>
        {tab === 'profile' && <ProfileInfo profileData={profileData} setProfileData={setProfileData} />}
        {tab === 'address' && <AddressInfo />}
        {tab === 'password' && <ChangePassword />}
        {tab === 'my-blogs' && (
          <Suspense fallback={<div>{PROFILE.CONTENT.LOADING}</div>}>
            <MyBlogs />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Profile; 