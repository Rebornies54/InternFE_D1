import React from 'react';
import CheckboxOption from '../CheckboxOption';
import { CALORIE_CALCULATOR, VALIDATION } from '../../../../constants';
import './CalculatorForm.css';

const CalculatorForm = ({
  calorieData,
  updateCalorieData,
  error,
  onCalculate,
  onReset,
  onUnitChange,
  onToggleHistory,
  showHistory
}) => {
  const getHeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? CALORIE_CALCULATOR.UNITS.CM : CALORIE_CALCULATOR.UNITS.IN;
  };

  const getWeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? CALORIE_CALCULATOR.UNITS.KG : CALORIE_CALCULATOR.UNITS.LB;
  };

  return (
    <div className="calculator-card">
      <form className="calculator-form">
        {/* Unit system selector */}
        <div className="unit-system-selector">
          <label>{CALORIE_CALCULATOR.LABELS.UNIT_SYSTEM}</label>
          <div className="unit-buttons">
            <button 
              type="button" 
              className={`unit-btn ${calorieData.unitSystem === 'metric' ? 'active' : ''}`}
              onClick={() => onUnitChange('metric')}
            >
              {CALORIE_CALCULATOR.BUTTONS.METRIC}
            </button>
            <button 
              type="button" 
              className={`unit-btn ${calorieData.unitSystem === 'imperial' ? 'active' : ''}`}
              onClick={() => onUnitChange('imperial')}
            >
              {CALORIE_CALCULATOR.BUTTONS.IMPERIAL}
            </button>
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="age">{CALORIE_CALCULATOR.LABELS.AGE}</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="age" 
                value={calorieData.age}
                onChange={(e) => updateCalorieData({ age: e.target.value })}
                min={VALIDATION.MIN_AGE}
                max={VALIDATION.MAX_AGE}
              />
              <span className="unit-label">{CALORIE_CALCULATOR.UNITS.YEARS}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="height">{CALORIE_CALCULATOR.LABELS.HEIGHT}</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="height" 
                value={calorieData.height}
                onChange={(e) => updateCalorieData({ height: e.target.value })}
                min={VALIDATION.MIN_HEIGHT}
              />
              <span className="unit-label">{getHeightUnitLabel()}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">{CALORIE_CALCULATOR.LABELS.WEIGHT}</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="weight" 
                value={calorieData.weight}
                onChange={(e) => updateCalorieData({ weight: e.target.value })}
                min={VALIDATION.MIN_WEIGHT}
              />
              <span className="unit-label">{getWeightUnitLabel()}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>{CALORIE_CALCULATOR.LABELS.GENDER}</label>
            <div className="gender-options">
              <CheckboxOption
                id="gender-female"
                name="gender"
                value="Female"
                checked={calorieData.gender === 'Female'}
                onChange={() => updateCalorieData({ gender: 'Female' })}
                label={CALORIE_CALCULATOR.BUTTONS.FEMALE}
              />
              <CheckboxOption
                id="gender-male"
                name="gender"
                value="Male"
                checked={calorieData.gender === 'Male'}
                onChange={() => updateCalorieData({ gender: 'Male' })}
                label={CALORIE_CALCULATOR.BUTTONS.MALE}
              />
            </div>
          </div>
        </div>
        
        {/* Formula selection */}
        <div className="form-group formula-group">
          <label>{CALORIE_CALCULATOR.LABELS.BMR_FORMULA}</label>
          <div className="formula-options">
            <CheckboxOption
              id="formula-mifflin"
              name="formula"
              value={CALORIE_CALCULATOR.FORMULAS.MIFFLIN.VALUE}
              checked={calorieData.formula === CALORIE_CALCULATOR.FORMULAS.MIFFLIN.VALUE}
              onChange={() => updateCalorieData({ formula: CALORIE_CALCULATOR.FORMULAS.MIFFLIN.VALUE })}
              label={CALORIE_CALCULATOR.FORMULAS.MIFFLIN.LABEL}
              description={CALORIE_CALCULATOR.FORMULAS.MIFFLIN.DESCRIPTION}
            />
            <CheckboxOption
              id="formula-harris"
              name="formula"
              value={CALORIE_CALCULATOR.FORMULAS.HARRIS.VALUE}
              checked={calorieData.formula === CALORIE_CALCULATOR.FORMULAS.HARRIS.VALUE}
              onChange={() => updateCalorieData({ formula: CALORIE_CALCULATOR.FORMULAS.HARRIS.VALUE })}
              label={CALORIE_CALCULATOR.FORMULAS.HARRIS.LABEL}
              description={CALORIE_CALCULATOR.FORMULAS.HARRIS.DESCRIPTION}
            />
            <CheckboxOption
              id="formula-katch"
              name="formula"
              value={CALORIE_CALCULATOR.FORMULAS.KATCH.VALUE}
              checked={calorieData.formula === CALORIE_CALCULATOR.FORMULAS.KATCH.VALUE}
              onChange={() => updateCalorieData({ formula: CALORIE_CALCULATOR.FORMULAS.KATCH.VALUE })}
              label={CALORIE_CALCULATOR.FORMULAS.KATCH.LABEL}
              description={CALORIE_CALCULATOR.FORMULAS.KATCH.DESCRIPTION}
            />
          </div>
        </div>
        
        {/* Body Fat Percentage (only show when Katch-McArdle is selected) */}
        {calorieData.formula === CALORIE_CALCULATOR.FORMULAS.KATCH.VALUE && (
          <div className="form-group body-fat-group">
            <label htmlFor="bodyFat">{CALORIE_CALCULATOR.LABELS.BODY_FAT}</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="bodyFat" 
                value={calorieData.bodyFat}
                onChange={(e) => updateCalorieData({ bodyFat: e.target.value })}
                min="1"
                max="70"
              />
              <span className="unit-label">{CALORIE_CALCULATOR.UNITS.PERCENT}</span>
            </div>
          </div>
        )}
        
        <div className="form-group activity-group">
          <label htmlFor="activity">{CALORIE_CALCULATOR.LABELS.ACTIVITY_LEVEL}</label>
          <div className="select-wrapper">
            <select 
              id="activity"
              value={calorieData.activityLevel}
              onChange={(e) => updateCalorieData({ activityLevel: e.target.value })}
              className="activity-select">
              <option value="">{CALORIE_CALCULATOR.LABELS.SELECT_ACTIVITY}</option>
              {CALORIE_CALCULATOR.ACTIVITY_LEVELS.map((level, index) => (
                <option key={index} value={level.VALUE}>
                  {level.LABEL}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="button-group">
          <button type="button" onClick={onCalculate} className="calculate-btn">
            {CALORIE_CALCULATOR.LABELS.CALCULATE}
          </button>
          <button type="button" onClick={onReset} className="reset-btn">
            {CALORIE_CALCULATOR.LABELS.RESET}
          </button>
          <button 
            type="button" 
            onClick={onToggleHistory} 
            className="history-btn"
          >
            {showHistory ? CALORIE_CALCULATOR.LABELS.HIDE_HISTORY : CALORIE_CALCULATOR.LABELS.SHOW_HISTORY}
          </button>
        </div>
        
        <div className="calculator-note">
          <p>
            {CALORIE_CALCULATOR.MESSAGES.FORMULA_NOTE(
              calorieData.formula === CALORIE_CALCULATOR.FORMULAS.MIFFLIN.VALUE 
                ? CALORIE_CALCULATOR.FORMULAS.MIFFLIN.LABEL 
                : calorieData.formula === CALORIE_CALCULATOR.FORMULAS.HARRIS.VALUE 
                  ? CALORIE_CALCULATOR.FORMULAS.HARRIS.LABEL 
                  : CALORIE_CALCULATOR.FORMULAS.KATCH.LABEL
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default CalculatorForm;
