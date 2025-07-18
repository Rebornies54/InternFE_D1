import React, { useState } from 'react';
import { useCalorieContext } from '../../context/CalorieContext';
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
    if (!calorieData.age || calorieData.age < 15 || calorieData.age > 80) {
      setError('Please enter a valid age between 15 and 80');
      return;
    }
    
    if (!calorieData.height || calorieData.height <= 0) {
      setError('Please enter a valid height');
      return;
    }
    
    if (!calorieData.weight || calorieData.weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    
    if (calorieData.formula === 'katch' && (!calorieData.bodyFat || isNaN(parseFloat(calorieData.bodyFat)))) {
      setError('Body fat percentage is required for Katch-McArdle formula');
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
    return calorieData.unitSystem === 'metric' ? 'cm' : 'in';
  };

  // Get weight unit label based on unit system
  const getWeightUnitLabel = () => {
    return calorieData.unitSystem === 'metric' ? 'kg' : 'lb';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="calorie-calculator-container">
      <h1 className="calculator-title">Daily Calorie Needs Calculator</h1>
      
      <div className="calculator-card">
        <form className="calculator-form">
          {/* Unit system selector */}
          <div className="unit-system-selector">
            <label>Unit System:</label>
            <div className="unit-buttons">
              <button 
                type="button" 
                className={`unit-btn ${calorieData.unitSystem === 'metric' ? 'active' : ''}`}
                onClick={() => handleUnitChange('metric')}
              >
                Metric
              </button>
              <button 
                type="button" 
                className={`unit-btn ${calorieData.unitSystem === 'imperial' ? 'active' : ''}`}
                onClick={() => handleUnitChange('imperial')}
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
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={calorieData.gender === 'Female'}
                    onChange={() => updateCalorieData({ gender: 'Female' })}
                  />
                  <span className="radio-text">Female</span>
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={calorieData.gender === 'Male'}
                    onChange={() => updateCalorieData({ gender: 'Male' })}
                  />
                  <span className="radio-text">Male</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Formula selection */}
          <div className="form-group formula-group">
            <label>BMR Formula</label>
            <div className="formula-options">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="formula" 
                  checked={calorieData.formula === 'mifflin'}
                  onChange={() => updateCalorieData({ formula: 'mifflin' })}
                />
                <span className="radio-text">Mifflin-St Jeor</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="formula" 
                  checked={calorieData.formula === 'harris'}
                  onChange={() => updateCalorieData({ formula: 'harris' })}
                />
                <span className="radio-text">Harris-Benedict</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="formula" 
                  checked={calorieData.formula === 'katch'}
                  onChange={() => updateCalorieData({ formula: 'katch' })}
                />
                <span className="radio-text">Katch-McArdle</span>
              </label>
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
            <button type="button" onClick={handleCalculate} className="calculate-btn">Calculate</button>
            <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
            <button 
              type="button" 
              onClick={() => setShowHistory(!showHistory)} 
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
      
      {/* Calculation History */}
      {showHistory && calorieData.history && calorieData.history.length > 0 && (
        <div className="history-container">
          <div className="history-card">
            <h3 className="history-title">Calculation History</h3>
            <div className="history-items">
              {calorieData.history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">{formatDate(entry.date)}</div>
                  <div className="history-details">
                    <span>Weight: {entry.weight}{getWeightUnitLabel()}</span>
                    <span>BMR: {entry.bmr} calories</span>
                    <span>TDEE: {entry.tdee} calories</span>
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
              <h2>Your Metabolic Information</h2>
              <div className="metabolic-info">
                <div className="metabolic-item">
                  <div className="metabolic-label">BMR (Basal Metabolic Rate)</div>
                  <div className="metabolic-value">{calorieData.bmr} calories</div>
                </div>
                <div className="metabolic-item">
                  <div className="metabolic-label">TDEE (Total Daily Energy Expenditure)</div>
                  <div className="calorie-value">{calorieGoals.maintenance} calories</div>
                </div>
              </div>
              <p>Your TDEE is the estimated number of calories you burn daily with your activity level</p>
              {calorieData.calculatedDate && (
                <p className="calculation-date">
                  Calculated on: {formatDate(calorieData.calculatedDate)}
                </p>
              )}
            </div>
            
            <div className="weight-scenarios">
              <h3 className="scenarios-title">Weight Management Goals</h3>    
              <div className="scenario-grid">
                <div className="scenario-column weight-loss">
                  <h4>Weight Loss</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">Mild (0.25 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.mild} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Moderate (0.5 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.moderate} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Aggressive (1 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightLoss.aggressive} calories</div>
                  </div>
                </div>
                
                <div className="scenario-column weight-gain">
                  <h4>Weight Gain</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">Mild (0.25 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightGain.mild} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Moderate (0.5 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightGain.moderate} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Aggressive (1 kg/week)</div>
                    <div className="scenario-value">{calorieGoals.weightGain.aggressive} calories</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bmr-explanation">
              <h4>About BMR and TDEE</h4>
              <p>
                The Basal Metabolic Rate (BMR) is the number of calories your body needs while resting. 
                This is the minimum amount of energy needed to keep your body functioning, including 
                breathing and keeping your heart beating.
              </p>
              <p>
                Total Daily Energy Expenditure (TDEE) takes your BMR and adjusts it based on your 
                activity level to estimate your total daily calorie needs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieIndex;