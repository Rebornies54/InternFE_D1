import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

export const FoodProvider = ({ children }) => {
  const [pendingFoods, setPendingFoods] = useState([]);

  // Add food to pending list (from BodyIndex)
  const addToPendingFoods = (food) => {
    const existingFood = pendingFoods.find(item => item.id === food.id);
    if (existingFood) {
      setPendingFoods(pendingFoods.map(item => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setPendingFoods([...pendingFoods, { ...food, quantity: 1 }]);
    }
  };

  // Remove food from pending list
  const removeFromPendingFoods = (foodId) => {
    setPendingFoods(pendingFoods.filter(item => item.id !== foodId));
  };

  // Update food quantity in pending list
  const updatePendingFoodQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromPendingFoods(foodId);
    } else {
      setPendingFoods(pendingFoods.map(item => 
        item.id === foodId ? { ...item, quantity } : item
      ));
    }
  };

  // Clear all pending foods
  const clearPendingFoods = () => {
    setPendingFoods([]);
  };

  // Get total calories from pending foods
  const getPendingTotalCalories = () => {
    if (!pendingFoods || pendingFoods.length === 0) return 0;
    return pendingFoods.reduce((total, food) => {
      return total + (food.calories * food.quantity);
    }, 0);
  };

  const value = {
    pendingFoods,
    addToPendingFoods,
    removeFromPendingFoods,
    updatePendingFoodQuantity,
    clearPendingFoods,
    getPendingTotalCalories
  };

  return (
    <FoodContext.Provider value={value}>
      {children}
    </FoodContext.Provider>
  );
}; 