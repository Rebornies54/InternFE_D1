import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FoodItem, FoodContextType, PendingFoodItem } from '../types';

// Tạo context với type safety
const FoodContext = createContext<FoodContextType | undefined>(undefined);

// Custom hook với type checking
export const useFoodContext = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

// Interface cho props của FoodProvider
interface FoodProviderProps {
  children: ReactNode;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({ children }) => {
  const [pendingFoods, setPendingFoods] = useState<PendingFoodItem[]>([]);

  const addToPendingFoods = (food: FoodItem, quantity: number = 1): void => {
    const existingFood = pendingFoods.find(item => item.id === food.id);
    if (existingFood) {
      setPendingFoods(pendingFoods.map(item => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setPendingFoods([...pendingFoods, { ...food, quantity }]);
    }
  };

  const removeFromPendingFoods = (foodId: number): void => {
    setPendingFoods(pendingFoods.filter(item => item.id !== foodId));
  };

  const updatePendingFoodQuantity = (foodId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromPendingFoods(foodId);
    } else {
      setPendingFoods(pendingFoods.map(item => 
        item.id === foodId ? { ...item, quantity } : item
      ));
    }
  };

  const clearPendingFoods = (): void => {
    setPendingFoods([]);
  };

  const getPendingTotalCalories = (): number => {
    if (!pendingFoods || pendingFoods.length === 0) return 0;
    return pendingFoods.reduce((total: number, food: PendingFoodItem) => {
      return total + (food.calories * food.quantity);
    }, 0);
  };

  const value: FoodContextType = {
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
