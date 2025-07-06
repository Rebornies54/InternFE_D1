import React, { useState } from 'react';
import './CalorieCalculation.css';

const CalorieCalculation = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary'
  });
  const [result, setResult] = useState(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const calculateCalories = () => {
    const { age, gender, weight, height, activityLevel } = formData;
    
    if (!age || !weight || !height) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate daily calorie needs
    const dailyCalories = Math.round(bmr * activityMultipliers[activityLevel]);

    setResult({
      bmr: Math.round(bmr),
      dailyCalories,
      activityLevel
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      activityLevel: 'sedentary'
    });
    setResult(null);
  };

  return (
    <div className="calorie-calculation-container">
      <h1 className="calorie-calculation-title">カロリー計算</h1>
      <div className="calorie-calculation-content">
        <h2>Daily Calorie Needs Calculator</h2>
        <p>Calculate how many calories you need per day based on your age, gender, weight, height, and activity level.</p>
        
        <div className="calculator-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input 
                type="number" 
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select 
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg) *</label>
              <input 
                type="number" 
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter your weight"
                min="20"
                max="300"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height (cm) *</label>
              <input 
                type="number" 
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Enter your height"
                min="100"
                max="250"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="activityLevel">Activity Level</label>
            <select 
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very_active">Very active (very hard exercise & physical job)</option>
            </select>
          </div>
          
          <div className="button-group">
            <button 
              className="calculate-button"
              onClick={calculateCalories}
              disabled={!formData.age || !formData.weight || !formData.height}
            >
              Calculate Calories
            </button>
            <button 
              className="reset-button"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div className="calculation-result">
            <h3>Your Daily Calorie Needs</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Basal Metabolic Rate (BMR)</span>
                <span className="result-value">{result.bmr} calories/day</span>
                <span className="result-desc">Calories burned at rest</span>
              </div>
              <div className="result-item">
                <span className="result-label">Daily Calorie Needs</span>
                <span className="result-value highlight">{result.dailyCalories} calories/day</span>
                <span className="result-desc">Based on your activity level</span>
              </div>
            </div>
            <div className="activity-info">
              <p><strong>Activity Level:</strong> {formData.activityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Multiplier:</strong> {activityMultipliers[result.activityLevel]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculation; 