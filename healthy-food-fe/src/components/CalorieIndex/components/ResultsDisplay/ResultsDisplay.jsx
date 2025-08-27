import React from 'react';
import { CALORIE_CALCULATOR } from '../../../../constants';
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
          <h2>{CALORIE_CALCULATOR.RESULTS.TITLE}</h2>
          <div className="metabolic-info">
            <div className="metabolic-item">
              <div className="metabolic-label">{CALORIE_CALCULATOR.RESULTS.BMR_LABEL}</div>
              <div className="metabolic-value">{calorieData.bmr} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
            </div>
            <div className="metabolic-item">
              <div className="metabolic-label">{CALORIE_CALCULATOR.RESULTS.TDEE_LABEL}</div>
              <div className="calorie-value">{calorieGoals.maintenance} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
            </div>
          </div>
          <p>{CALORIE_CALCULATOR.RESULTS.TDEE_DESCRIPTION}</p>
          {calorieData.calculatedDate && (
            <p className="calculation-date">
              {CALORIE_CALCULATOR.RESULTS.CALCULATED_ON} {formatDate(calorieData.calculatedDate)}
            </p>
          )}
        </div>
        
        <div className="weight-scenarios">
          <h3 className="scenarios-title">{CALORIE_CALCULATOR.RESULTS.WEIGHT_MANAGEMENT_TITLE}</h3>    
          <div className="scenario-grid">
            <div className="scenario-column weight-loss">
              <h4>{CALORIE_CALCULATOR.RESULTS.WEIGHT_LOSS_TITLE}</h4>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.MILD_025}</div>
                <div className="scenario-value">{calorieGoals.weightLoss.mild} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.MODERATE_05}</div>
                <div className="scenario-value">{calorieGoals.weightLoss.moderate} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.AGGRESSIVE_1}</div>
                <div className="scenario-value">{calorieGoals.weightLoss.aggressive} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
            </div>
            
            <div className="scenario-column weight-gain">
              <h4>{CALORIE_CALCULATOR.RESULTS.WEIGHT_GAIN_TITLE}</h4>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.MILD_025}</div>
                <div className="scenario-value">{calorieGoals.weightGain.mild} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.MODERATE_05}</div>
                <div className="scenario-value">{calorieGoals.weightGain.moderate} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
              <div className="scenario-item">
                <div className="scenario-label">{CALORIE_CALCULATOR.RESULTS.SCENARIOS.AGGRESSIVE_1}</div>
                <div className="scenario-value">{calorieGoals.weightGain.aggressive} {CALORIE_CALCULATOR.RESULTS.UNITS.CALORIES}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bmr-explanation">
          <h4>{CALORIE_CALCULATOR.RESULTS.EXPLANATION.TITLE}</h4>
          <p>
            {CALORIE_CALCULATOR.RESULTS.EXPLANATION.BMR_DESCRIPTION}
          </p>
          <p>
            {CALORIE_CALCULATOR.RESULTS.EXPLANATION.TDEE_DESCRIPTION}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
