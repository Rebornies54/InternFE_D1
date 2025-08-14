import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, UI } from '../constants';

const CalorieContext = createContext();

export const useCalorieContext = () => {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error('useCalorieContext must be used within a CalorieProvider');
  }
  return context;
};

export const CalorieProvider = ({ children }) => {
  const [calorieData, setCalorieData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.CALORIE_DATA);
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALORIE_DATA, JSON.stringify(calorieData));
  }, [calorieData]);

  const updateCalorieData = (newData) => {
    setCalorieData(prev => ({
      ...prev,
      ...newData,
    }));
  };

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

  const calculateMifflinStJeor = (weight, height, age, gender) => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    if (gender === 'Male') {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

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

  const calculateKatchMcArdle = (weight, bodyFat) => {
    const w = parseFloat(weight);
    const f = parseFloat(bodyFat) / 100;
    
    if (isNaN(f)) {
      return null;
    }
    
    return 370 + 21.6 * (1 - f) * w;
  };

  const calculateBMR = (data) => {
    const { weight, height, age, gender, bodyFat, formula, unitSystem } = data;
    let weightKg = weight;
    let heightCm = height;
    
          if (unitSystem === 'imperial') {
        weightKg = weight * 0.453592;
        heightCm = height * 2.54;
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

  const getCalorieGoals = (tdee) => {
    return {
      maintenance: Math.round(tdee),
      weightLoss: {
        mild: Math.round(tdee - 250),
        moderate: Math.round(tdee - 500),
        aggressive: Math.round(tdee - 1000)
      },
      weightGain: {
        mild: Math.round(tdee + 250),
        moderate: Math.round(tdee + 500),
        aggressive: Math.round(tdee + 1000)
      }
    };
  };

  const convertUnits = (unitSystem) => {
    if (unitSystem === 'metric' && calorieData.unitSystem === 'imperial') {
      updateCalorieData({
        unitSystem: 'metric',
        weight: Math.round(calorieData.weight * 0.453592),
        height: Math.round(calorieData.height * 2.54)
      });
    } else if (unitSystem === 'imperial' && calorieData.unitSystem === 'metric') {
      updateCalorieData({
        unitSystem: 'imperial',
        weight: Math.round(calorieData.weight * 2.20462),
        height: Math.round(calorieData.height / 2.54)
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