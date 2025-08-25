import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ 
  calorieData, 
  calorieGoals, 
  formatDate 
}) => {
  if (!calorieData.showResults || !calorieGoals) {
    return null;
  }

  return (
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
  );
};

export default ResultsDisplay;
