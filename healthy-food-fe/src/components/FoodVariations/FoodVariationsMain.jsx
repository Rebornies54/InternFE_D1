import React from 'react';
import { useFoodContext } from '../../context/FoodContext';
import { X, Info, Star, ArrowLeft } from 'lucide-react';
import { FOOD_VARIATIONS } from '../../constants';
import './FoodVariationsMain.css';

const FoodVariationsMain = () => {
  const { 
    selectedFood, 
    foodVariations, 
    showVariationsInMain, 
    closeVariationsInMain,
    openFoodDetail 
  } = useFoodContext();

  if (!showVariationsInMain || !selectedFood) {
    return null;
  }

  return (
    <div className="food-variations-main">
      <div className="food-variations-main-header">
        <button className="food-variations-back-btn" onClick={closeVariationsInMain}>
          <ArrowLeft size={20} />
          <span>{FOOD_VARIATIONS.MAIN.BACK_BUTTON}</span>
        </button>
        <div className="food-variations-main-title">
          <h1>{selectedFood.name}</h1>
          <p>{FOOD_VARIATIONS.MAIN.TITLE}</p>
        </div>
        <button className="food-variations-close-btn" onClick={closeVariationsInMain}>
          <X size={20} />
        </button>
      </div>

      <div className="food-variations-main-content">
        <div className="food-variations-main-grid">
          {foodVariations.map((variation) => (
            <div key={variation.id} className="food-variation-main-card">
              <div className="food-variation-main-header">
                <h3 className="food-variation-main-name">{variation.name}</h3>
                              <div className="food-variation-main-calories">
                {variation.calories} {FOOD_VARIATIONS.NUTRITION.UNITS.CALORIES}
              </div>
              </div>

              <div className="food-variation-main-nutrition">
                <div className="nutrition-main-item">
                  <span className="nutrition-main-label">{FOOD_VARIATIONS.NUTRITION.PROTEIN}</span>
                  <span className="nutrition-main-value">{variation.protein}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
                </div>
                <div className="nutrition-main-item">
                  <span className="nutrition-main-label">{FOOD_VARIATIONS.NUTRITION.CARBS}</span>
                  <span className="nutrition-main-value">{variation.carbs}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
                </div>
                <div className="nutrition-main-item">
                  <span className="nutrition-main-label">{FOOD_VARIATIONS.NUTRITION.FAT}</span>
                  <span className="nutrition-main-value">{variation.fat}{FOOD_VARIATIONS.NUTRITION.UNITS.GRAMS}</span>
                </div>
              </div>

              {variation.description && (
                <div className="food-variation-main-description">
                  <Info size={16} />
                  <p>{variation.description}</p>
                </div>
              )}

              <div className="food-variation-main-actions">
                <button className="food-variation-main-btn primary">
                  <Star size={16} />
                  {FOOD_VARIATIONS.BUTTONS.ADD_TO_FAVORITES}
                </button>
                <button 
                  className="food-variation-main-btn secondary"
                  onClick={() => openFoodDetail(variation)}
                >
                  {FOOD_VARIATIONS.BUTTONS.VIEW_DETAILS}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodVariationsMain;
