import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCalorieContext } from '../../context/CalorieContext';
import { useFoodContext } from '../../context/FoodContext';
import { authAPI, foodAPI } from '../../services/api';
import { BMI_RANGES, BMI } from '../../constants';
import BMICalculator from './components/BMICalculator';
import FoodRecommendations from './components/FoodRecommendations';
import './BodyIndex.css';

const BodyIndex = () => {
  const { currentBmi, setCurrentBmi } = useAuth();
  const { 
    foodItems: contextFoodItems, 
    categories: contextCategories 
  } = useFoodContext();
  const { 
    pendingFoods: pendingCalorieFoods,
    addToPendingCalorieFoods,
    removeFromPendingCalorieFoods,
    updatePendingCalorieFoodQuantity,
    getPendingCalorieTotalCalories
  } = useCalorieContext();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiLoading, setBmiLoading] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextFoodItems && contextFoodItems.length > 0 && contextCategories && contextCategories.length > 0) {
      setFoodItems(contextFoodItems);
      setCategories(contextCategories);
    } else {
      loadFoodData();
    }

    if (!currentBmi) {
      loadBMIData();
    } else {
      setBmi(currentBmi.toString());
      generateRecommendations(currentBmi.toString());
      loadFullBMIData();
    }
  }, [currentBmi, contextFoodItems, contextCategories]);

  const loadFoodData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        foodAPI.getCategories(),
        foodAPI.getAllItems()
      ]);

      setCategories(categoriesRes.data.data);
      setFoodItems(itemsRes.data.data);
    } catch (error) { /* Error handled */ } finally {
      setLoading(false);
    }
  };

  const loadBMIData = async () => {
    try {
      setBmiLoading(true);
      const response = await authAPI.getBMIData();
      if (response.data.success && response.data.data) {
        const bmiData = response.data.data;
        setHeight(bmiData.height.toString());
        setWeight(bmiData.weight.toString());
        setBmi(bmiData.bmi.toString());
        setCurrentBmi(Number(bmiData.bmi));

        generateRecommendations(bmiData.bmi.toString());
      }
    } catch (error) {
    } finally {
      setBmiLoading(false);
    }
  };

  const loadFullBMIData = async () => {
    if (!height || !weight) {
      await loadBMIData();
    }
  };

  const handleCalculate = async () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
      const bmiCategory = getBMICategory(bmiValue).toLowerCase().replace(' ', '');

      setBmi(bmiValue);
      generateRecommendations(bmiValue);

      try {
        await authAPI.saveBMIData({
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmiValue),
          bmi_category: bmiCategory
        });
        setCurrentBmi(parseFloat(bmiValue));
      } catch (error) {
      }
    }
  };

  const generateRecommendations = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    let recommendedCategories = [];

    if (bmi < BMI_RANGES.NORMAL.min) {
      recommendedCategories = [1, 4, 5, 6]; 
    } else if (bmi >= BMI_RANGES.NORMAL.min && bmi < BMI_RANGES.OVERWEIGHT.min) {
      recommendedCategories = [2, 3, 4, 5]; 
    } else if (bmi >= BMI_RANGES.OVERWEIGHT.min && bmi < BMI_RANGES.OBESE.min) {
      recommendedCategories = [2, 3]; 
    } else {
      recommendedCategories = [2]; 
    }

    const recommended = foodItems.filter(item =>
      recommendedCategories.includes(item.category_id)
    );

    setRecommendedFoods(recommended.slice(0, 8));
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < BMI_RANGES.NORMAL.min) return 'Underweight';
    if (bmiValue >= BMI_RANGES.NORMAL.min && bmiValue < BMI_RANGES.OVERWEIGHT.min) return 'Normal weight';
    if (bmiValue >= BMI_RANGES.OVERWEIGHT.min && bmiValue < BMI_RANGES.OBESE.min) return 'Overweight';
    return 'Obese';
  };

  const addToCalorieCalculation = (food) => {
    if (addToPendingCalorieFoods) {
      addToPendingCalorieFoods(food);
    }
  };

  const removeFromCalorieCalculation = (foodId) => {
    if (removeFromPendingCalorieFoods) {
      removeFromPendingCalorieFoods(foodId);
    }
  };

  const updateFoodQuantity = (foodId, quantity) => {
    if (updatePendingCalorieFoodQuantity) {
      updatePendingCalorieFoodQuantity(foodId, quantity);
    }
  };

  const calculateTotalCalories = () => {
    try {
      if (typeof getPendingCalorieTotalCalories === 'function') {
        return getPendingCalorieTotalCalories() || 0;
      } else {
        return pendingCalorieFoods.reduce((total, food) => {
          return total + (food.calories * food.quantity);
        }, 0);
      }
    } catch (error) {
      return 0;
    }
  };

  return (
    <div className="body-index-container">
      <h1 className="body-index-title">{BMI.TITLE}</h1>
      <div className="body-index-content">
        <BMICalculator
          height={height}
          weight={weight}
          bmi={bmi}
          bmiLoading={bmiLoading}
          onHeightChange={(e) => setHeight(e.target.value)}
          onWeightChange={(e) => setWeight(e.target.value)}
          onCalculate={handleCalculate}
        />

        <FoodRecommendations
          recommendedFoods={recommendedFoods}
          loading={loading}
          bmi={bmi}
          categories={categories}
          pendingFoods={pendingCalorieFoods}
          onAddToCalorie={addToCalorieCalculation}
          onUpdateQuantity={updateFoodQuantity}
          onRemoveFood={removeFromCalorieCalculation}
          totalCalories={calculateTotalCalories()}
        />
      </div>
    </div>
  );
};

export default BodyIndex;