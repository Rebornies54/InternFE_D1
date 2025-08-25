import React, { useState } from 'react';
import {
  BMI,
  BMI_CATEGORY_CLASSES,
  BMI_CATEGORIES,
  BMI_RANGES,
  FOOD_CATEGORY_MAPPING,
  FOOD_FALLBACK_IMAGES,
  CALORIE_CALCULATION,
  NUTRITION_LABELS
} from '../../../../constants';
import './FoodRecommendations.css';

const FoodRecommendations = ({
  recommendedFoods,
  loading,
  bmi,
  categories,
  pendingFoods,
  onAddToCalorie,
  onUpdateQuantity,
  onRemoveFood,
  totalCalories
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const getBMICategoryClass = (bmi) => {
    if (bmi < BMI_RANGES.NORMAL.min) return BMI_CATEGORY_CLASSES.UNDERWEIGHT;
    if (bmi >= BMI_RANGES.NORMAL.min && bmi < BMI_RANGES.OVERWEIGHT.min) return BMI_CATEGORY_CLASSES.NORMAL;
    if (bmi >= BMI_RANGES.OVERWEIGHT.min && bmi < BMI_RANGES.OBESE.min) return BMI_CATEGORY_CLASSES.OVERWEIGHT;
    return BMI_CATEGORY_CLASSES.OBESE;
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < BMI_RANGES.NORMAL.min) return BMI_CATEGORIES.UNDERWEIGHT;
    if (bmiValue >= BMI_RANGES.NORMAL.min && bmiValue < BMI_RANGES.OVERWEIGHT.min) return BMI_CATEGORIES.NORMAL;
    if (bmiValue >= BMI_RANGES.OVERWEIGHT.min && bmiValue < BMI_RANGES.OBESE.min) return BMI_CATEGORIES.OVERWEIGHT;
    return BMI_CATEGORIES.OBESE;
  };

  const getFoodCategoryClass = (categoryId) => {
    return FOOD_CATEGORY_MAPPING[categoryId] || 'default';
  };

  const getFoodImageUrl = (food) => {
    if (!food.image_url || food.image_url === 'null' || food.image_url.trim() === '') {
      return null;
    }

    try {
      new URL(food.image_url);
      return food.image_url;
    } catch {
      return null;
    }
  };

  const getFallbackImage = (categoryId) => {
    const categoryClass = getFoodCategoryClass(categoryId);
    const fallbackImages = {
      meat: FOOD_FALLBACK_IMAGES.MEAT,
      vegetables: FOOD_FALLBACK_IMAGES.VEGETABLES,
      fruits: FOOD_FALLBACK_IMAGES.FRUITS,
      grains: FOOD_FALLBACK_IMAGES.GRAINS,
      dairy: FOOD_FALLBACK_IMAGES.DAIRY,
      snacks: FOOD_FALLBACK_IMAGES.SNACKS,
    };
    return fallbackImages[categoryClass] || FOOD_FALLBACK_IMAGES.MEAT;
  };

  const handleImageError = (e, food) => {
    console.log('Image failed to load for:', food.name, 'URL:', e.target.src);
    e.target.src = getFallbackImage(food.category_id);
  };

  const openModal = (food) => {
    setSelectedFood(food);
    setModalOpen(true);
    setActiveImg(0);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFood(null);
  };

  return (
    <>
      <div className="food-list-section">
        <h2 className="body-index-section-title">
          {BMI.RECOMMENDATIONS_TITLE}
          {bmi && (
            <span className={`bmi-badge bmi-badge-${getBMICategoryClass(bmi)}`}>
              Based on BMI: {getBMICategory(bmi)}
            </span>
          )}
        </h2>

        {loading ? (
          <div className="loading-message">Loading food recommendations...</div>
        ) : (
          <div className="recommended-food-list">
            {recommendedFoods.length > 0 ? (
              recommendedFoods.map((food) => (
                <div className="food-item" key={food.id}>
                  <div className="food-img-container">
                    <img
                      src={getFoodImageUrl(food) || getFallbackImage(food.category_id)}
                      alt={food.name}
                      className="food-image"
                      onError={(_e) => handleImageError(_e, food)}
                    />
                  </div>
                  <div className="food-content">
                    <h3 className="food-title">{food.name}</h3>
                    <p className="food-description">
                      {food.calories} {CALORIE_CALCULATION.CALORIES_PER_UNIT} {food.unit}
                    </p>
                    <div className="food-nutrition-info">
                      <span>{NUTRITION_LABELS.PROTEIN}: {food.protein}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                      <span>{NUTRITION_LABELS.FAT}: {food.fat}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                      <span>{NUTRITION_LABELS.CARBS}: {food.carbs}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                    </div>
                    <div className="food-actions">
                      <button className="detail-btn" onClick={() => openModal(food)}>
                        {CALORIE_CALCULATION.VIEW_DETAILS}
                      </button>
                      <button
                        className="add-to-calorie-btn"
                        onClick={() => onAddToCalorie(food)}
                      >
                        {CALORIE_CALCULATION.ADD_TO_CALORIE}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-recommendations">
                {bmi ? BMI.NO_RECOMMENDATIONS : BMI.CALCULATE_FIRST}
              </div>
            )}
          </div>
        )}
      </div>

      {pendingFoods.length > 0 && (
        <div className="calorie-calculation-section">
          <div className="calorie-calculation-header">
            <h3>{CALORIE_CALCULATION.TITLE}</h3>
            <span className="total-calories">{(totalCalories || 0).toFixed(1)} {CALORIE_CALCULATION.TOTAL_CALORIES}</span>
          </div>
          <div className="selected-foods-list">
            {pendingFoods.map(food => (
              <div key={food.id} className="selected-food-item">
                <div className="selected-food-info">
                  <h4>{food.name}</h4>
                  <p>{food.calories} {CALORIE_CALCULATION.CALORIES_UNIT} {CALORIE_CALCULATION.CALORIES_PER_UNIT} {food.unit}</p>
                </div>
                <div className="selected-food-controls">
                  <div className="selected-food-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(food.id, Math.max(1, food.quantity - 1))}
                      disabled={food.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={food.quantity}
                      onChange={(_e) => {
                        const newQuantity = parseInt(_e.target.value) || 1;
                        onUpdateQuantity(food.id, Math.max(1, newQuantity));
                      }}
                      onBlur={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        onUpdateQuantity(food.id, Math.max(1, newQuantity));
                      }}
                      className="quantity-input"
                    />
                    <span className="quantity-unit">{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(food.id, food.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="selected-food-calories">
                    {(food.calories * food.quantity).toFixed(1)} {CALORIE_CALCULATION.CALORIES_UNIT}
                  </div>
                  <button
                    className="remove-food-btn"
                    onClick={() => onRemoveFood(food.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food Modal */}
      {modalOpen && selectedFood && (
        <div className="food-modal-overlay" onClick={closeModal}>
          <div className="food-modal-outer" onClick={_e => _e.stopPropagation()}>
            <div className="food-modal">
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              <div className="food-modal-img-large">
                <img
                  src={getFoodImageUrl(selectedFood) || getFallbackImage(selectedFood.category_id)}
                  alt={selectedFood.name}
                  className="food-modal-image"
                  onError={(_e) => handleImageError(_e, selectedFood)}
                />
              </div>
              <h3 className="food-title">{selectedFood.name}</h3>
              <p className="food-description">
                Category: {categories.find(cat => cat.id === selectedFood.category_id)?.name || 'Unknown'}
              </p>
              <div className="food-nutrition-details">
                <div className="nutrition-item">
                  <strong>{NUTRITION_LABELS.CALORIES}:</strong>
                  <span className="nutrition-value">{selectedFood.calories} {CALORIE_CALCULATION.CALORIES_UNIT} {CALORIE_CALCULATION.CALORIES_PER_UNIT} {selectedFood.unit}</span>
                </div>
                <div className="nutrition-item">
                  <strong>{NUTRITION_LABELS.PROTEIN}:</strong>
                  <span className="nutrition-value">{selectedFood.protein}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                </div>
                <div className="nutrition-item">
                  <strong>{NUTRITION_LABELS.FAT}:</strong>
                  <span className="nutrition-value">{selectedFood.fat}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                </div>
                <div className="nutrition-item">
                  <strong>{NUTRITION_LABELS.CARBOHYDRATES}:</strong>
                  <span className="nutrition-value">{selectedFood.carbs}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                </div>
                {selectedFood.fiber && (
                  <div className="nutrition-item">
                    <strong>{NUTRITION_LABELS.FIBER}:</strong>
                    <span className="nutrition-value">{selectedFood.fiber}{CALORIE_CALCULATION.GRAMS_UNIT}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodRecommendations;
