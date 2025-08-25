import React from 'react';
import { FOOD } from '../../../../constants';
import FoodItem from '../FoodItem';
import './FoodList.css';

const FoodList = ({ foods, onFoodClick, loading, currentPage, itemsPerPage, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <div className="food-list-loading">
        <div className="loading-spinner"></div>
        <p>{FOOD.LOADING_TEXT}</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="no-foods-message">
        <div className="no-foods-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <p>{FOOD.NO_FOODS_MESSAGE}</p>
        <p className="no-foods-suggestion">{FOOD.NO_FOODS_SUGGESTION}</p>
      </div>
    );
  }

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return foods.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = getCurrentItems();

  return (
    <div className="food-list-container">
      <div className="food-list">
        {currentItems.map((food) => (
          <FoodItem
            key={food.id}
            food={food}
            onClick={onFoodClick}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="food-pagination">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            {FOOD.PAGINATION_PREVIOUS}
          </button>
          <span className="pagination-info">
            {FOOD.PAGINATION_PAGE_INFO} {currentPage} {FOOD.PAGINATION_OF} {totalPages}
          </span>
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            {FOOD.PAGINATION_NEXT}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodList;
