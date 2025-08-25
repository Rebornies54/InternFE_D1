import React from 'react';
import { UI_TEXT } from '../../../../constants';
import './FoodControls.css';

const FoodCategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="food-category-filter">
    <label htmlFor="food-category" className="filter-label">{UI_TEXT.FILTER_BY_CATEGORY}</label>
    <div className="food-category-select-wrapper">
      <select 
        id="food-category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="food-category-select"
      >
        <option value="">{UI_TEXT.ALL_CATEGORIES}</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="food-category-select-arrow">▼</div>
    </div>
  </div>
);

const FoodSearchBar = ({ value, onChange }) => (
  <div className="food-search">
    <input
      type="text"
      placeholder={UI_TEXT.SEARCH_FOOD}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="food-search-input"
    />
  </div>
);

const FoodControls = ({ categories, selectedCategory, searchQuery, onCategoryChange, onSearchChange }) => {
  return (
    <div className="food-controls">
      <FoodCategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      <FoodSearchBar 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
    </div>
  );
};

export default FoodControls;
