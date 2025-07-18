import React, { createContext, useContext, useState, useEffect } from 'react';

const CalorieContext = createContext();

export const useCalorieContext = () => {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error('useCalorieContext must be used within a CalorieProvider');
  }
  return context;
};

export const CalorieProvider = ({ children }) => {
  // Load data from localStorage on initialization
  const [calorieData, setCalorieData] = useState(() => {
    const savedData = localStorage.getItem('calorieCalculationData');
    return savedData ? JSON.parse(savedData) : {
      age: 25,
      gender: 'Female',
      height: 170,
      weight: 60,
      activityLevel: 'Sedentary: Little or no exercise',
      bodyFat: '',
      formula: 'mifflin',
      unitSystem: 'metric',
      tdee: 0,
      bmr: 0,
      showResults: false,
      calculatedDate: null,
      history: []
    };
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calorieCalculationData', JSON.stringify(calorieData));
  }, [calorieData]);

  // Update calorie data
  const updateCalorieData = (newData) => {
    setCalorieData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  // Reset data to defaults
  const resetCalorieData = () => {
    const defaultData = {
      age: 25,
      gender: 'Female',
      height: 170,
      weight: 60,
      activityLevel: 'Sedentary: Little or no exercise',
      bodyFat: '',
      formula: 'mifflin',
      unitSystem: 'metric',
      tdee: 0,
      bmr: 0,
      showResults: false,
      calculatedDate: null
    };
    setCalorieData(defaultData);
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateMifflinStJeor = (weight, height, age, gender) => {
    // Convert string inputs to numbers if needed
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    if (gender === 'Male') {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

  // Calculate BMR using Revised Harris-Benedict Equation
  const calculateHarrisBenedict = (weight, height, age, gender) => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    if (gender === 'Male') {
      return 13.397 * w + 4.799 * h - 5.677 * a + 88.362;
    } else {
      return 9.247 * w + 3.098 * h - 4.330 * a + 447.593;
    }
  };

  // Calculate BMR using Katch-McArdle Formula (requires body fat percentage)
  const calculateKatchMcArdle = (weight, bodyFat) => {
    const w = parseFloat(weight);
    const f = parseFloat(bodyFat) / 100; // Convert percentage to decimal
    
    if (isNaN(f)) {
      return null; // Return null if body fat is not provided
    }
    
    return 370 + 21.6 * (1 - f) * w;
  };

  // Calculate BMR based on selected formula
  const calculateBMR = (data) => {
    const { weight, height, age, gender, bodyFat, formula, unitSystem } = data;
    
    // Convert imperial to metric if needed
    let weightKg = weight;
    let heightCm = height;
    
    if (unitSystem === 'imperial') {
      weightKg = weight * 0.453592; // Convert pounds to kg
      heightCm = height * 2.54; // Convert inches to cm
    }
    
    let bmr;
    
    switch(formula) {
      case 'mifflin':
        bmr = calculateMifflinStJeor(weightKg, heightCm, age, gender);
        break;
      case 'harris':
        bmr = calculateHarrisBenedict(weightKg, heightCm, age, gender);
        break;
      case 'katch':
        if (!bodyFat || isNaN(parseFloat(bodyFat))) {
          return { success: false, message: 'Body fat percentage is required for Katch-McArdle formula' };
        }
        bmr = calculateKatchMcArdle(weightKg, bodyFat);
        break;
      default:
        bmr = calculateMifflinStJeor(weightKg, heightCm, age, gender);
    }
    
    return { success: true, bmr: Math.round(bmr) };
  };

  // Calculate TDEE based on BMR and activity level
  const calculateTDEE = (bmr, activityLevel) => {
    let activityMultiplier;
    
    switch(activityLevel) {
      case 'Sedentary: Little or no exercise':
        activityMultiplier = 1.2;
        break;
      case 'Lightly active: 1-3 times/week':
        activityMultiplier = 1.375;
        break;
      case 'Moderately active: 4-5 times/week':
        activityMultiplier = 1.465;
        break;
      case 'Very active: 6 times/week or more':
        activityMultiplier = 1.55;
        break;
      case 'Extra active: Physical job or twice daily training':
        activityMultiplier = 1.725;
        break;
      case 'Professional athlete':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    return Math.round(bmr * activityMultiplier);
  };

  // Perform full calculation
  const performCalculation = () => {
    if (!calorieData.activityLevel || calorieData.activityLevel === '') {
      return { success: false, message: 'Please select activity level' };
    }
    
    const bmrResult = calculateBMR(calorieData);
    
    if (!bmrResult.success) {
      return bmrResult;
    }
    
    const bmr = bmrResult.bmr;
    const tdee = calculateTDEE(bmr, calorieData.activityLevel);
    
    // Create a history entry
    const newHistoryEntry = {
      date: new Date().toISOString(),
      weight: calorieData.weight,
      height: calorieData.height,
      age: calorieData.age,
      gender: calorieData.gender,
      activityLevel: calorieData.activityLevel,
      bmr: bmr,
      tdee: tdee
    };
    
    // Add entry to history, keeping only the last 10 entries
    const updatedHistory = [newHistoryEntry, ...(calorieData.history || [])].slice(0, 10);
    
    updateCalorieData({
      bmr: bmr,
      tdee: tdee,
      showResults: true,
      calculatedDate: new Date().toISOString(),
      history: updatedHistory
    });
    
    return { success: true, bmr: bmr, tdee: tdee };
  };

  // Get calorie goals based on TDEE
  const getCalorieGoals = (tdee) => {
    return {
      maintenance: Math.round(tdee),
      weightLoss: {
        mild: Math.round(tdee - 250), // -0.25kg per week
        moderate: Math.round(tdee - 500), // -0.5kg per week
        aggressive: Math.round(tdee - 1000) // -1kg per week
      },
      weightGain: {
        mild: Math.round(tdee + 250), // +0.25kg per week
        moderate: Math.round(tdee + 500), // +0.5kg per week
        aggressive: Math.round(tdee + 1000) // +1kg per week
      }
    };
  };

  // Convert between metric and imperial units
  const convertUnits = (unitSystem) => {
    if (unitSystem === 'metric' && calorieData.unitSystem === 'imperial') {
      // Convert from imperial to metric
      updateCalorieData({
        unitSystem: 'metric',
        weight: Math.round(calorieData.weight * 0.453592), // lb to kg
        height: Math.round(calorieData.height * 2.54) // in to cm
      });
    } else if (unitSystem === 'imperial' && calorieData.unitSystem === 'metric') {
      // Convert from metric to imperial
      updateCalorieData({
        unitSystem: 'imperial',
        weight: Math.round(calorieData.weight * 2.20462), // kg to lb
        height: Math.round(calorieData.height / 2.54) // cm to in
      });
    }
  };

  const value = {
    calorieData,
    updateCalorieData,
    resetCalorieData,
    performCalculation,
    getCalorieGoals,
    calculateBMR,
    calculateTDEE,
    convertUnits
  };

  return (
    <CalorieContext.Provider value={value}>
      {children}
    </CalorieContext.Provider>
  );
};