import React, { useState } from 'react';
import { useCalorieContext } from '../../context/CalorieContext';
import CheckboxOption from './CheckboxOption';
import { VALIDATION, UI_TEXT } from '../../constants';
import './CalorieIndex.css';

const CalorieIndex = () => {
  const {
    calorieData,
    updateCalorieData,
    resetCalorieData,
    performCalculation,
    getCalorieGoals,
    convertUnits
  } = useCalorieContext();

  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!calorieData.age || calorieData.age < VALIDATION.MIN_AGE || calorieData.age > VALIDATION.MAX_AGE) {
      setError(`${UI_TEXT.VALID_AGE_ERROR} ${VALIDATION.MIN_AGE} ${UI_TEXT.AND_TEXT} ${VALIDATION.MAX_AGE}`);
      return;
    }
    
    if (!calorieData.height || calorieData.height <= 0) {
      setError(UI_TEXT.VALID_HEIGHT_ERROR);
      return;
    }
    
    if (!calorieData.weight || calorieData.weight <= 0) {
      setError(UI_TEXT.VALID_WEIGHT_ERROR);
      return;
    }
    
    if (calorieData.formula === 'katch' && (!calorieData.bodyFat || isNaN(parseFloat(calorieData.bodyFat)))) {
      setError(UI_TEXT.BODY_FAT_REQUIRED_ERROR);
      return;
    }
    
    const result = performCalculation();
    if (!result.success) {
      setError(result.message);
      return;
    }
  };

  const handleReset = () => {
    resetCalorieData();
    setError('');
  };

  const handleUnitChange = (unitSystem) => {
    convertUnits(unitSystem);
  };

  const calorieGoals = calorieData.tdee > 0 ? getCalorieGoals(calorieData.tdee) : null;

  // Get height unit label based on unit system
  const getHeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? UI_TEXT.CM_LABEL : UI_TEXT.IN_LABEL;
  };

  // Get weight unit label based on unit system
  const getWeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? UI_TEXT.KG_LABEL : UI_TEXT.LB_LABEL;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="calorie-calculator-container">
      <h1 className="calculator-title">{UI_TEXT.DAILY_CALORIE_NEEDS_CALCULATOR}</h1>
      
      <div className="calculator-card">
        <form className="calculator-form">
          {/* Unit system selector */}
          <div className="unit-system-selector">
            <label>{UI_TEXT.UNIT_SYSTEM_LABEL}</label>
            <div className="unit-buttons">
              <button 
                type="button" 
                className={`unit-btn ${calorieData.unitSystem === 'metric' ? 'active' : ''}`}
                onClick={() => handleUnitChange('metric')}
              >
                {UI_TEXT.METRIC_LABEL}
              </button>
              <button 
                type="button" 
                className={`unit-btn ${calorieData.unitSystem === 'imperial' ? 'active' : ''}`}
                onClick={() => handleUnitChange('imperial')}
              >
                {UI_TEXT.IMPERIAL_LABEL}
              </button>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="age">{UI_TEXT.AGE_LABEL}</label>
              <div className="input-unit-group">
                <input 
                  type="number" 
                  id="age" 
                  value={calorieData.age}
                  onChange={(e) => updateCalorieData({ age: e.target.value })}
                  min="15"
                  max="80"
                />
                <span className="unit-label">{UI_TEXT.YEARS_LABEL}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="height">{UI_TEXT.HEIGHT_LABEL}</label>
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
              <label htmlFor="weight">{UI_TEXT.WEIGHT_LABEL}</label>
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
              <label>{UI_TEXT.GENDER_LABEL}</label>
              <div className="gender-options">
                <CheckboxOption
                  id="gender-female"
                  name="gender"
                  value="Female"
                  checked={calorieData.gender === 'Female'}
                  onChange={() => updateCalorieData({ gender: 'Female' })}
                  label={UI_TEXT.FEMALE_LABEL}
                />
                <CheckboxOption
                  id="gender-male"
                  name="gender"
                  value="Male"
                  checked={calorieData.gender === 'Male'}
                  onChange={() => updateCalorieData({ gender: 'Male' })}
                  label={UI_TEXT.MALE_LABEL}
                />
              </div>
            </div>
          </div>
          
          {/* Formula selection */}
          <div className="form-group formula-group">
            <label>{UI_TEXT.BMR_FORMULA_LABEL}</label>
            <div className="formula-options">
              <CheckboxOption
                id="formula-mifflin"
                name="formula"
                value="mifflin"
                checked={calorieData.formula === 'mifflin'}
                onChange={() => updateCalorieData({ formula: 'mifflin' })}
                label={UI_TEXT.MIFFLIN_ST_JEOR}
                description={UI_TEXT.MOST_ACCURATE_DESCRIPTION}
              />
              <CheckboxOption
                id="formula-harris"
                name="formula"
                value="harris"
                checked={calorieData.formula === 'harris'}
                onChange={() => updateCalorieData({ formula: 'harris' })}
                label={UI_TEXT.HARRIS_BENEDICT}
                description={UI_TEXT.TRADITIONAL_FORMULA_DESCRIPTION}
              />
              <CheckboxOption
                id="formula-katch"
                name="formula"
                value="katch"
                checked={calorieData.formula === 'katch'}
                onChange={() => updateCalorieData({ formula: 'katch' })}
                label={UI_TEXT.KATCH_MCARDLE}
                description={UI_TEXT.REQUIRES_BODY_FAT_DESCRIPTION}
              />
            </div>
          </div>
          
          {/* Body Fat Percentage (only show when Katch-McArdle is selected) */}
          {calorieData.formula === 'katch' && (
            <div className="form-group body-fat-group">
              <label htmlFor="bodyFat">{UI_TEXT.BODY_FAT_PERCENTAGE}</label>
              <div className="input-unit-group">
                <input 
                  type="number" 
                  id="bodyFat" 
                  value={calorieData.bodyFat}
                  onChange={(e) => updateCalorieData({ bodyFat: e.target.value })}
                  min="1"
                  max="70"
                />
                <span className="unit-label">{UI_TEXT.PERCENT_SYMBOL_CALORIE}</span>
              </div>
            </div>
          )}
          
          <div className="form-group activity-group">
            <label htmlFor="activity">{UI_TEXT.ACTIVITY_LEVEL_LABEL}</label>
            <div className="select-wrapper">
              <select 
                id="activity"
                value={calorieData.activityLevel}
                onChange={(e) => updateCalorieData({ activityLevel: e.target.value })}
                className="activity-select">
                <option value="">{UI_TEXT.SELECT_ACTIVITY_LEVEL}</option>
                <option value="Sedentary: Little or no exercise">{UI_TEXT.SEDENTARY_OPTION}</option>
                <option value="Lightly active: 1-3 times/week">{UI_TEXT.LIGHTLY_ACTIVE_OPTION}</option>
                <option value="Moderately active: 4-5 times/week">{UI_TEXT.MODERATELY_ACTIVE_OPTION}</option>
                <option value="Very active: 6 times/week or more">{UI_TEXT.VERY_ACTIVE_OPTION}</option>
                <option value="Extra active: Physical job or twice daily training">{UI_TEXT.EXTRA_ACTIVE_OPTION}</option>
                <option value="Professional athlete">{UI_TEXT.PROFESSIONAL_ATHLETE_OPTION}</option>
              </select>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button type="button" onClick={handleCalculate} className="calculate-btn">{UI_TEXT.CALCULATE_BUTTON}</button>
            <button type="button" onClick={handleReset} className="reset-btn">{UI_TEXT.RESET_BUTTON}</button>
            <button 
              type="button" 
              onClick={() => setShowHistory(!showHistory)} 
              className="history-btn"
            >
              {showHistory ? UI_TEXT.HIDE_HISTORY : UI_TEXT.SHOW_HISTORY}
            </button>
          </div>
          
          <div className="calculator-note">
            <p>{UI_TEXT.CALCULATOR_USES_FORMULA} {calorieData.formula === 'mifflin' ? UI_TEXT.MIFFLIN_ST_JEOR : calorieData.formula === 'harris' ? UI_TEXT.HARRIS_BENEDICT : UI_TEXT.KATCH_MCARDLE} {UI_TEXT.FORMULA_FOR_BMR_CALCULATION}</p>
          </div>
        </form>
      </div>
      
      {/* Calculation History */}
      {showHistory && calorieData.history && calorieData.history.length > 0 && (
        <div className="history-container">
                  <div className="history-card">
          <h3 className="history-title">{UI_TEXT.CALCULATION_HISTORY}</h3>
          <div className="history-items">
            {calorieData.history.map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{formatDate(entry.date)}</div>
                <div className="history-details">
                  <span>{UI_TEXT.WEIGHT_LABEL_HISTORY} {entry.weight}{getWeightUnitLabel()}</span>
                  <span>{UI_TEXT.BMR_LABEL_HISTORY} {entry.bmr} {UI_TEXT.CALORIES_LABEL_CALORIE}</span>
                  <span>{UI_TEXT.TDEE_LABEL_HISTORY} {entry.tdee} {UI_TEXT.CALORIES_LABEL_CALORIE}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
      
      {calorieData.showResults && calorieGoals && (
        <div className="results-container">
          <div className="results-card">
            <div className="total-calories">
              <h2>{UI_TEXT.YOUR_METABOLIC_INFORMATION}</h2>
              <div className="metabolic-info">
                <div className="metabolic-item">
                  <div className="metabolic-label">{UI_TEXT.BMR_BASAL_METABOLIC_RATE}</div>
                  <div className="metabolic-value">{calorieData.bmr} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                </div>
                <div className="metabolic-item">
                  <div className="metabolic-label">{UI_TEXT.TDEE_TOTAL_DAILY_ENERGY}</div>
                  <div className="calorie-value">{calorieGoals.maintenance} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                </div>
              </div>
              <p>{UI_TEXT.TDEE_EXPLANATION}</p>
              {calorieData.calculatedDate && (
                <p className="calculation-date">
                  {UI_TEXT.CALCULATED_ON} {formatDate(calorieData.calculatedDate)}
                </p>
              )}
            </div>
            
            <div className="weight-scenarios">
              <h3 className="scenarios-title">{UI_TEXT.WEIGHT_MANAGEMENT_GOALS}</h3>    
              <div className="scenario-grid">
                <div className="scenario-column weight-loss">
                  <h4>{UI_TEXT.WEIGHT_LOSS}</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.MILD_LABEL} (0.25 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.mild} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.MODERATE_LABEL} (0.5 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.moderate} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.AGGRESSIVE_LABEL} (1 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.aggressive} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                </div>
                
                <div className="scenario-column weight-gain">
                  <h4>{UI_TEXT.WEIGHT_GAIN}</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.MILD_LABEL} (0.25 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightGain.mild} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.MODERATE_LABEL} (0.5 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightGain.moderate} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">{UI_TEXT.AGGRESSIVE_LABEL} (1 {UI_TEXT.KG_PER_WEEK})</div>
                    <div className="scenario-value">{calorieGoals.weightGain.aggressive} {UI_TEXT.CALORIES_LABEL_CALORIE}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bmr-explanation">
              <h4>{UI_TEXT.ABOUT_BMR_AND_TDEE}</h4>
              <p>
                {UI_TEXT.BMR_EXPLANATION}
              </p>
              <p>
                {UI_TEXT.TDEE_EXPLANATION_2}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieIndex;