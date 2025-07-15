import React, { useState } from 'react';
import './CalorieIndex.css';

const CalorieIndex = () => {
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('Female'); // Female as default
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('60');
  const [activityLevel, setActivityLevel] = useState('');
  const [tdee, setTdee] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const calculateBMR = () => {
    // Harris-Benedict formula
    if (gender === 'Male') { // Male
      return 66 + (13.7 * parseFloat(weight)) + (5 * parseFloat(height)) - (6.8 * parseFloat(age));
    } else { // Female
      return 655 + (9.6 * parseFloat(weight)) + (1.8 * parseFloat(height)) - (4.7 * parseFloat(age));
    }
  };

  const calculateTDEE = (bmr) => {
    let activityMultiplier = 1.2; // Default: Sedentary
    
    switch(activityLevel) {
      case 'Sedentary: Little or no exercise':
        activityMultiplier = 1.375;
        break;
      case 'Lightly active: 1-3 times/week':
        activityMultiplier = 1.55;
        break;
      case 'Moderately active: 4-5 times/week':
        activityMultiplier = 1.725;
        break;
      case 'Very active: 6-7 times/week or more':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    return bmr * activityMultiplier;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Check if activity level has been selected
    if (!activityLevel || activityLevel === '') {
      alert('Please select activity level');
      return;
    }
    
    const calculatedBMR = calculateBMR();
    setTdee(calculateTDEE(calculatedBMR));
    setShowResults(true);
  };

  const handleReset = () => {
    setAge('20');
    setGender('Female');
    setHeight('170');
    setWeight('60');
    setActivityLevel('');
    setShowResults(false);
  };

  return (
    <div className="calorie-calculator-container">
      <h1 className="calculator-title">Daily Calorie Needs Calculator</h1>
      
      <div className="calculator-card">
        <form className="calculator-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  id="age" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                />
                <span className="unit">years</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  id="height" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="50"
                  max="250"
                />
                <span className="unit">cm</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  id="weight" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="20"
                  max="500"
                />
                <span className="unit">kg</span>
              </div>
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-options">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === 'Female'}
                    onChange={() => setGender('Female')}
                  />
                  <span className="radio-text">Female</span>
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === 'Male'}
                    onChange={() => setGender('Male')}
                  />
                  <span className="radio-text">Male</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-group activity-group">
            <label htmlFor="activity">Activity Level</label>
            <div className="select-wrapper">
              <select 
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="activity-select"
              >
                <option value="" disabled>Select activity level</option>
                <option value="Sedentary: Little or no exercise">Sedentary: Little or no exercise</option>
                <option value="Lightly active: 1-3 times/week">Lightly active: 1-3 times/week</option>
                <option value="Moderately active: 4-5 times/week">Moderately active: 4-5 times/week</option>
                <option value="Very active: 6-7 times/week or more">Very active: 6-7 times/week or more</option>
              </select>
            </div>
          </div>
          
          <div className="button-group">
            <button type="button" onClick={handleCalculate} className="calculate-btn">Calculate</button>
            <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
          </div>
          
          <div className="calculator-note">
            <p>Cố Lên !</p>
          </div>
        </form>
      </div>
      
      {showResults && (
        <div className="results-container">
          <div className="results-card">
            <div className="total-calories">
              <h2>Your Daily Calorie Needs</h2>
              <div className="calorie-value">{Math.round(tdee)} calories</div>
              <p>To maintain your current weight</p>
            </div>
            
            <div className="weight-scenarios">
              <h3 className="scenarios-title">Weight Management Goals</h3>
              
              <div className="scenario-grid">
                <div className="scenario-column weight-loss">
                  <h4>Weight Loss</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">Mild (0.25kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 0.85)} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Moderate (0.5kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 0.7)} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Aggressive (1kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 0.41)} calories</div>
                  </div>
                </div>
                
                <div className="scenario-column weight-gain">
                  <h4>Weight Gain</h4>
                  <div className="scenario-item">
                    <div className="scenario-label">Mild (0.25kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 1.15)} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Moderate (0.5kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 1.30)} calories</div>
                  </div>
                  <div className="scenario-item">
                    <div className="scenario-label">Aggressive (1kg/week)</div>
                    <div className="scenario-value">{Math.round(tdee * 1.59)} calories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieIndex;