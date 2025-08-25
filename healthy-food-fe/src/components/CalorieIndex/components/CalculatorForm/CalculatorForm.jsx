import React from 'react';
import CheckboxOption from '../CheckboxOption';
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
  // Get height unit label based on unit system
  const getHeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? 'cm' : 'in';
  };

  // Get weight unit label based on unit system
  const getWeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? 'kg' : 'lb';
  };

  return (
    <div className="calculator-card">
      <form className="calculator-form">
        {/* Unit system selector */}
        <div className="unit-system-selector">
          <label>Unit System:</label>
          <div className="unit-buttons">
            <button 
              type="button" 
              className={`unit-btn ${calorieData.unitSystem === 'metric' ? 'active' : ''}`}
              onClick={() => onUnitChange('metric')}
            >
              Metric
            </button>
            <button 
              type="button" 
              className={`unit-btn ${calorieData.unitSystem === 'imperial' ? 'active' : ''}`}
              onClick={() => onUnitChange('imperial')}
            >
              Imperial
            </button>
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="age" 
                value={calorieData.age}
                onChange={(e) => updateCalorieData({ age: e.target.value })}
                min="15"
                max="80"
              />
              <span className="unit-label">years</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="height" 
                value={calorieData.height}
                onChange={(e) => updateCalorieData({ height: e.target.value })}
                min="1"
              />
              <span className="unit-label">{getHeightUnitLabel()}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="weight" 
                value={calorieData.weight}
                onChange={(e) => updateCalorieData({ weight: e.target.value })}
                min="1"
              />
              <span className="unit-label">{getWeightUnitLabel()}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <div className="gender-options">
              <CheckboxOption
                id="gender-female"
                name="gender"
                value="Female"
                checked={calorieData.gender === 'Female'}
                onChange={() => updateCalorieData({ gender: 'Female' })}
                label="Female"
              />
              <CheckboxOption
                id="gender-male"
                name="gender"
                value="Male"
                checked={calorieData.gender === 'Male'}
                onChange={() => updateCalorieData({ gender: 'Male' })}
                label="Male"
              />
            </div>
          </div>
        </div>
        
        {/* Formula selection */}
        <div className="form-group formula-group">
          <label>BMR Formula</label>
          <div className="formula-options">
            <CheckboxOption
              id="formula-mifflin"
              name="formula"
              value="mifflin"
              checked={calorieData.formula === 'mifflin'}
              onChange={() => updateCalorieData({ formula: 'mifflin' })}
              label="Mifflin-St Jeor"
              description="Most accurate for most people"
            />
            <CheckboxOption
              id="formula-harris"
              name="formula"
              value="harris"
              checked={calorieData.formula === 'harris'}
              onChange={() => updateCalorieData({ formula: 'harris' })}
              label="Harris-Benedict"
              description="Traditional formula, slightly less accurate"
            />
            <CheckboxOption
              id="formula-katch"
              name="formula"
              value="katch"
              checked={calorieData.formula === 'katch'}
              onChange={() => updateCalorieData({ formula: 'katch' })}
              label="Katch-McArdle"
              description="Requires body fat percentage"
            />
          </div>
        </div>
        
        {/* Body Fat Percentage (only show when Katch-McArdle is selected) */}
        {calorieData.formula === 'katch' && (
          <div className="form-group body-fat-group">
            <label htmlFor="bodyFat">Body Fat Percentage</label>
            <div className="input-unit-group">
              <input 
                type="number" 
                id="bodyFat" 
                value={calorieData.bodyFat}
                onChange={(e) => updateCalorieData({ bodyFat: e.target.value })}
                min="1"
                max="70"
              />
              <span className="unit-label">%</span>
            </div>
          </div>
        )}
        
        <div className="form-group activity-group">
          <label htmlFor="activity">Activity Level</label>
          <div className="select-wrapper">
            <select 
              id="activity"
              value={calorieData.activityLevel}
              onChange={(e) => updateCalorieData({ activityLevel: e.target.value })}
              className="activity-select">
              <option value="">Select activity level</option>
              <option value="Sedentary: Little or no exercise">Sedentary: Little or no exercise</option>
              <option value="Lightly active: 1-3 times/week">Lightly active: 1-3 times/week</option>
              <option value="Moderately active: 4-5 times/week">Moderately active: 4-5 times/week</option>
              <option value="Very active: 6 times/week or more">Very active: 6 times/week or more</option>
              <option value="Extra active: Physical job or twice daily training">Extra active: Physical job or twice daily training</option>
              <option value="Professional athlete">Professional athlete</option>
            </select>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="button-group">
          <button type="button" onClick={onCalculate} className="calculate-btn">Calculate</button>
          <button type="button" onClick={onReset} className="reset-btn">Reset</button>
          <button 
            type="button" 
            onClick={onToggleHistory} 
            className="history-btn"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
        
        <div className="calculator-note">
          <p>This calculator uses the {calorieData.formula === 'mifflin' ? 'Mifflin-St Jeor' : calorieData.formula === 'harris' ? 'Harris-Benedict' : 'Katch-McArdle'} formula for BMR calculation.</p>
        </div>
      </form>
    </div>
  );
};

export default CalculatorForm;
