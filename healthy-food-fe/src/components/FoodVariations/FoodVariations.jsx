import React from 'react';
import { useFoodContext } from '../../context/FoodContext';
import { X, Info, Star } from 'lucide-react';
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
            <p className="food-variations-subtitle">Các loại và biến thể</p>
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
                <span className="nutrition-label">Protein:</span>
                <span className="nutrition-value">{selectedFood.protein || 0}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs:</span>
                <span className="nutrition-value">{selectedFood.carbs || 0}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat:</span>
                <span className="nutrition-value">{selectedFood.fat || 0}g</span>
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
                Thêm vào yêu thích
              </button>
              <button className="food-variation-btn secondary" onClick={closeFoodDetail}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodVariations;
