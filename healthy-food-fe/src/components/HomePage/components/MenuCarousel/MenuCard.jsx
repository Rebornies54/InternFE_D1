import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UI_TEXT } from '../../../../constants';

const MenuCard = ({ item, isActive, onCardClick }) => {
  return (
    <div 
      className={`menu-carousel-card ${isActive ? 'active' : ''}`}
    >
      <div className="menu-card-image">
        {item.image && item.image.trim() !== '' && (
          <img src={item.image} alt={item.title} />
        )}
        <div className="meal-label">{item.meal}</div>
      </div>
      <div className="menu-card-content">
        <h3 className="menu-card-title">{item.title}</h3>
        <span className="menu-card-calories">{item.calories}</span>
        <div className="menu-card-nutrition">
          <div className="nutrition-item">
            <span className="nutrition-label">{UI_TEXT.NUTRITION_PROTEIN}</span>
            <span className="nutrition-value">{item.nutrition.protein}</span>
          </div>
          <div className="nutrition-item">
            <span className="nutrition-label">{UI_TEXT.NUTRITION_CARBS}</span>
            <span className="nutrition-value">{item.nutrition.carbs}</span>
          </div>
          <div className="nutrition-item">
            <span className="nutrition-label">{UI_TEXT.NUTRITION_FATS}</span>
            <span className="nutrition-value">{item.nutrition.fats}</span>
          </div>
        </div>
        <p className="menu-card-description">{item.description}</p>
        <button 
          onClick={onCardClick}
          className="menu-card-link"
        >
          {UI_TEXT.MENU_CARD_DETAILS} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
