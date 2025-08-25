import React from 'react';
import { 
  BMI, 
  BMI_CATEGORY_CLASSES, 
  BMI_RANGE_LABELS, 
  BMI_RANGE_VALUES,
  BMI_RANGES,
  BMI_CATEGORIES
} from '../../../../constants';
import './BMICalculator.css';

const BMICalculator = ({
  height,
  weight,
  bmi,
  bmiLoading,
  onHeightChange,
  onWeightChange,
  onCalculate
}) => {
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

  const handleWheel = (e) => {
    if (document.activeElement === e.target) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="body-index-form-section">
      <div className="body-index-form-row">
        <div className="body-index-form-inputs">
          {bmiLoading && (
            <div className="bmi-loading">
              {BMI.LOADING_TEXT}
            </div>
          )}
          
          <div className="body-index-input-row">
            <div className="body-index-form-group">
              <label className="body-index-label">{BMI.HEIGHT_LABEL}</label>
              <input
                type="number"
                value={height}
                onChange={onHeightChange}
                placeholder={BMI.HEIGHT_PLACEHOLDER}
                className="body-index-input"
                onWheelCapture={handleWheel}
              />
            </div>
            
            <div className="body-index-form-group">
              <label className="body-index-label">{BMI.WEIGHT_LABEL}</label>
              <input
                type="number"
                value={weight}
                onChange={onWeightChange}
                placeholder={BMI.WEIGHT_PLACEHOLDER}
                className="body-index-input"
                onWheelCapture={handleWheel}
              />
            </div>
          </div>
          
          <div className="body-index-form-group">
            <button
              className="body-index-calc-btn"
              onClick={onCalculate}
              disabled={!height || !weight}
            >
              {BMI.CALCULATE_BUTTON}
            </button>
          </div>
        </div>
        
        {bmi && (
          <div className={`bmi-results-container result-${getBMICategoryClass(bmi)}`}>
            <div className="bmi-value-display">
              <div 
                className={`bmi-number bmi-number-${getBMICategoryClass(bmi)}`}
              >
                {bmi}
              </div>
              <div 
                className={`bmi-category bmi-category-${getBMICategoryClass(bmi)}`}
              >
                {getBMICategory(bmi)}
              </div>
            </div>
            
            <div className="bmi-info">
              {BMI.INFO_TEXT}
            </div>
            
            <div className="bmi-ranges">
              <div className="bmi-range bmi-range-underweight">
                <div className="bmi-range-indicator"></div>
                <div className="bmi-range-label">{BMI_RANGE_LABELS.UNDERWEIGHT}</div>
                <div className="bmi-range-value">{BMI_RANGE_VALUES.UNDERWEIGHT}</div>
              </div>
              <div className="bmi-range bmi-range-normal">
                <div className="bmi-range-indicator"></div>
                <div className="bmi-range-label">{BMI_RANGE_LABELS.NORMAL}</div>
                <div className="bmi-range-value">{BMI_RANGE_VALUES.NORMAL}</div>
              </div>
              <div className="bmi-range bmi-range-overweight">
                <div className="bmi-range-indicator"></div>
                <div className="bmi-range-label">{BMI_RANGE_LABELS.OVERWEIGHT}</div>
                <div className="bmi-range-value">{BMI_RANGE_VALUES.OVERWEIGHT}</div>
              </div>
              <div className="bmi-range bmi-range-obese">
                <div className="bmi-range-indicator"></div>
                <div className="bmi-range-label">{BMI_RANGE_LABELS.OBESE}</div>
                <div className="bmi-range-value">{BMI_RANGE_VALUES.OBESE}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator; 