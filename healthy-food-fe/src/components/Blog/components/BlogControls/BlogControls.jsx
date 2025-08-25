import React, { useState, useEffect, useRef } from 'react';
import { UI_TEXT } from '../../../../constants';
import './BlogControls.css';

const CategoryFilter = ({ categories, selected, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category) => {
    onChange(category);
    setIsDropdownOpen(false);
  };

  const getSelectedCategoryLabel = () => {
    if (!selected) return UI_TEXT.ALL_CATEGORIES;
    return selected.charAt(0).toUpperCase() + selected.slice(1);
  };

  return (
    <div className={`blog-categories-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <span className="dropdown-selected">{getSelectedCategoryLabel()}</span>
        <div className="dropdown-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div 
            className={`dropdown-item ${!selected ? 'selected' : ''}`}
            onClick={() => selectCategory('')}
          >
            {UI_TEXT.ALL_CATEGORIES}
          </div>
          {categories.map(category => (
            <div
              key={category}
              className={`dropdown-item ${selected === category ? 'selected' : ''}`}
              onClick={() => selectCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = ({ value, onChange }) => (
  <div className="blog-search">
    <input
      type="text"
      placeholder={UI_TEXT.SEARCH_POSTS}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const BlogControls = ({ categories, selectedCategory, searchQuery, onCategoryChange, onSearchChange }) => {
  return (
    <div className="blog-controls">
      <CategoryFilter 
        categories={categories} 
        selected={selectedCategory} 
        onChange={onCategoryChange} 
      />
      <SearchBar 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
    </div>
  );
};

export default BlogControls;
