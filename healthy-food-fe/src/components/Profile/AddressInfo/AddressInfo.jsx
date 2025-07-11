import React, { useState } from 'react';
import './AddressInfo.css';

const AddressInfo = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-tab-content">
      <div className="profile-section-header">
        <div className="profile-section-title">アドレス</div>
        <button className="profile-btn-add" onClick={() => setShowModal(true)}>
          + 他のアドレスを追加
        </button>
      </div>
      <div className="profile-address-block">
        <div className="profile-address-main">
          <div className="profile-address-name">aaaaa</div>
          <div className="profile-address-phone">096xxxx100</div>
          <div className="profile-address-detail">
            Tòa Handico, Đường Mễ Trì,Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội
          </div>
          <div className="profile-divider"></div>
        </div>
        <button className="profile-btn-update">更新</button>
      </div>

      {showModal && (
        <div className="address-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="address-modal" onClick={e => e.stopPropagation()}>
            {/* Nội dung form modal ở đây */}
            <div className="address-modal-header">
              <div className="address-modal-title">アドレス</div>
              <button className="address-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="address-modal-divider"></div>
            <form className="address-modal-form">
              <div className="address-modal-row">
                <div className="address-modal-field">
                  <label><span className="required">*</span> 氏名</label>
                  <input type="text" placeholder="Họ và tên" />
                </div>
                <div className="address-modal-field">
                  <label><span className="required">*</span> 電話番号</label>
                  <input type="text" placeholder="Số điện thoại" />
                </div>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> 都道府県</label>
                <select defaultValue="">
                  <option value="" disabled>Chọn</option>
                  {/* Thêm option nếu cần */}
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> 市/区</label>
                <select defaultValue="">
                  <option value="" disabled>Chọn</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> 町/番地</label>
                <select defaultValue="">
                  <option value="" disabled>Chọn</option>
                </select>
              </div>
              <div className="address-modal-field">
                <label><span className="required">*</span> 詳細</label>
                <input type="text" placeholder="Địa chỉ cụ thể" />
              </div>
              <div className="address-modal-actions">
                <button className="profile-btn-update" type="button" onClick={() => setShowModal(false)}>戻る</button>
                <button className="profile-btn-update" type="submit">追加する</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInfo; 