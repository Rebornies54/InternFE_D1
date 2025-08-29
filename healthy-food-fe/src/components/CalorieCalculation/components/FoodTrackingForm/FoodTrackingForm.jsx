import React from 'react';
import { FOOD_TRACKING_FORM } from '../../../../constants';
import DatePicker from '../../../DatePicker';
import './FoodTrackingForm.css';

const FoodTrackingForm = ({
  pendingFoods,
  selectedDate,
  selectedFood,
  quantity,
  foodItems,
  loading,
  onDateChange,
  onFoodChange,
  onQuantityChange,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddFood,
  onRemovePendingFood,
  onUpdatePendingFoodQuantity,
  onAddPendingFoodsToTracking,
  onClearPendingFoods,
  getPendingTotalCalories,
  calculateCalories
}) => {
  const getFoodOptions = () => {
    return foodItems.map(food => ({
      value: food.id,
      label: food.name
    }));
  };

  return (
    <div className="food-tracking-form-wrapper">
      {/* Pending Foods Section */}
      {pendingFoods.length > 0 && (
        <div className="pending-foods-section">
          <div className="section-header">
            <h2 className="section-title">
              {FOOD_TRACKING_FORM.SECTIONS.PENDING_FOODS} ({pendingFoods.length})
            </h2>
          </div>

          <div className="pending-foods-list">
            {pendingFoods.map((food, index) => (
              <div key={index} className="pending-food-item">
                <div className="food-info">
                  <span className="food-name">{food.name}</span>
                  <span className="food-calories">{food.calories} cal</span>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn decrease"
                    onClick={() => onUpdatePendingFoodQuantity(index, Math.max(0, food.quantity - 10))}
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="quantity-display">{food.quantity}g</span>
                  <button
                    className="quantity-btn increase"
                    onClick={() => onUpdatePendingFoodQuantity(index, food.quantity + 10)}
                    disabled={loading}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onRemovePendingFood(index)}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pending-actions">
            <div className="total-calories">
              <span>{FOOD_TRACKING_FORM.MESSAGES.TOTAL_CALORIES} {getPendingTotalCalories()} {FOOD_TRACKING_FORM.MESSAGES.CALORIES_UNIT}</span>
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={onAddPendingFoodsToTracking}
                disabled={loading || pendingFoods.length === 0}
              >
                {loading ? 'Đang thêm...' : FOOD_TRACKING_FORM.BUTTONS.ADD_ALL}
              </button>
              <button
                className="btn btn-secondary"
                onClick={onClearPendingFoods}
                disabled={loading || pendingFoods.length === 0}
              >
                {FOOD_TRACKING_FORM.BUTTONS.CLEAR_ALL}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Food Form */}
      <div className="add-food-form-section">
        <div className="section-header">
          <h2 className="section-title">
            {FOOD_TRACKING_FORM.SECTIONS.ADD_FOOD}
          </h2>
        </div>

        <form className="add-food-form" onSubmit={(e) => {
          e.preventDefault();
          onAddFood();
        }}>
          <div className="form-row">
            {/* Date Picker */}
            <div className="form-group date-group">
              <label htmlFor="date-picker">{FOOD_TRACKING_FORM.LABELS.DATE}</label>
              <DatePicker
                value={selectedDate}
                onChange={onDateChange}
                disabled={loading}
              />
            </div>

            {/* Food Selection */}
            <div className="form-group food-group">
              <label htmlFor="food-select">{FOOD_TRACKING_FORM.LABELS.FOOD}</label>
              <select
                id="food-select"
                className="food-select"
                value={selectedFood}
                onChange={(e) => onFoodChange(e.target.value)}
                disabled={loading || foodItems.length === 0}
              >
                <option value="">{FOOD_TRACKING_FORM.PLACEHOLDERS.FOOD}</option>
                {getFoodOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div className="form-group quantity-group">
              <label htmlFor="quantity-input">{FOOD_TRACKING_FORM.LABELS.QUANTITY}</label>
              <div className="quantity-input-wrapper">
                <button
                  type="button"
                  className="quantity-btn decrease"
                  onClick={onDecreaseQuantity}
                  disabled={loading || quantity <= 10}
                >
                  -
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
                  min="0"
                  max="10000"
                  step="10"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="quantity-btn increase"
                  onClick={onIncreaseQuantity}
                  disabled={loading || quantity >= 10000}
                >
                  +
                </button>
              </div>
            </div>

            {/* Calories Display */}
            <div className="form-group calories-group">
              <label>{FOOD_TRACKING_FORM.LABELS.CALORIES}</label>
              <div className="calories-display">
                <span className="calories-value">
                  {selectedFood ? calculateCalories(selectedFood, quantity) : 0}
                </span>
                <span className="calories-unit">cal</span>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary add-btn"
              disabled={loading || !selectedFood || quantity <= 0}
            >
              {loading ? 'Đang thêm...' : FOOD_TRACKING_FORM.BUTTONS.ADD_FOOD}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodTrackingForm;
