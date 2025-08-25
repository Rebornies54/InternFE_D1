import React from 'react';
import { FOOD } from '../../../../constants';
import { AnimatedCard } from '../../../AnimatedComponents';
import './FoodItem.css';

const FoodItem = ({ food, onClick }) => {
  const logWarning = (message) => {
    console.warn(message);
  };

  return (
    <AnimatedCard className="food-item" onClick={() => onClick(food)}>
      <div className="food-item-image">
        {food.image_url && food.image_url.trim() !== '' ? (
          <img 
            src={food.image_url} 
            alt={food.name}
            onError={(e) => {
              logWarning(`Failed to load food image: ${food.image_url}`);
              e.target.style.display = 'none';
              const placeholder = e.target.parentNode.querySelector('.food-image-placeholder');
              if (placeholder) {
                placeholder.classList.remove('food-image-placeholder-hidden');
                placeholder.classList.add('food-image-placeholder-visible');
              }
            }}
          />
        ) : null}
        <div 
          className={`food-image-placeholder ${(food.image_url && food.image_url.trim() !== '') ? 'food-image-placeholder-hidden' : 'food-image-placeholder-visible'}`}
        >
          <div className="food-placeholder-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span className="food-placeholder-text">{food.name.split(' ')[0]}</span>
        </div>
      </div>
      <div className="food-item-content">
        <h3 className="food-item-title">{food.name}</h3>
        <p className="food-item-category">{food.category_name}</p>
        <div className="food-item-nutrition">
          <span className="food-item-calories">{food.calories} {FOOD.CALORIES_UNIT}</span>
          <span className="food-item-protein">{food.protein}{FOOD.PROTEIN_UNIT}</span>
          <span className="food-item-carbs">{food.carbs}{FOOD.CARBS_UNIT}</span>
          <span className="food-item-fat">{food.fat}{FOOD.FAT_UNIT}</span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default FoodItem;
