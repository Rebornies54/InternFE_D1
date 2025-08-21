import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UI_TEXT } from '../../../constants';
import './AddressInfo.css';

const AddressInfo = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-tab-content">
      <div className="profile-section-header">
        <div className="profile-section-title">{UI_TEXT.ADDRESS_TITLE}</div>
        <button className="profile-btn-add" onClick={() => setShowModal(true)}>
          {UI_TEXT.ADD_ANOTHER_ADDRESS}
        </button>
      </div>
      <div className="profile-address-block">
        <div className="profile-address-main">
          <div className="profile-address-name">{user?.name || UI_TEXT.N_A_PLACEHOLDER}</div>
          <div className="profile-address-phone">{user?.phone || UI_TEXT.N_A_PLACEHOLDER}</div>
          <div className="profile-address-detail">
            {user?.province && user?.district && user?.address 
              ? `${user.address}, ${user.district}, ${user.province}`
              : UI_TEXT.ADDRESS_NOT_UPDATED
            }
          </div>
          <div className="profile-divider"></div>
        </div>
        <button className="profile-btn-update">{UI_TEXT.UPDATE_ADDRESS_BUTTON}</button>
      </div>

      {showModal && (
        <div className="address-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="address-modal" onClick={e => e.stopPropagation()}>
            <div className="address-modal-header">
              <div className="address-modal-title">{UI_TEXT.ADDRESS_TITLE}</div>
              <button className="address-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="address-modal-divider"></div>
            <form className="address-modal-form">
              <div className="address-modal-row">
                <div className="address-modal-field">
                  <label><span className="required">*</span> {UI_TEXT.FULL_NAME_LABEL_PROFILE}</label>
                  <input type="text" placeholder={UI_TEXT.ENTER_FULL_NAME} />
                </div>
                <div className="address-modal-field">
                  <label><span className="required">*</span> {UI_TEXT.PHONE_NUMBER_LABEL_PROFILE}</label>
                  <input type="text" placeholder={UI_TEXT.ENTER_PHONE_NUMBER} />
                </div>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {UI_TEXT.PROVINCE_LABEL}</label>
                <select defaultValue="">
                  <option value="" disabled>{UI_TEXT.SELECT_OPTION}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {UI_TEXT.DISTRICT_LABEL}</label>
                <select defaultValue="">
                  <option value="" disabled>{UI_TEXT.SELECT_OPTION}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {UI_TEXT.TOWN_STREET_LABEL}</label>
                <select defaultValue="">
                  <option value="" disabled>{UI_TEXT.SELECT_OPTION}</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> {UI_TEXT.DETAILS_LABEL}</label>
                <input type="text" placeholder={UI_TEXT.SPECIFIC_ADDRESS_PLACEHOLDER} />
              </div>
              <div className="address-modal-actions">
                <button className="profile-btn-update" type="button" onClick={() => setShowModal(false)}>{UI_TEXT.BACK_BUTTON}</button>
                <button className="profile-btn-update" type="submit">{UI_TEXT.ADD_BUTTON}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInfo; 