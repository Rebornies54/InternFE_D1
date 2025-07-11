import React from 'react';
import './ChangePassword.css';

const ChangePassword = () => (
  <div className="password-change-container">
    <h2>パスワードの変更</h2>
    <div className="divider"></div>
    <div className="password-fields-wrapper">
      <div className="form-group">
        <label htmlFor="old-password"><span className="required">*</span> 元のパスワード</label>
        <input type="password" id="old-password" placeholder="元のパスワード" />
      </div>
      <div className="form-group">
        <label htmlFor="new-password"><span className="required">*</span> 新しいパスワード</label>
        <input type="password" id="new-password" placeholder="新しいパスワード" />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password"><span className="required">*</span> 新しいパスワード（確認）</label>
        <input type="password" id="confirm-password" placeholder="新しいパスワード（確認）" />
      </div>
    </div>
    <div className="actions">
      <button className="save-button">保存</button>
    </div>
  </div>
);

export default ChangePassword;