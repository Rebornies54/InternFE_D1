import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AddressInfo.css';

const AddressInfo = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-tab-content">
      <div className="profile-section-header">
        <div className="profile-section-title">Address</div>
        <button className="profile-btn-add" onClick={() => setShowModal(true)}>
          + Add Another Address
        </button>
      </div>
      <div className="profile-address-block">
        <div className="profile-address-main">
          <div className="profile-address-name">{user?.name || 'N/A'}</div>
          <div className="profile-address-phone">{user?.phone || 'N/A'}</div>
          <div className="profile-address-detail">
            {user?.province && user?.district && user?.address 
              ? `${user.address}, ${user.district}, ${user.province}`
              : 'Address not updated yet'
            }
          </div>
          <div className="profile-divider"></div>
        </div>
        <button className="profile-btn-update">Update</button>
      </div>

      {showModal && (
        <div className="address-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="address-modal" onClick={e => e.stopPropagation()}>
            <div className="address-modal-header">
              <div className="address-modal-title">Address</div>
              <button className="address-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="address-modal-divider"></div>
            <form className="address-modal-form">
              <div className="address-modal-row">
                <div className="address-modal-field">
                  <label><span className="required">*</span> Full Name</label>
                  <input type="text" placeholder="Full name" />
                </div>
                <div className="address-modal-field">
                  <label><span className="required">*</span> Phone Number</label>
                  <input type="text" placeholder="Phone number" />
                </div>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> Province</label>
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> District</label>
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> Town/Street</label>
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> Details</label>
                <input type="text" placeholder="Specific address" />
              </div>
              <div className="address-modal-actions">
                <button className="profile-btn-update" type="button" onClick={() => setShowModal(false)}>Back</button>
                <button className="profile-btn-update" type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInfo; 