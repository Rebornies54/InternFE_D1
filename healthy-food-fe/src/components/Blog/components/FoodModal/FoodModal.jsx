import React from 'react';
import { FOOD, FOOD_DESCRIPTION } from '../../../../constants';
import './FoodModal.css';

const FoodModal = ({ food, variations, onClose }) => {
  if (!food) return null;

  const foodName = food.name.split('(')[0].trim();

  return (
    <div className="food-modal-overlay" onClick={onClose}>
      <div className="food-modal" onClick={(e) => e.stopPropagation()}>
        <div className="food-modal-header">
          <h2 className="food-modal-title">{FOOD.DETAILS_TITLE}</h2>
          <button className="food-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="food-modal-content">
          <div className="food-intro">
            <div className="food-intro-text">
              <h1 className="food-name">{foodName}</h1>
              <p className="food-description">
                {foodName} {FOOD_DESCRIPTION.NUTRITION_RICH} 
                {FOOD_DESCRIPTION.CARB_DESCRIPTION} 
                {FOOD_DESCRIPTION.CALORIE_TABLE_REFERENCE} {foodName} {FOOD_DESCRIPTION.PRODUCT_REFERENCE} {foodName} 
                {FOOD_DESCRIPTION.MORE_INFO}
              </p>
            </div>
            <div className="food-intro-image">
              <span></span>
            </div>
          </div>
          
          <div className="food-nutrition-table">
            <table>
              <thead>
                <tr>
                  <th>{FOOD.NUTRITION_TABLE_HEADERS.FOOD}</th>
                  <th>{FOOD.NUTRITION_TABLE_HEADERS.SERVING}</th>
                  <th>{FOOD.NUTRITION_TABLE_HEADERS.CALORIES}</th>
                </tr>
              </thead>
              <tbody>
                {variations.map((variation, index) => (
                  <tr key={index}>
                    <td>{variation.name}</td>
                    <td>{variation.serving}</td>
                    <td>{variation.calories} {FOOD.CALORIES_UNIT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
