import React, { useState } from 'react';
import { useCalorieContext } from '../../context/CalorieContext';
import { VALIDATION } from '../../constants';
import { CalculatorForm, CalculationHistory, ResultsDisplay } from './components';
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
      setError(`Please enter a valid age between ${VALIDATION.MIN_AGE} and ${VALIDATION.MAX_AGE}`);
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

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const calorieGoals = calorieData.tdee > 0 ? getCalorieGoals(calorieData.tdee) : null;

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
      
      <CalculatorForm
        calorieData={calorieData}
        updateCalorieData={updateCalorieData}
        error={error}
        onCalculate={handleCalculate}
        onReset={handleReset}
        onUnitChange={handleUnitChange}
        onToggleHistory={handleToggleHistory}
        showHistory={showHistory}
      />
      
      <CalculationHistory
        history={calorieData.history}
        showHistory={showHistory}
        formatDate={formatDate}
        getWeightUnitLabel={getWeightUnitLabel}
      />
      
      <ResultsDisplay
        calorieData={calorieData}
        calorieGoals={calorieGoals}
        formatDate={formatDate}
      />
    </div>
  );
};

export default CalorieIndex;