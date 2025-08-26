import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ADDRESS_INFO } from '../../../constants';
import './AddressInfo.css';

const AddressInfo = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-tab-content">
      <div className="profile-section-header">
        <div className="profile-section-title">{ADDRESS_INFO.TITLE}</div>
        <button className="profile-btn-add" onClick={() => setShowModal(true)}>
          {ADDRESS_INFO.BUTTONS.ADD_ANOTHER_ADDRESS}
        </button>
      </div>
      <div className="profile-address-block">
        <div className="profile-address-main">
          <div className="profile-address-name">{user?.name || ADDRESS_INFO.MESSAGES.NA}</div>
          <div className="profile-address-phone">{user?.phone || ADDRESS_INFO.MESSAGES.NA}</div>
          <div className="profile-address-detail">
            {user?.province && user?.district && user?.address 
              ? `${user.address}, ${user.district}, ${user.province}`
              : ADDRESS_INFO.MESSAGES.ADDRESS_NOT_UPDATED
            }
          </div>
          <div className="profile-divider"></div>
        </div>
        <button className="profile-btn-update">{ADDRESS_INFO.BUTTONS.UPDATE}</button>
      </div>

      {showModal && (
        <div className="address-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="address-modal" onClick={e => e.stopPropagation()}>
            <div className="address-modal-header">
              <div className="address-modal-title">{ADDRESS_INFO.TITLE}</div>
              <button className="address-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="address-modal-divider"></div>
            <form className="address-modal-form">
              <div className="address-modal-row">
                <div className="address-modal-field">
                  <label><span className="required">*</span> {ADDRESS_INFO.LABELS.FULL_NAME}</label>
                  <input type="text" placeholder={ADDRESS_INFO.PLACEHOLDERS.FULL_NAME} />
                </div>
                <div className="address-modal-field">
                  <label><span className="required">*</span> {ADDRESS_INFO.LABELS.PHONE_NUMBER}</label>
                  <input type="text" placeholder={ADDRESS_INFO.PLACEHOLDERS.PHONE_NUMBER} />
                </div>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {ADDRESS_INFO.LABELS.PROVINCE}</label>
                <select defaultValue="">
                  <option value="" disabled>{ADDRESS_INFO.SELECT_OPTIONS.SELECT}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {ADDRESS_INFO.LABELS.DISTRICT}</label>
                <select defaultValue="">
                  <option value="" disabled>{ADDRESS_INFO.SELECT_OPTIONS.SELECT}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {ADDRESS_INFO.LABELS.TOWN_STREET}</label>
                <select defaultValue="">
                  <option value="" disabled>{ADDRESS_INFO.SELECT_OPTIONS.SELECT}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {ADDRESS_INFO.LABELS.DETAILS}</label>
                <input type="text" placeholder={ADDRESS_INFO.PLACEHOLDERS.SPECIFIC_ADDRESS} />
              </div>
              <div className="address-modal-actions">
                <button className="profile-btn-update" type="button" onClick={() => setShowModal(false)}>{ADDRESS_INFO.BUTTONS.BACK}</button>
                <button className="profile-btn-update" type="submit">{ADDRESS_INFO.BUTTONS.ADD}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInfo; 