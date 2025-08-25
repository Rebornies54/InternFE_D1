import React from 'react';
import './CalculationHistory.css';

const CalculationHistory = ({ 
  history, 
  showHistory, 
  formatDate, 
  getWeightUnitLabel 
}) => {
  if (!showHistory || !history || history.length === 0) {
    return null;
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <h3 className="history-title">Calculation History</h3>
        <div className="history-items">
          {history.map((entry, index) => (
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
  );
};

export default CalculationHistory;
