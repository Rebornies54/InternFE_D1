import React from 'react';
import { useFoodContext } from '../../context/FoodContext';
import { X, Info, Star } from 'lucide-react';
import { FOOD_VARIATIONS } from '../../constants';
import './FoodVariations.css';

const FoodVariations = () => {
  const { selectedFood, isFoodDetailOpen, closeFoodDetail } = useFoodContext();

  if (!isFoodDetailOpen || !selectedFood) {
    return null;
  }

  return (
    <div className="food-variations-overlay" onClick={closeFoodDetail}>
      <div className="food-variations-modal" onClick={(e) => e.stopPropagation()}>
        <div className="food-variations-header">
          <div className="food-variations-title">
            <h2>{selectedFood.name}</h2>
            <p className="food-variations-subtitle">{FOOD_VARIATIONS.MODAL.SUBTITLE}</p>
          </div>
          <button className="food-variations-close" onClick={closeFoodDetail}>
            <X size={20} />
          </button>
        </div>

        <div className="food-variations-content">
          <div className="food-detail-card">
            <div className="food-detail-header">
              <h3 className="food-detail-name">{selectedFood.name}</h3>
              <div className="food-detail-calories">
                {selectedFood.calories} cal
              </div>
            </div>

            <div className="food-detail-nutrition">
              <div className="nutrition-item">
                <span className="nutrition-label">{FOOD_VARIATIONS.NUTRITION.PROTEIN}</span>
                <span className="nutrition-value">{selectedFood.protein || 0}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">{FOOD_VARIATIONS.NUTRITION.CARBS}</span>
                <span className="nutrition-value">{selectedFood.carbs || 0}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">{FOOD_VARIATIONS.NUTRITION.FAT}</span>
                <span className="nutrition-value">{selectedFood.fat || 0}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
              </div>
            </div>

            {selectedFood.description && (
              <div className="food-detail-description">
                <Info size={16} />
                <p>{selectedFood.description}</p>
              </div>
            )}

            <div className="food-detail-actions">
              <button className="food-variation-btn primary">
                <Star size={16} />
                {FOOD_VARIATIONS.BUTTONS.ADD_TO_FAVORITES}
              </button>
              <button className="food-variation-btn secondary" onClick={closeFoodDetail}>
                {FOOD_VARIATIONS.BUTTONS.CLOSE}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodVariations;
