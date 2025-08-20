import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants';
import { CalorieContextType, ActivityLevel, Formula, UnitSystem, Gender } from '../types';

// Tạo context với type safety
const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

// Custom hook với type checking
export const useCalorieContext = (): CalorieContextType => {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error('useCalorieContext must be used within a CalorieProvider');
  }
  return context;
};

// Interface cho props của CalorieProvider
interface CalorieProviderProps {
  children: ReactNode;
}

// Interface cho calorie data
interface CalorieData {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  bodyFat: string;
  formula: Formula;
  unitSystem: UnitSystem;
  tdee: number;
  bmr: number;
  showResults: boolean;
  calculatedDate: string | null;
  history: Array<{
    date: string;
    weight: number;
    height: number;
    age: number;
    gender: Gender;
    activityLevel: ActivityLevel;
    bmr: number;
    tdee: number;
  }>;
}

// Interface cho calculation result
interface CalculationResult {
  success: boolean;
  bmr?: number;
  tdee?: number;
  message?: string;
}

// Interface cho calorie goals
interface CalorieGoals {
  maintenance: number;
  weightLoss: {
    mild: number;
    moderate: number;
    aggressive: number;
  };
  weightGain: {
    mild: number;
    moderate: number;
    aggressive: number;
  };
}

// Default calorie data
const defaultCalorieData: CalorieData = {
  age: 25,
  gender: 'female',
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

export const CalorieProvider: React.FC<CalorieProviderProps> = ({ children }) => {
  const [calorieData, setCalorieData] = useState<CalorieData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.CALORIE_DATA);
    return savedData ? JSON.parse(savedData) : defaultCalorieData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALORIE_DATA, JSON.stringify(calorieData));
  }, [calorieData]);

  const updateCalorieData = (newData: Partial<CalorieData>): void => {
    setCalorieData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  const resetCalorieData = (): void => {
    setCalorieData(defaultCalorieData);
  };

  const calculateMifflinStJeor = (weight: number, height: number, age: number, gender: Gender): number => {
    const w = parseFloat(weight.toString());
    const h = parseFloat(height.toString());
    const a = parseFloat(age.toString());
    
    if (gender === 'male') {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

  const calculateHarrisBenedict = (weight: number, height: number, age: number, gender: Gender): number => {
    const w = parseFloat(weight.toString());
    const h = parseFloat(height.toString());
    const a = parseFloat(age.toString());
    
    if (gender === 'male') {
      return 13.397 * w + 4.799 * h - 5.677 * a + 88.362;
    } else {
      return 9.247 * w + 3.098 * h - 4.330 * a + 447.593;
    }
  };

  const calculateKatchMcArdle = (weight: number, bodyFat: number): number | null => {
    const w = parseFloat(weight.toString());
    const f = parseFloat(bodyFat.toString()) / 100;
    
    if (isNaN(f)) {
      return null;
    }
    
    return 370 + 21.6 * (1 - f) * w;
  };

  const calculateBMR = (data: CalorieData): CalculationResult => {
    const { weight, height, age, gender, bodyFat, formula, unitSystem } = data;
    let weightKg = weight;
    let heightCm = height;
    
    if (unitSystem === 'imperial') {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }
    
    let bmr: number;
    
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
        const katchResult = calculateKatchMcArdle(weightKg, parseFloat(bodyFat));
        if (katchResult === null) {
          return { success: false, message: 'Invalid body fat percentage' };
        }
        bmr = katchResult;
        break;
      default:
        bmr = calculateMifflinStJeor(weightKg, heightCm, age, gender);
    }
    
    return { success: true, bmr: Math.round(bmr) };
  };

  const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
    let activityMultiplier: number;
    
    switch(activityLevel) {
      case 'Sedentary: Little or no exercise':
        activityMultiplier = 1.2;
        break;
      case 'Lightly active: Light exercise/sports 1-3 days/week':
        activityMultiplier = 1.375;
        break;
      case 'Moderately active: Moderate exercise/sports 3-5 days/week':
        activityMultiplier = 1.55;
        break;
      case 'Very active: Hard exercise/sports 6-7 days a week':
        activityMultiplier = 1.725;
        break;
      case 'Extra active: Very hard exercise/sports, physical job':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    return Math.round(bmr * activityMultiplier);
  };

  const performCalculation = (): CalculationResult => {
    if (!calorieData.activityLevel) {
      return { success: false, message: 'Please select activity level' };
    }
    
    const bmrResult = calculateBMR(calorieData);
    
    if (!bmrResult.success || !bmrResult.bmr) {
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

  const getCalorieGoals = (tdee: number): CalorieGoals => {
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

  const convertUnits = (unitSystem: UnitSystem): void => {
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

  const value: CalorieContextType = {
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
