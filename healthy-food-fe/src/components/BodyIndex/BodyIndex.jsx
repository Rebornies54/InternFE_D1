import React, { useState } from 'react';
import './BodyIndex.css';

const BodyIndex = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      
      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory('Normal weight');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    }
  };

  return (
    <div className="body-index-container">
      <h1 className="body-index-title">体指数計算</h1>
      <div className="body-index-content">
        <h2>Body Mass Index (BMI) Calculator</h2>
        <p>Calculate your BMI to determine if your weight is in a healthy range.</p>
        
        <div className="calculator-form">
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input 
              type="number" 
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input 
              type="number" 
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </div>
          
          <button 
            className="calculate-button"
            onClick={calculateBMI}
            disabled={!height || !weight}
          >
            Calculate BMI
          </button>
        </div>

        {bmi && (
          <div className="bmi-result">
            <h3>Your BMI Result</h3>
            <div className="bmi-value">{bmi}</div>
            <div className="bmi-category">{bmiCategory}</div>
            <div className="bmi-info">
              <p><strong>BMI Categories:</strong></p>
              <ul>
                <li>Underweight: &lt; 18.5</li>
                <li>Normal weight: 18.5 - 24.9</li>
                <li>Overweight: 25 - 29.9</li>
                <li>Obese: ≥ 30</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyIndex; 