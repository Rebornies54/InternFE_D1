import React from 'react';
import './CheckboxOption.css';

const CheckboxOption = ({ 
  id, 
  name, 
  value, 
  checked, 
  onChange, 
  label, 
  description 
}) => {
  return (
    <label className="checkbox-option" htmlFor={id}>
      <div className="checkbox-container">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
        />
        <div className="checkbox-custom">
          <svg className="checkbox-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>
      <div className="checkbox-content">
        <div className="checkbox-label">{label}</div>
        {description && (
          <div className="checkbox-description">{description}</div>
        )}
      </div>
    </label>
  );
};

export default CheckboxOption; 